const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Review = require('./review');
const Metrics = require('./metrics');
const Team = require('./team');

const schema = {
    scoreId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    score: { type: DataTypes.INTEGER, allowNull: false }
};

const options = {
    timestamps: false
};

const Scores = sequelize.define('Scores', schema, options);

module.exports = Scores;