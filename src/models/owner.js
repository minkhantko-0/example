const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Pet = require("./pet");

const ownerSchema = new mongoose.Schema(
  {
    avatar: {
      type: Buffer,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      default: 0,
      type: Number,
      min: 0,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Your email is invalid");
      },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Password must not contain password!");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ownerSchema.virtual("pets", {
  ref: "Pet",
  localField: "_id",
  foreignField: "owner",
});

ownerSchema.methods.toJSON = function () {
  const owner = this;
  const ownerObject = owner.toObject();

  delete ownerObject.password;
  delete ownerObject.tokens;

  return ownerObject;
};

ownerSchema.methods.generateAuthToken = async function () {
  const owner = this;
  const token = jwt.sign({ _id: owner.id.toString() }, "nodeproject");

  owner.tokens = owner.tokens.concat({ token });
  await owner.save();

  return token;
};

ownerSchema.statics.findByCredentials = async (email, password) => {
  const owner = await PetOwner.findOne({ email });
  if (!owner) throw new Error("Unable to login!"); // no owner registered under this address

  const isMatched = await bcrypt.compare(password, owner.password);
  if (!isMatched) throw new Error("Unable to login!"); // wrong password

  return owner;
};

// hash password before saving
ownerSchema.pre("save", async function (next) {
  const owner = this;

  if (owner.isModified("password")) {
    owner.password = await bcrypt.hash(owner.password, 8);
  }

  next();
});

// unregister the pets after the owner is unregistered
ownerSchema.pre("remove", async function (next) {
  const owner = this;
  await Pet.deleteMany({ owner: owner._id });
  next();
});

const PetOwner = mongoose.model("Owner", ownerSchema);

module.exports = PetOwner;
