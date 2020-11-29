const { Team, Comments } = require('../models/relations');
const logger = require('../logging/logger');

class CommentsController {

    static async getAllComments(teamId) {
        try {
            const comments = await Comments.findAll({ where: { teamId: teamId } });
            return comments;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async getComment(data) {
        try {
            // data.teamId, data.reviewId
            const comment = await Comments.findOne({ where: { teamId: data.teamId, reviewId: data.reviewId } });
            return comment;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }
}

module.exports = CommentsController;