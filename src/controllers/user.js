const {
	error,
	responseWithData,
	notfound,
	badRequest,
	created,
	forbidden,
	ok,
} = require("../handlers/response_handler");
const { User } = require("../../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/auth");
const { omitPassword } = require("../helper/user");
const {
	ACCOUNT_UPDATED,
	ACCOUNT_DELETED,
	ACCOUNT_LOGOUT,
	INVALID_PASSWORD,
	ACCOUNT_EXISTED,
	ACCOUNT_CREATED,
} = require("../messages").userMessages;


async function loginAccount(req, res) {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email: email } });
		if (!user) {
			return notfound(res);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return badRequest(res, INVALID_PASSWORD);
		}
		let userData = omitPassword(user);
		const token = generateToken(userData, false);
		const refreshToken = generateToken(userData, true);
		user.refreshToken = refreshToken;
		await user.save();
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		userData.token = token;
		return responseWithData(res, 200, userData);
	} catch (err) {
		console.error("Error during login", err);
		return error(res);
	}
}

async function registerAccount(req, res) {
	try {
		const { username, email, password, studentId } = req.body;

		const existingUser = await User.findOne({
			where: {
				[Op.or]: [{ email: email }, { studentId: studentId }],
			},
		});
		if (existingUser) {
			return badRequest(res, ACCOUNT_EXISTED);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({
			username,
			email,
			password: hashedPassword,
			studentId,
			roleId: 3,
		});
		return created(res, ACCOUNT_CREATED);
	} catch (err) {
		console.error("Error during registration:", err);
		return error(res);
	}
}

async function getListUser(req, res) {
	try {
		const { page = 1, pageSize = 10, studentId, email, username } = req.query;

		const where = {
			...(studentId && { studentId: studentId }),
			...(email && { email: { [Op.like]: `%${email}%` } }),
			...(username && { username: { [Op.like]: `%${username}%` } }),
		};

		const limit = parseInt(pageSize);
		const offset = (page - 1) * limit;

		const { count, rows } = await User.findAndCountAll({
			where,
			limit,
			offset,
			attributes: ["id", "username", "email", "studentId", "dob"],
		});

		const response = {
			data: rows,
			totalPages: Math.ceil(count / limit),
			currentPage: parseInt(page),
		};
		return responseWithData(res, 200, response);
	} catch (err) {
		console("Error fetching users:", err);
		return error(res);
	}
}

async function updateUserById(req, res) {
	const { username, roleId, dob, studentId, password } = req.body;
	const { id } = req.params;
	const userRole = req.userRole;

	try {
		const user = await User.findByPk(id);
		if (!user) {
			return notfound(res);
		}

		if (userRole === 1) {
			user.roleId = roleId;
			user.studentId = studentId;
		} else if (userRole === 2 || userRole === 3) {
			if (roleId && roleId !== user.roleId) {
				return forbidden(res);
			}
		}
		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10);
			user.password = hashedPassword || user.password;
		}
		user.username = username || user.username;
		user.dob = dob || user.dob;

		await user.save();
		return ok(res, ACCOUNT_UPDATED);
	} catch (err) {
		console.error("Error updating user:", err);
		return error(res);
	}
}

async function deleteUserById(req, res) {
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);

		if (!user) {
			return notfound(res);
		}

		user.status = 0;
		user.deactivationDate = new Date();

		await user.save();
		return ok(res, ACCOUNT_DELETED);
	} catch (err) {
		console.error("Error deactivating user:", err);
		return error(res);
	}
}

async function getUserById(req, res) {
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);

		if (!user) {
			return notfound(res);
		}

		res.json(user);
	} catch (err) {
		console.error("Error fetching user:", error);
		return error(err);
	}
}

async function logOutAccount(req, res) {
	return ok(res, ACCOUNT_LOGOUT);
}

module.exports = {
	loginAccount,
	registerAccount,
	getListUser,
	updateUserById,
	deleteUserById,
	getUserById,
	logOutAccount,
};
