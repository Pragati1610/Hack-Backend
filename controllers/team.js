const { Team, Review, OverAllScore, ParticipantTeam, Comments, Auth } = require('../models/relations');
const logger = require('../logging/logger');

class TeamController {
    static async getAllTeams(eventId) {
        try {
            let teams = await Team.findAll({ where: { eventId: eventId }, raw: true });
            let existingMembers, existingMemberIds;
            let waitingMembers, waitingMemberIds;
            let auths;
            teams = await Promise.all(teams.map(async(team) => {
                existingMembers = await ParticipantTeam.findAll({
                    where: {
                        TeamTeamId: team.teamId,
                        isWaiting: false
                    },
                    raw: true
                });
                waitingMembers = await ParticipantTeam.findAll({
                    where: {
                        TeamTeamId: team.teamId,
                        isWaiting: true
                    },
                    include: [{ all: true }],
                    raw: true
                });
                existingMemberIds = existingMembers.map(member => member.AuthAuthId);
                auths = await Auth.findAll({ where: { authId: existingMemberIds }, raw: true });
                existingMembers = existingMembers.map(extmem => {
                    extmem['auth'] = auths.filter(auth => auth.authId === extmem.AuthAuthId);
                    if (extmem.auth[0]) {
                        extmem.auth[0].password = null;
                    }
                    return extmem;
                });
                waitingMemberIds = waitingMembers.map(member => member.AuthAuthId);
                auths = await Auth.findAll({ where: { authId: waitingMemberIds }, raw: true });
                waitingMembers = waitingMembers.map(waitmem => {
                    waitmem['auth'] = auths.filter(auth => auth.authId === waitmem.AuthAuthId);
                    if (waitmem.auth[0]) {
                        waitmem.auth[0].password = null;
                    }
                    return waitmem;
                });
                team["existingMembers"] = existingMembers;
                team["waitingMembers"] = waitingMembers;
                return team;
            }));
            // console.log(teams);
            return { teams: teams, count: teams.length };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async getEvaluatedTeams(reviewId) {
        try {
            const review = await Review.findOne({ where: { reviewId } });
            const allComments = await Comments.findAll({ where: { reviewId }, raw: true });
            const evalTeams = await Promise.all(allComments.map(async(comment) => {
                return await Team.findOne({
                    where: {
                        teamId: comment.teamId,
                        eventId: review.eventId
                    },
                    raw: true
                });
            }));
            return evalTeams;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async getUnEvaluatedTeams(reviewId) {
        try {
            const review = await Review.findOne({ where: { reviewId } });
            let evaluatedTeams = Array.from(await this.getEvaluatedTeams(reviewId));
            let unEvaluatedTeams;
            evaluatedTeams = evaluatedTeams.map(JSON.stringify);
            if (review.reviewNo === 1) {
                const allTeams = await Team.findAll({ where: { eventId: review.eventId }, raw: true });
                unEvaluatedTeams = allTeams.filter(x => {
                    return !evaluatedTeams.includes(JSON.stringify(x));
                });

            } else {
                const prevReviewNo = review.reviewNo - 1;
                const prevReview = await Review.findOne({ where: { eventId: review.eventId, reviewNo: prevReviewNo } });
                const qualifiedTeams = await Review.findAll({ where: { reviewId: prevReview.reviewId }, raw: true });
                unEvaluatedTeams = qualifiedTeams.filter(x => !evaluatedTeams.includes(JSON.stringify(x)));
            }
            return {
                unEvaluatedTeams
            }
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }


    static async getQualifiedTeams(data) {
        try {
            const review = await Review.findByPk(data.reviewId);
            let totalScore;

            if (review.reviewNo === 1) {
                totalScore = await OverAllScore.findAll({
                    where: { reviewId: data.reviewId },
                    raw: true
                });
            } else {
                const preReview = await Review.findOne({ where: { eventId: review.eventId, reviewNo: review.reviewNo - 1 } });

                const prevTotalScore = (await OverAllScore.findAll({
                    where: { reviewId: preReview.reviewId, qualified: true },
                    raw: true
                })).map(score => score.teamId);

                totalScore = (await OverAllScore.findAll({
                    where: { reviewId: data.reviewId },
                    raw: true
                })).filter(score => prevTotalScore.includes(score.teamId));
            }

            totalScore = totalScore.map(totScore => {
                totScore.qualified = false;
                return totScore;
            });

            await OverAllScore.bulkCreate(totalScore, { updateOnDuplicate: ['qualified'] });

            totalScore.sort((a, b) => b.totalScore - a.totalScore);

            const cutOff = totalScore[data.rank - 1].totalScore;

            let topScores = totalScore.filter(score => score.totalScore >= cutOff);

            topScores = topScores.map(totScore => {
                totScore.qualified = true;
                return totScore;
            });

            await OverAllScore.bulkCreate(topScores, { updateOnDuplicate: ['qualified'] });

            return topScores;

        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }
}

module.exports = TeamController;