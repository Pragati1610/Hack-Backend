const { Review, OverAllScore, Team, Scores, Metrics } = require('../models/relations');
const logger = require('../logging/logger');

class ReviewController {
  static async getAllReview (eventId) {
    try {
      let allReview = await Review.findAll({where: {eventId: eventId}, raw: true});
      console.log(allReview);
      let teamId, teams;
      let allReviews = await Promise.all(allReview.map(async (review) => {
          teams = await OverAllScore.findAll({where: { reviewId: review.reviewId, qualified: true }, raw: true});
          console.log(teams);
          review.qualifiedTeams = await Promise.all(teams.map(async (team) => {
               team.scores = await Scores.findAll({where: {teamId: team.teamId, reviewId: team.reviewId}, raw: true});
               team.metrics = await Metrics.findAll({where: {eventId: review.eventId}, raw: true});
               team.teamDetails = await Team.findOne({where: {teamId: team.teamId}, raw: true});
               return team;
          }));
          console.log(review);
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
