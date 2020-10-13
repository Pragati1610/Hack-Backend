const Comments = require("./comments");
const Events = require("./events");
const Metrics = require("./metrics");
const Review = require("./review");
const Scores = require("./scores");
const Team = require("./team");

Team.hasMany(Comments);
Team.hasMany(Scores);

Events.hasMany(Metrics);
Events.hasMany(Team);
Events.hasMany(Review);

Review.hasMany(Comments);
Review.hasMany(Scores);

Metrics.hasMany(Scores);


module.exports = {};
