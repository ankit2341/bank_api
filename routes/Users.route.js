const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { auth } = require("../middlewares/Authorization");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/Users.model");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(404).send({ msg: "404 error" });
  }
});

userRouter.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const users = await UserModel.find({ email });
    if (users.length > 0) {
      res.status(200).send({ msg: "already registered" });
    } else {
      bcrypt.hash(password, 5, async (err, secured_pass) => {
        if (err) {
          res.status(404).send({ msg: "failed to register" });
        } else {
          const user = new UserModel({
            email,
            password: secured_pass,
            funds: 0,
            role,
          });
          await user.save();
          res.send({ msg: "registered" });
        }
      });
    }
  } catch (err) {
    res.status(404).send({ msg: "404 error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    const hashed_pass = user[0].password;
    if (user.length > 0) {
      bcrypt.compare(password, hashed_pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ course: "backend" }, process.env.secret);
          res.status(200).send({
            msg: "logged in",
            token: token,
            username: user[0].email,
            id: user[0]._id,
            funds: user[0].funds,
            role: user[0].role,
          });
        } else {
          res.status(404).send({ msg: "wrongcred" });
        }
      });
    } else {
      res.status(200).send({ msg: "newuser" });
    }
  } catch (err) {
    res.status(404).send({ msg: "404 error" });
  }
});

userRouter.use(auth);

userRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  try {
    await UserModel.findByIdAndUpdate({ _id: id }, payload);
    res.status(200).send({ msg: "updated" });
  } catch (err) {
    res.status(404).send({ msg: "404 eror" });
  }
});

userRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await UserModel.findByIdAndDelete({ _id: id });
    res.send({ msg: "user deleted" });
  } catch (err) {
    res.status(404).send({ msg: "404 error" });
  }
});

userRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const users = await UserModel.find({ _id: id });
    res.status(200).send(users);
  } catch (err) {
    res.status(404).send({ msg: "404 error" });
  }
});


userRouter.get("/checkrole/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.find({ _id: id });
    if (user[0].role == "banker") {
      res.status(200).send({ msg: "Welcome banker" });
    } else {
      res.status(404).send({ msg: "Not Authorized" });
    }
  } catch (error) {
    res.status(404).send({ msg: "404 error" });
  }
});

module.exports = {
  userRouter,
};
