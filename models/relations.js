const Auth = require('./auth');
const Comments = require('./comments');
const Events = require('./events');
const Metrics = require('./metrics');
const Review = require('./review');
const Scores = require('./scores');
const Team = require('./team');
const OverAllScore = require('./overAllScore');

Team.Comments = Team.hasMany(Comments, {foreignKey: "teamId", allowNull: false});
Team.Scores = Team.hasMany(Scores, {foreignKey: "teamId", allowNull: false});
Team.OverAllScore = Team.hasMany(OverAllScore, {foreignKey: "teamId", allowNull: false});

Events.Metrics = Events.hasMany(Metrics, {foreignKey: "eventId", allowNull: false});
Events.Team = Events.hasMany(Team, {foreignKey: "eventId", allowNull: false});
Events.Review = Events.hasMany(Review, {foreignKey: "eventId", allowNull: false});

Review.Comments = Review.hasMany(Comments,{foreignKey: "reviewId", allowNull: false});
Review.Scores = Review.hasMany(Scores, {foreignKey: "reviewId", allowNull: false});
Review.OverAllScore = Review.hasMany(OverAllScore, {foreignKey: "reviewId", allowNull: false});


Metrics.Scores = Metrics.hasMany(Scores, {foreignKey: "metricId", allowNull: false});

if (process.env.SYNC) {
  Auth.sync({
    alter: true
  });
  Events.sync({
    alter: true
  });
  Team.sync({
    alter: true
  });
  Review.sync({
    alter: true
  });
  Comments.sync({
    alter: true
  });
  Metrics.sync({
    alter: true
  });
  Scores.sync({
    alter: true
  });
  OverAllScore.sync({
    alter: true
  });
}

module.exports = { Auth, Comments, Events, Metrics, Review, Scores, Team, OverAllScore };
