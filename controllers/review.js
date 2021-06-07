const { Review, OverAllScore, Team, Scores, Metrics, Comments } = require('../models/relations');
const logger = require('../logging/logger');

class ReviewController {
    static async getAllReview(eventId) {
        try {
            let allReview = await Review.findAll({ where: { eventId: eventId }, raw: true });
            let teams;
            let allReviews = await Promise.all(allReview.map(async(review) => {
                teams = await OverAllScore.findAll({ where: { reviewId: review.reviewId, qualified: true }, raw: true });
                review.qualifiedTeams = await Promise.all(teams.map(async(team) => {
                    team.scores = await Scores.findAll({ where: { teamId: team.teamId, reviewId: team.reviewId }, raw: true });
                    team.metrics = await Metrics.findAll({ where: { eventId: review.eventId }, raw: true });
                    team.teamDetails = await Team.findOne({ where: { teamId: team.teamId }, raw: true });
                    return team;
                }));
                return review;
            }));

            return {
                message: 'Review',
                allReviews
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }
    static async getAllData(eventId) {
        try {
            let allReview = await Review.findAll({ where: { eventId: eventId }, raw: true });
            let teams;
            let allReviews = await Promise.all(allReview.map(async(review) => {
                teams = await OverAllScore.findAll({ where: { reviewId: review.reviewId }, raw: true });
                review.allTeams = await Promise.all(teams.map(async(team) => {
                    team.scores = await Scores.findAll({ where: { teamId: team.teamId, reviewId: team.reviewId }, raw: true });
                    team.metrics = await Metrics.findAll({ where: { eventId: review.eventId }, raw: true });
                    team.teamDetails = await Team.findOne({ where: { teamId: team.teamId }, raw: true });
                    team.comments = await Comments.findOne({ where: { teamId: team.teamId, reviewId: team.reviewId }, raw: true })
                    return team;
                }));
                return review;
            }));

            return {
                message: 'Review',
                allReviews
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

}

module.exports = ReviewController;