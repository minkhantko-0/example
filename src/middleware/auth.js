const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const owner = await Owner.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!owner) throw new Error();

    req.token = token;
    req.owner = owner;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate!" });
  }
};

module.exports = auth;
