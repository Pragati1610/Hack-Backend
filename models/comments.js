const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Review = require('./review');
const Team = require('./team');

const schema = {
    commentId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    commentBody: { type: DataTypes.STRING, allowNull: false },
    colorCode: { type: DataTypes.INTEGER, allowNull: false }
};

const options = {
    timestamps: false
};

const Comments = sequelize.define('Comments', schema, options);

module.exports = Comments;