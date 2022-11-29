const express = require("express");
require("./db/mongoose");
const ownerRouter = require("./routers/owner");
const petRouter = require("./routers/pet");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(ownerRouter);
app.use(petRouter);

// populating from pet to owner
// const Pet = require("./models/pet");
// async function main() {
//   const pet = await Pet.findById("6379151205338237f8d33cdf");
//   await pet.populate("owner").execPopulate();
//   console.log(pet.owner);
// }

// populating from owner to pet
// const Owner = require("./models/owner");
// IIFE
// (async () => {
//   const owner = await Owner.findById("6379004165763229f20ad1a1");
//   await owner.populate("pets").execPopulate();
//   console.log(owner.pets);
// })();

app.listen(port, () => {
  console.log("Hello from " + port);
});
