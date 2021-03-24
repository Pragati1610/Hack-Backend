const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const schema = {
    eventId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    eventName: { type: DataTypes.STRING, allowNull: false },
    problemStatements: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    dateOfEvent: { type: DataTypes.DATE, allowNull: false },
    endOfEvent: { type: DataTypes.DATE, allowNull: false },
    maxTeamSize: { type: DataTypes.INTEGER, allowNull: false }
};

const options = {
    timestamps: false
};

const Events = sequelize.define('Event', schema, options);

module.exports = Events;