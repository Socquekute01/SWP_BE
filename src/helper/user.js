function omitPassword(user) {
	const { password, refreshToken, ...userWithoutPassword } = user.dataValues;
	return userWithoutPassword;
}

module.exports = { omitPassword };
