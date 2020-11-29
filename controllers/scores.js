const { Review, Events, Metrics, Scores, Comments, OverAllScore } = require('../models/relations');
const logger = require('../logging/logger');

class ScoreController {
    static async createTeamScore(data) {
        try {
            const review = await Review.findOne({ where: { eventId: data.eventId, reviewNo: data.reviewNo } });
            console.log(review);
            const scores = data.scores.map(score => {
                score["reviewId"] = review.reviewId;
                score["teamId"] = data.teamId;
                return score;
            });
            let totalScore = 0;
            scores.forEach(score => {
                totalScore += parseInt(score.score);
            });
            const finalScore = {
                totalScore,
                reviewId: review.reviewId,
                teamId: data.teamId
            }

            let comments = {
                "reviewId": review.reviewId,
                "teamId": data.teamId,
                "commentBody": data.commentBody
            };

            const createdScore = await Scores.bulkCreate(scores);
            const createdComments = await Comments.create(comments);
            const overAllScore = await OverAllScore.create(finalScore);
            return {
                message: 'Review posted',
                createdScore,
                createdComments,
                overAllScore
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }


    static async getTeamScore(params) {
        try {
            const teamId = params.teamId;
            const reviewId = params.reviewId;

            const scores = await Scores.findAll({ where: { teamId: teamId, reviewId: reviewId } });
            const comments = await Comments.findOne({ where: { teamId: teamId, reviewId: reviewId } });
            return { scores, comments };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async updateTeamScore(scores) {
        try {
            const updateScore = await Scores.bulkCreate(scores, { updateOnDuplicate: ["score"] });
            let totalScore = 0;
            updateScore.forEach(score => {
                totalScore += parseInt(score.score);
            });
            const finalScore = {
                totalScore,
                reviewId: updateScore[0].reviewId,
                teamId: updateScore[0].teamId
            }
            const updateTotalScore = await OverAllScore.update(finalScore, {
                where: {
                    reviewId: finalScore.reviewId,
                    teamId: finalScore.teamId
                },
                returning: true,
                plain: true
            });
            return {
                updateScore,
                updateTotalScore: updateTotalScore[1]
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async updateTeamComment(data) {
        try {
            const updateComments = await Comments.update(data, { where: { commentId: data.commentId } }, { updateOnDuplicate: ["commentBody"] });
            return updateComments;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }
}

module.exports = ScoreController;