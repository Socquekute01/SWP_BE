"use strict";
module.exports = (sequelize, DataTypes) => {
	const Role = sequelize.define(
		"Role",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
		},
		{
			tableName: "Roles",
			timestamps: false,
		},
	);

	// Role.associate = function (models) {
	// 	Role.hasMany(models.User, { foreignKey: "roleId", as: "users" });
	// };

	return Role;
};
