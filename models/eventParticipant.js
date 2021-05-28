const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const schema = {
    event_participant_id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
};

const options = {
    timestamps: false
};

const eventParticipant = sequelize.define('EventParticipant', schema, options);

module.exports = eventParticipant;