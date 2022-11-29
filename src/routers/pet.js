const Pet = require("../models/pet");
const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/pets", auth, async (req, res) => {
  const pet = new Pet({ ...req.body, owner: req.owner._id });
  try {
    await pet.save();
    res.status(201).send(pet);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/pets", auth, async (req, res) => {
  const { kind, age, limit, skip, sortBy } = req.query;
  const payload = {};
  const sort = {};

  if (kind) {
    payload.kind = kind;
  }
  if (age) {
    payload.age = age;
  }
  if (sortBy) {
    const parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.owner
      .populate({
        path: "pets",
        match: { ...payload },
        options: {
          limit: +limit,
          skip: +skip,
          sort,
        },
      })
      .execPopulate();

    if (req.owner.pets.length === 0 && Object.keys(req.owner.pets).length === 0)
      return res.status(404).send("No pet registered!");
    res.send(req.owner.pets);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/pets/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    // const pet = await Pet.findById(id);
    const pet = await Pet.findOne({ _id: id, owner: req.owner.id });
    if (!pet) return res.status(404).send("Pet not found!");
    res.send(pet);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/pets/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "kind", "owner"];
  const isAllowed = updates.every((update) => allowedUpdates.includes(update));
  if (!isAllowed) return res.status(400).send("Invalid patch attempt!");

  const { id } = req.params;
  try {
    // const pet = await Pet.findById(id);
    const pet = await Pet.findOne({ _id: id, owner: req.owner.id });
    if (!pet) return res.status(404).send("You don't own this pet!");
    updates.forEach((update) => (pet[update] = req.body[update]));
    await pet.save();
    res.send(pet);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/pets/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findOneAndDelete({ owner: req.owner.id });
    if (!pet) return res.status(404).send("You don't own such pet!");
    res.status(204).send("Deleted");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
