const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/db");
const Events = require("./events");

const schema = {
	metricId: {type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true}, 
	metricName: {type: DataTypes.STRING, allowNull: false},
	maxScore: {type: DataTypes.INTEGER, allowNull: false}
};

const options = {
  timestamps: false
};

const Metrics = sequelize.define('Metrics', schema, options);

if(process.env.SYNC){
	Metrics.sync({
	alter: true
});
}

module.exports = Metrics;
