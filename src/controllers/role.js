const { Role } = require("../../models");
const { responseWithData } = require("../handlers/response_handler");

async function getAllRoles(req, res) {
	try {
		const roles = await Role.findAll();
		return responseWithData(res, 200, roles);
	} catch (error) {
		console.error("Error getting roles:", error);
		throw error;
	}
}

module.exports = {
	getAllRoles,
};
