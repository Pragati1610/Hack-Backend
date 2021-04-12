const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const moment = require("moment");

const schema = {
    eventId: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    eventName: { type: DataTypes.STRING, allowNull: false },
    problemStatements: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    dateOfEvent: {
        type: DataTypes.DATE,
        allowNull: false,
        get: function() {
            return moment(this.getDataValue('DateTime')).format('DD.MM.YYYY')
        }
    },
    endOfEvent: {
        type: DataTypes.DATE,
        allowNull: false,
        get: function() {
            return moment(this.getDataValue('DateTime')).format('DD.MM.YYYY')
        }
    },
    maxTeamSize: { type: DataTypes.INTEGER, allowNull: false }
};

const options = {
    timestamps: false
};

const Events = sequelize.define('Event', schema, options);

module.exports = Events;