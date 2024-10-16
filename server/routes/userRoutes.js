const express = require("express");

const {
  createUser,
  getUsersById,
  getUsers,
  getUsersByCustomId,
  getUserByQuery,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authentication = require("../middleware/authMiddleWare");
const router = express.Router();


router.get("/users",authentication, getUsers);
router.get("/users/:id", authentication, getUsersById);
router.get("/users/custom/:id", authentication, getUsersByCustomId);
router.get("/user_query", authentication, getUserByQuery);
router.post("/user", authentication, createUser);
router.put("/user/update/:id", authentication, updateUser);
router.delete("/user/delete/:id", authentication, deleteUser);

module.exports = router;
