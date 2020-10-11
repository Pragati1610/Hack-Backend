const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/db");
const Review = require("./review");
const Metrics = require("./metrics");
const Team = require("./team");

const schema = {
	scoreId: {type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true}, 
	score: {type: DataTypes.INTEGER, allowNull: false}
};

const Scores = sequelize.define('Scores', schema);

Review.hasMany(Scores);
Metrics.hasMany(Scores);
Team.hasMany(Scores);

Scores.sync({
	alter: true
});

module.exports = Scores;
