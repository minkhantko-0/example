const express = require("express");
const router = new express.Router();
const sharp = require("sharp");
const Owner = require("../models/owner");
const auth = require("../middleware/auth");

router.post("/owners", async (req, res) => {
  const owner = new Owner(req.body);
  try {
    await owner.save();
    const token = await owner.generateAuthToken();
    res.status(201).send({ owner, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/owners/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const owner = await Owner.findByCredentials(email, password);
    const token = await owner.generateAuthToken();
    res.send({ owner, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/owners/logout", auth, async (req, res) => {
  try {
    req.owner.tokens = req.owner.tokens.filter(({ token }) => {
      return token !== req.token;
    });
    await req.owner.save();

    res.send();
  } catch (e) {
    req.status(500).send();
  }
});

router.post("/owners/logoutAll", auth, async (req, res) => {
  try {
    req.owner.tokens = [];
    await req.owner.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error("Please upload an image!"));
    }

    cb(undefined, true);
  },
});

router.patch(
  "/owners/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.owner.avatar = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    await req.owner.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.get("/owners/me", auth, async (req, res) => {
  res.send(req.owner);
});

router.get("/owners/me/avatar", auth, async (req, res) => {
  res.set("Content-Type", "image/jpg");
  res.send(req.owner.avatar);
});

router.get("/owners/:id/avatar", async (req, res) => {
  const { id } = req.params;
  try {
    const owner = await Owner.findById(id);
    if (!owner || !owner.avatar) return res.status(404).send();
    res.set("Content-Type", "image/jpg");
    res.send(owner.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.get("/owners/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const owner = await Owner.findById(id);
    if (!owner) return res.status(404).send("Owner not found!");
    res.send(owner);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/owners/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isAllowed = updates.every((update) => allowedUpdates.includes(update));
  if (!isAllowed) return res.status(400).send("Invalid patch attempt!");

  const id = req.owner._id;
  try {
    updates.forEach((update) => (req.owner[update] = req.body[update]));
    await req.owner.save();

    if (!req.owner) return res.status(404).send("Owner not found!");
    res.send(req.owner);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/owners/me", auth, async (req, res) => {
  try {
    req.owner.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/owners/me/profile", auth, async (req, res) => {
  req.owner.avatar = undefined;
  await req.owner.save();
  res.status(204).send();
});

module.exports = router;
