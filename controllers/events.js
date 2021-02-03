const { Events, Metrics, Team, Review, ParticipantTeam, Auth } = require('../models/relations');
const logger = require('../logging/logger');
const { QueryTypes, Sequelize } = require('sequelize');

class EventsController {
    static async createEvent(event) {
        try {
            const reviews = [];
            for (let i = 0; i < event.numberOfReviews; i++) {
                reviews.push({ reviewNo: i + 1 });
            }
            event.Reviews = reviews;
            event.Metrics = event.metrics;

            const createdEvent = await Events.create(event, {
                include: [Review, Metrics]
            });

            return {
                message: 'event created',
                createdEvent
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async getEvent(eventId) {
        try {
            const event = await Events.findByPk(eventId);
            const review = await Review.findAll({ where: { eventId } });
            const metric = await Metrics.findAll({ where: { eventId } });
            return { event, review, metric };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async getAllEvents() {
        try {
            let events = await Events.findAll({
                attributes: {
                    include: [
                        [Sequelize.fn('COUNT', Sequelize.col('Teams.teamId')), 'teamCount']
                    ]
                },
                include: [{
                    model: Team,
                    attributes: []
                }],
                group: [
                    "Event.eventId"
                ],
                raw: true
            });

            const eventIds = events.map(event => event.eventId);
            const reviews = await Review.findAll({ where: { eventId: eventIds }, raw: true });
            const metrics = await Metrics.findAll({ where: { eventId: eventIds }, raw: true });

            events = events.map(event => {
                let eventReview = reviews.filter(review => review.eventId === event.eventId);
                let eventMetric = metrics.filter(metric => metric.eventId === event.eventId);
                event.reviews = eventReview;
                event.metrics = eventMetric;
                return event;
            });
            console.log(events);

            return events;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async updateEvent(event) {
        try {
            const updatedEvent = await Events.update(event, { where: { eventId: event.eventId } });
            return updatedEvent;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async deleteEvent(eventId) {
        try {
            await Events.destroy({ where: { eventId: eventId } });
            return { message: 'deleted event' };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async getStats(eventId) {
        try {
            let teams = await Team.findAll({ where: { eventId }, raw: true });
            let teamIds = teams.map((team) => team.teamId);

            let participantsInTeams = await ParticipantTeam.findAll({ where: { TeamTeamId: teamIds }, raw: true });
            let authId;
            participantsInTeams = await Promise.all(participantsInTeams.map(async(participant) => {
                authId = participant.AuthAuthId;
                participant["auth"] = await Auth.findOne({ where: { authId } });
                participant["auth"].password = null;
                return participant;
            }));

            let auths = await Auth.findAll();

            teams = teams.map((team) => {

                let leader = participantsInTeams.filter((participant) => {
                    return (participant.TeamTeamId === team.teamId) && (participant.isLeader === true)
                });
                team["leader"] = (leader);
                team["leaderEmail"] = leader[0].auth["email"];
                team["leaderName"] = leader[0].auth["name"];

                let existingTeamMembers = participantsInTeams.filter((participant) => {
                    return (participant.TeamTeamId === team.teamId) && (participant.isWaiting === false)
                });
                let waitingTeamMembers = participantsInTeams.filter((participant) => {
                    return (participant.TeamTeamId === team.teamId) && (participant.isWaiting === true)
                });
                team["existingTeamMembers"] = existingTeamMembers;
                team["waitingTeamMembers"] = waitingTeamMembers;

                return team;
            });

            return {
                numberOfTeams: teams.length,
                numberOfParticipantsInTeams: participantsInTeams.length,
                numberOfParticipantsRegistered: auths.length,
                teams
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

module.exports = EventsController;