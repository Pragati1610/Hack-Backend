const { Auth, Team, Events, ParticipantTeam } = require('../models/relations');
const logger = require('../logging/logger');
// const sendRemoveTeamMemberMail = require('../routes/templates/removedTeamMember');
// const mail = require('../routes/mail');

class ParticipantTeamController {
    static async createTeam(team, authId, eventId) {
        try {

            let event = await Events.findOne({ where: { eventId } })
            if (!event) {
                return {
                    message: "No such event exists",
                    isError: true
                }
            }

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
            let random = Math.random().toString(36).substring(2);
            let flag = 1;
            while (flag) {
                const ifExisting = await Team.findOne({ where: { teamCode: random } });
                if (ifExisting) {
                    let random = Math.random().toString(36).substring(2);
                } else {
                    flag = 0;
                }
            }
            team["teamCode"] = random;
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

    static async joinTeam(teamCode, authId) {
        try {
            let team = await Team.findOne({ where: { teamCode: teamCode } });
            if (!team) {
                return {
                    isError: true,
                    message: "Team doesn't exist"
                }
            }
            let eventTeams = await Team.findAll({ where: { eventId: team.eventId }, raw: true });
            let e_t;
            let flag = 0;
            await Promise.all(eventTeams.map(async(team) => {
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

                const members = await ParticipantTeam.findAll({ where: { TeamTeamId: team.teamId, isWaiting: false }, raw: true });
                const event = await Events.findOne({ where: { eventId: team.eventId } });
                if (members.length === event.maxTeamSize) {
                    return {
                        message: "Sorry the Team is full",
                        isError: true
                    }
                }

                let auth = await Auth.findOne({ where: { authId } });
                await team.addAuth(auth, { through: { isWaiting: true, isLeader: false } });

                const leader = await ParticipantTeam.findOne({ where: { TeamTeamId: team.teamId, isLeader: true } });
                const teamLeader = await Auth.findOne({
                    where: {
                        authId: leader.AuthAuthId
                    },
                    raw: true
                });

                let joinedMember = await Auth.findOne({ where: { authId }, raw: true });
                await delete joinedMember.password;
                await delete teamLeader.password;
                return {
                    message: "Request to join the team has been made",
                    teamLeader,
                    joinedMember
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

            let existingMembers = await ParticipantTeam.findAll({
                where: {
                    TeamTeamId: teamId,
                    isWaiting: false
                },
                raw: true
            });
            let waitingMembers = await ParticipantTeam.findAll({
                where: {
                    TeamTeamId: teamId,
                    isWaiting: true
                },
                include: [{ all: true }],
                raw: true
            });
            const existingMemberIds = existingMembers.map(member => member.AuthAuthId);
            let auths = await Auth.findAll({ where: { authId: existingMemberIds }, raw: true });
            existingMembers = existingMembers.map(extmem => {
                extmem['auth'] = auths.filter(auth => auth.authId === extmem.AuthAuthId);
                extmem.password = null;
                extmem.auth[0].password = null;
                return extmem;
            });
            const waitingMemberIds = waitingMembers.map(member => member.AuthAuthId);
            auths = await Auth.findAll({ where: { authId: waitingMemberIds }, raw: true });
            waitingMembers = waitingMembers.map(waitmem => {
                waitmem['auth'] = auths.filter(auth => auth.authId === waitmem.AuthAuthId);
                waitmem.password = null;
                waitmem.auth[0].password = null;
                return waitmem;
            });

            if (!leader) {
                return {
                    existingMembers
                }
            } else {
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
                let existingMembers = await ParticipantTeam.findAll({
                    where: {
                        TeamTeamId: teamId,
                        isWaiting: false
                    },
                    raw: true
                });
                const existingMemberIds = existingMembers.map(member => member.AuthAuthId);
                let auths = await Auth.findAll({ where: { authId: existingMemberIds }, raw: true });
                existingMembers = existingMembers.map(extmem => {
                    extmem['auth'] = auths.filter(auth => auth.authId === extmem.AuthAuthId);
                    extmem.password = null;
                    extmem.auth[0].password = null;
                    return extmem;
                });

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

                let addedMember = await Auth.findOne({ where: { authId: searchMember.AuthAuthId } });
                let leaderAuth = await Auth.findOne({ where: { authId: leader.AuthAuthId } });


                if ((members.length + 1) === event.maxTeamSize) {
                    let waitingMembers = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: true } });
                    waitingMembers.forEach(async(member) => {
                        let memberAuth = await Auth.findOne({ where: { authId: member.AuthAuthId } });
                        this.removeMember(member.AuthAuthId, leaderAuthId, teamId);
                        let emails = [memberAuth.email];
                        let details = { name: team.teamName };
                        let htmlPart = {
                            Charset: "UTF-8",
                            Data: sendRemoveTeamMemberMail(details)
                        };
                        let subject = {
                            Charset: 'UTF-8',
                            Data: `Ideathon DSC VIT: Oops! Team is Full`
                        }
                        mail(emails, htmlPart, subject);
                    });
                }

                return {
                    message: "Successfully made team member",
                    addedMember,
                    leaderAuth
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
                    let members = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: false }, raw: true });
                    console.log(members);
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
            let members = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: false }, raw: true });
            let teamMemberCount;
            const leader = await ParticipantTeam.findOne({ where: { TeamTeamId: teamId, AuthAuthId: authId, isLeader: true } });
            await ParticipantTeam.destroy({ where: { AuthAuthId: authId, TeamTeamId: teamId } });
            members = await ParticipantTeam.findAll({ where: { TeamTeamId: teamId, isWaiting: false }, raw: true });
            if (members.length === 0 || leader) {
                await Team.destroy({ where: { teamId } });
                teamMemberCount = "Team deleted because of absence of members or because leader left"
            } else {
                teamMemberCount = `${members.length} members left in team `;
            }
            console.log(teamMemberCount);
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
            let member = await members.filter((mem) => mem.AuthAuthId === authId);
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

    static async isInTeam(authId, eventId) {
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
        if (existingTeam) {
            existingTeam.Auths[0].password = null;
            existingTeam.password = null;
            let teamId = (existingTeam.Auths[0].ParticipantTeam.TeamTeamId);
            console.log(teamId);
            const team = await Team.findOne({ where: { teamId } });
            team.teamCode = null;
            return { existingTeam: existingTeam.Auths[0], team };
        } else {
            return {
                message: "You are not in a team"
            }
        }

    }

    static async isNotInTeam(eventId) {
        try {
            const eventAuths = await EventParticipant
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