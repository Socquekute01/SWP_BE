"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Roles", {
			id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
			name: { type: Sequelize.STRING, allowNull: false },
			status: { type: Sequelize.BOOLEAN, defaultValue: 1 },
			deactivationDate: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Roles");
	},
};
