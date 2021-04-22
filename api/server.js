const express = require("express");

const Users = require("./users/users-model.js");

const server = express();

server.use(express.json());

server.get("/users", async (req, res) => {
  try {
    const allUsers = await Users.get();
    if (!allUsers) {
      res.status(404).json({ message: "could not find users" });
    } else {
      res.status(200).json(allUsers);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

server.post("/users", async (req, res) => {
  try {
    const newUser = await Users.create(req.body);
    if (!newUser) {
      res.status(401).json({ message: "could not create user" });
    } else {
      res.status(200).json(newUser);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

server.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await Users.remove(req.params.id);
    if (!deletedUser) {
      res.status(401).json({ message: "could not delete user" });
    } else {
      res.status(200).json(deletedUser);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

module.exports = server;
