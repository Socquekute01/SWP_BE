const express = require("express");
const {
	registerAccount,
	getListUser,
	updateUserById,
	deleteUserById,
	getUserById,
	logOutAccount,
	loginAccount,
} = require("../controllers").user;
const { checkAuthAndRole } = require("../middleware/auth");
const router = express.Router();

router.post("/login", loginAccount);
router.post("/register", registerAccount);
router.get("/users", checkAuthAndRole([1, 2]), getListUser);
router.put("/user/:id", checkAuthAndRole([1, 2, 3]), updateUserById);
router.get("/user/:id", checkAuthAndRole([1, 2, 3]), getUserById);
router.patch("/user/:id", checkAuthAndRole([1, 2]), deleteUserById);
router.get("/logout", logOutAccount);

module.exports = router;