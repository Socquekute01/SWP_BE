"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Users", {
			id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
			username: { type: Sequelize.STRING, allowNull: false },
			email: { type: Sequelize.STRING, unique: true, allowNull: false },
			password: { type: Sequelize.STRING, allowNull: false },
			dob: { type: Sequelize.DATEONLY },
			status: { type: Sequelize.BOOLEAN, defaultValue: 1 },
			studentId: { type: Sequelize.STRING, unique: true },
			roleId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: "Roles", key: "id" },
			},
			deactivationDate: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			refreshToken: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
			updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Users");
	},
};
