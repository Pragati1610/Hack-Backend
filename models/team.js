const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Events = require('./events');

const schema = {
    teamId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    teamCode: { type: DataTypes.STRING },
    teamName: { type: DataTypes.STRING, allowNull: false },
    abstract: { type: DataTypes.TEXT },
    link: { type: DataTypes.STRING }, // title for ideathon,
    problemStatement: { type: DataTypes.STRING }
};

const options = {
    timestamps: false
};

const Team = sequelize.define('Team', schema, options);

module.exports = Team;