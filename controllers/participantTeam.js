const { Auth, Team, Events, ParticipantTeam } = require('../models/relations');
const logger = require('../logging/logger');

class ParticipantTeamController {
    static async createTeam(team, authId, eventId) {
        try {

            let sameTeamName = await Team.findOne({ where: { teamName: team.teamName } });
            if (sameTeamName) {
                return {
                    message: "Team with that name already exists",
                    isError: true
                }
            }
            let existingTeam = await Team.findOne({
                where: {
                    eventId
                },
                include: [{
                    model: Auth,
                    where: {
                        authId
                    }
                }]
            });

            let createdTeam;

            if (existingTeam) {
                return { message: "team already exists", existingTeam }
            }

            let auth = await Auth.findOne({ where: { authId } });

            if (!auth) {
                return { message: "user doesn't exist" };
            }

            createdTeam = await Team.create(team);
            await createdTeam.addAuth(auth, { through: { isWaiting: false, isLeader: true } });
            await Team.update({ eventId }, { where: { teamId: createdTeam.teamId } });

            return {
                message: 'team created',
                createdTeam
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async joinTeam(teamId, authId, eventId) {
        try {
            let event = await Events.findByPk(eventId, { include: [{ model: Team }] });
            let teamIds = event.teams.map((team) => team.teamId);
            let existingTeam = await ParticipantTeam.findAll({ where: { teamId: teamIds, authId } });
            if (!existingTeam) {
                let team = await Team.findByPk(teamId);
                if (team) {
                    let members = await ParticipantTeam.findAll({ where: { teamId, isWaiting: false } });
                    if (members.length < event.maxTeamSize) {
                        let auth = await Auth.findOne({ where: { authId } });
                        await team.addAuth(auth, { through: { isWaiting: true, isLeader: false } });
                    } else {
                        return {
                            isError: true,
                            message: "Team is full"
                        }
                    }
                    return {
                        message: "Request to join the team has been made"
                    }

                } else {
                    return {
                        isError: true,
                        message: "Team doesn't exist"
                    }
                }
            } else {
                return {
                    isError: true,
                    message: "You are already in a team"
                }
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }

    }

    static async getMembers(teamId, authId) {
        try {
            let leader = await ParticipantTeam.findOne({ where: { teamId, authId, isLeader: true } });
            if (!leader) {
                return {
                    isError: true,
                    message: "You are not authorized to access these resources"
                }
            } else {
                let existingMembers = await ParticipantTeam.findAll({ where: { teamId, isWaiting: false } });
                let waitingMembers = await ParticipantTeam.findAll({ where: { teamId, isWaiting: true } });

                return {
                    waitingMembers,
                    existingMembers
                }
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async addTeamMember(waitingMemberAuthId, leaderAuthId, teamId) {
        try {
            let leader = await ParticipantTeam.findOne({ where: { authId: leaderAuthId, teamId, isLeader: true } });

            if (leader) {
                let searchMember = await ParticipantTeam.findOne({ where: { authId: waitingMemberAuthId, teamId, isWaiting: true } });
                if (!searchMember) {
                    return {
                        isError: true,
                        message: "Member not found"
                    }
                } else {
                    await ParticipantTeam.update({ isWaiting: false }, { where: { authId: waitingMemberAuthId, teamId } });
                    return {
                        message: "Successfully made team member"
                    }
                }
            } else {
                return {
                    isError: true,
                    message: "You are not authorized to access these resources"
                }
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async removeMember(waitingMemberAuthId, leaderAuthId, teamId) {
        try {
            let leader = await ParticipantTeam.findOne({ where: { authId: leaderAuthId, teamId, isLeader: true } });

            if (leader) {
                let searchMember = await ParticipantTeam.findOne({ where: { authId: waitingMemberAuthId, teamId } });
                if (!searchMember) {
                    return {
                        isError: true,
                        message: "Member not found"
                    }
                } else {
                    await ParticipantTeam.destroy({ where: { authId: waitingMemberAuthId, teamId } });
                    return {
                        message: "Successfully removed team member"
                    }
                }
            } else {
                return {
                    isError: true,
                    message: "You are not authorized to access these resources"
                }
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async leaveTeam(teamId, authId) {
        try {
            await ParticipantTeam.destroy({ where: { authId, teamId } });

            const members = await ParticipantTeam.findAll({ where: { teamId } });
            let teamMembersCount;
            if (members.length === 0) {
                await Team.destroy({ where: { teamId } });
                teamMemberCount = "Team deleted because of absence of members"
            } else {
                teamMembersCount = `${members.length} members left in team`;
            }
            return {
                message: "Successfully left team",
                teamMembersCount
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async deleteTeam(teamId, authId) {
        try {
            const team = await ParticipantTeam.findOne({ where: { teamId, authId } });
            if (!team) {
                return {
                    message: "Team doesn't exist",
                    isError: true
                }
            }
            if (!team.isLeader) {
                return {
                    message: "You are not authorized to delete the team",
                    isError: true
                }
            }
            await Team.destroy({ where: { teamId } });
            return {
                message: "Team deleted"
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

}

module.exports = ParticipantTeamController;