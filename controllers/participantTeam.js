const { Auth, Team, Events, ParticipantTeam } = require('../models/relations');
const logger = require('../logging/logger');

class ParticipantTeamController {
    static async createTeam(team, authId, eventId) {
        try {
            let sameTeamName = await Team.findOne({ where: { teamName: team.teamName, eventId } });
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
            createdTeam.eventId = eventId;
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


    static async joinTeam(teamId, authId) {
        try {
            let team = await Team.findByPk(teamId, { raw: true });
            console.log(team);
            let eventTeams = await Team.findAll({ where: { eventId: team.eventId }, raw: true });
            let e_t;
            let flag = 0;
            await Promise.all(eventTeams.map(async(team) => {
                console.log(team)
                e_t = await ParticipantTeam.findOne({
                    where: { TeamTeamId: team.teamId, AuthAuthId: authId },
                    raw: true
                });
                if (e_t) {
                    flag = 1;
                }
                return e_t;
            }));
            if (!flag) {
                let team = await Team.findByPk(teamId);
                if (team) {
                    let auth = await Auth.findOne({ where: { authId } });
                    await team.addAuth(auth, { through: { isWaiting: true, isLeader: false } });
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
            let team = await Team.findOne({ where: { teamId } });
            if (!team) {
                return {
                    isError: true,
                    message: "Team doesn't exist"
                }
            }
            let leader = await ParticipantTeam.findOne({ where: { TeamTeamId: teamId, AuthAuthId: authId, isLeader: true } });
            if (!leader) {
                return {
                    isError: true,
                    message: "You are not authorized to access these resources"
                }
            } else {
                let existingMembers = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: false } });
                let waitingMembers = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: true } });

                return {
                    waitingMembers,
                    existingMembers
                }
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString(teamId, authId)
            };
        }
    }

    static async getNonWaitingMembers(teamId, authId) {
        try {
            let team = await Team.findOne({ where: { teamId } });
            if (!team) {
                return {
                    isError: true,
                    message: "Team doesn't exist"
                }
            }
            let leader = await ParticipantTeam.findOne({ where: { TeamTeamId: teamId, AuthAuthId: authId, isWaiting: false } });
            if (!leader) {
                return {
                    isError: true,
                    message: "You are not authorized to access these resources"
                }
            } else {
                let existingMembers = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: false } });

                return {
                    existingMembers
                }
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString(teamId, authId)
            };
        }
    }

    static async addTeamMember(waitingMemberAuthId, leaderAuthId, teamId) {
        try {
            let leader = await ParticipantTeam.findOne({ where: { AuthAuthId: leaderAuthId, TeamTeamId: teamId, isLeader: true } });
            if (leader) {
                let searchMember = await ParticipantTeam.findOne({ where: { AuthAuthId: waitingMemberAuthId, TeamTeamId: teamId, isWaiting: true }, raw: true });
                if (!searchMember) {
                    return {
                        isError: true,
                        message: "Member not found"
                    }
                }
                let members = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: false }, raw: true });
                let team = await Team.findByPk(teamId);
                let event = await Events.findByPk(team.eventId);
                if (members.length >= event.maxTeamSize) {
                    return {
                        isError: true,
                        message: "Team is full"
                    }
                }

                await ParticipantTeam.update({ isWaiting: false }, { where: { AuthAuthId: waitingMemberAuthId, TeamTeamId: teamId } });
                return {
                    message: "Successfully made team member"
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


    static async removeMember(memberAuthId, leaderAuthId, teamId) {
        try {
            let leader = await ParticipantTeam.findOne({ where: { AuthAuthId: leaderAuthId, TeamTeamId: teamId, isLeader: true }, raw: true });

            if (leader) {
                let searchMember = await ParticipantTeam.findOne({ where: { AuthAuthId: memberAuthId, TeamTeamId: teamId }, raw: true });
                if (!searchMember) {
                    return {
                        isError: true,
                        message: "Member not found"
                    }
                } else {
                    await ParticipantTeam.destroy({ where: { AuthAuthId: memberAuthId, TeamTeamId: teamId } });
                    let members = await ParticipantTeam.findAll({ where: { AuthAuthId: memberAuthId, TeamTeamId: teamId, isWaiting: false }, raw: true });
                    if (members.length === 0) {
                        await Team.destroy({ where: { teamId } });
                        return {
                            message: "Successfully removed team member, Team became empty so it no longer exists",
                            isError: true
                        }
                    }
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
            const members = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: false }, raw: true });
            let teamMemberCount;
            const leader = await ParticipantTeam.findOne({ where: { TeamTeamId: teamId, AuthAuthId: authId, isLeader: true } });
            await ParticipantTeam.destroy({ where: { AuthAuthId: authId, TeamTeamId: teamId } });
            if (members.length === 0 || leader) {
                await Team.destroy({ where: { teamId } });
                teamMemberCount = "Team deleted because of absence of members or because leader left"
            } else {
                teamMembersCount = `${members.length} members left in team`;
            }
            return {
                message: "Successfully left team",
                teamMemberCount
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
            const team = await ParticipantTeam.findOne({ where: { TeamTeamId: teamId, AuthAuthId: authId } });
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

    static async getTeam(teamId, authId) {
        try {
            const member = await ParticipantTeam.findOne({ where: { AuthAuthId: authId, TeamTeamId: teamId, isWaiting: false } });
            if (!member) {
                return {
                    message: "You are not authorized to access these resources",
                    isError: true
                }
            }
            const team = await Team.findByPk(teamId);
            return team;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async updateTeam(team, authId) {
        try {
            const members = await ParticipantTeam.findAll({ where: { TeamTeamId: team.teamId, isWaiting: false }, attributes: ['AuthAuthId'], raw: true });
            console.log(members[0].AuthAuthId);
            console.log(authId);
            let member = await members.filter((mem) => mem.AuthAuthId === authId);
            console.log(member);
            if (member.length === 0) {
                return {
                    message: "This is not you team, you are not authorized to change these resources",
                    isError: true
                }
            }
            const updatedTeam = await Team.update(team, { where: { teamId: team.teamId } });
            return updatedTeam;
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