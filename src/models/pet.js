const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age can't be negative!");
        }
      },
    },
    kind: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
