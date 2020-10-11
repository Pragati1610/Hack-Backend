const Team = require("../models/team");
const logger = require("../logging/logger");

class TeamController {
	static async createTeam(team){
		try {
			const createdTeam = await Team.create(team);
			return {
				message: "Team created",
				createdTeam
			}
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}
	}

	static async getTeam(teamId) {
		try {
			const team = await Team.findById(teamId);
			return team;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}
	}

	static async updateTeam(team) {
		try {
			const updatedTeam = await Team.update(team, { where: { teamId: team.teamId }});
			return updatedTeam;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}
	}

	static async deleteTeam(teamId) {
		try {
			await Team.destroy({ where: {teamId: teamId}});
			return {message: "deleted team"};
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}
	} 

}
