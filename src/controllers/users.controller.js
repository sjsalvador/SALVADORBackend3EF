const { usersService } = require("../services/index.js");

const getAllUsers = async (req, res) => {
  const users = await usersService.getAll();
  res.send({ status: "success", payload: users });
};

const getUser = async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user) return res.status(404).send({ status: "error", error: "User not found" });
  res.send({ status: "success", payload: user });
};

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).send({ status: "error", error: "Missing required fields" });
    }

    const existingUser = await usersService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).send({ status: "error", error: "User already exists" });
    }

    const newUser = await usersService.create({ first_name, last_name, email, password });
    if (!newUser || !newUser._id) {
      return res.status(500).send({ status: "error", error: "User creation failed" });
    }

    res.send({ status: "success", payload: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user) return res.status(404).send({ status: "error", error: "User not found" });
  const result = await usersService.update(userId, updateBody);
  res.send({ status: "success", message: "User updated" });
};

const deleteUser = async (req, res) => {
  const userId = req.params.uid;
  const result = await usersService.getUserById(userId);
  res.send({ status: "success", message: "User deleted" });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser, 
  updateUser,
  deleteUser,
};
