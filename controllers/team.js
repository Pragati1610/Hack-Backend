const { Team, Review, OverAllScore } = require('../models/relations');
const logger = require('../logging/logger');

class TeamController {
  static async createTeam (team) {
    try {
      const createdTeam = await Team.create(team);
      return {
        message: 'Team created',
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

  static async getAllTeams (eventId) {
    try {
      const teams = await Team.findAll({where: {eventId: eventId}});
      return teams;
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }


  static async getTeam (teamId) {
    try {
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

  // not working

  static async updateTeam (team) {
    try {
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

  static async deleteTeam (teamId) {
    try {
      await Team.destroy({ where: { teamId: teamId } });
      return { message: 'deleted team' };
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }

  // reviewId

  static async getEvaluatedTeams (data) {
    try {
      const allTeams = await Team.findAll({where: {reviewId: data.reviewId}});
      const evalTeams = allTeams.filter(team => {
        let teamId=team.teamId;
        let comments= Comments.findAll({where: {reviewId: data.reviewId, teamId: teamId}});
        return (comments);
      });
      return evalTeams;
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }

  static async getUnEvaluatedTeams (data) {
    try {
      const allTeams = await Team.findAll({where: {reviewId: data.reviewId}});
      const evalTeams = allTeams.filter(team => {
        let teamId=team.teamId;
        let comments= Comments.findAll({where: {reviewId: data.reviewId, teamId: teamId}});
        return (!comments);
      });
      return evalTeams;
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }


   static async getQualifiedTeams (data) {
    try {

      // data.rank data.reviewId

      const review = await Review.findByPk(data.reviewId);
      let totalScore;

      if( review.reviewNo === 1 ){
        totalScore = await OverAllScore.findAll({
          where: {reviewId: data.reviewId}, 
          raw: true});
      } else {
        const preReview = await Review.findOne({where: {eventId: review.eventId, reviewNo: review.reviewNo-1}});

        const prevTotalScore = (await OverAllScore.findAll({
          where: {reviewId: preReview.reviewId, qualified: true}, 
          raw: true})).map(score => score.teamId);

        totalScore = (await OverAllScore.findAll({
          where: {reviewId: data.reviewId}, 
          raw: true})).filter(score => prevTotalScore.includes(score.teamId));
      }

      totalScore = totalScore.map(totScore => {
        totScore.qualified = false;
        return totScore;
      });

      await OverAllScore.bulkCreate(totalScore, {updateOnDuplicate: ['qualified']});

      totalScore.sort((a,b)=> b.totalScore-a.totalScore);

      const cutOff = totalScore[data.rank-1].totalScore;

      let topScores = totalScore.filter(score => score.totalScore>=cutOff);

      topScores = topScores.map(totScore => {
        totScore.qualified = true;
        return totScore;
      });

      await OverAllScore.bulkCreate(topScores, {updateOnDuplicate: ['qualified']});

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
