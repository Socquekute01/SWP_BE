'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, _) {
		await queryInterface.bulkInsert(
			"Roles",
			[
				{
					name: "Admin",
				},
				{
					name: "Moderator",
				},
				{
					name: "User",
				},
			],
			{},
		);
	},

	async down(queryInterface, _) {
		await queryInterface.bulkDelete("Roles", null, {});
	},
};
