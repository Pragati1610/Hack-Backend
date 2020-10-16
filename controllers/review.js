const { Review } = require('../models/relations');
const logger = require('../logging/logger');

class ReviewController {
  static async getAllReview () {
    try {
      const allReview = await Review.findAll({where: {eventId: eventId}});
      return {
        message: 'Review posted',
        allReview
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
