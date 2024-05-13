"use strict";
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			username: { type: DataTypes.STRING, allowNull: false },
			email: { type: DataTypes.STRING, unique: true, allowNull: false },
			password: { type: DataTypes.STRING, allowNull: false },
			dob: { type: DataTypes.DATEONLY },
			status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
			studentId: { type: DataTypes.STRING, unique: true, allowNull: false },
			deactivationDate: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			refreshToken: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			roleId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "Roles", key: "id" },
			},
		},
		{
			tableName: "Users",
			timestamps: true,
		},
	);

	// User.associate = function (models) {
	// 	User.hasMany(models.User, { foreignKey: "UserId", as: "users" });
	// };

	return User;
};
