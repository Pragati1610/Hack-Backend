const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Review = require('./review');
const Team = require('./team');

const schema = {
    totalScoreId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    totalScore: { type: DataTypes.INTEGER, allowNull: false },
    qualified: { type: DataTypes.BOOLEAN, defaultValue: false }
};

const options = {
    timestamps: false
};

const OverAllScore = sequelize.define('OverAllScore', schema, options);

module.exports = OverAllScore;