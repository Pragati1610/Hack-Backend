const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/db");

const schema = {
	eventId: {type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true}, 
	eventName: {type: DataTypes.STRING, allowNull: false},
	problemStatements: {type: DataTypes.ARRAY, allowNull: false},
	dateOfEvent: {type: DataTypes.DATE, allowNull: false},	
};

const Events = sequelize.define('Event', schema);

Events.sync({
	alter: true
});

module.exports = Events;
