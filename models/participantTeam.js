const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const schema = {
    participant_team_id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    isWaiting: {
        type: DataTypes.BOOLEAN,
        default: true
    },
    isLeader: { type: DataTypes.BOOLEAN, default: false }
};

const options = {
    timestamps: false
};

const participantTeam = sequelize.define('ParticipantTeam', schema, options);

module.exports = participantTeam;