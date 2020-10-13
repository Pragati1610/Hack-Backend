const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/db");
const Events = require("./events");

const schema = {
	teamId: {type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true}, 
	teamName: {type: DataTypes.STRING, allowNull: false},
	abstract: {type: DataTypes.STRING, allowNull: false},
	link: {type: DataTypes.STRING},
};

const options = {
  timestamps: false
};

const Team = sequelize.define('Team', schema, options);

if(process.env.SYNC){
	Team.sync({
	alter: true
});
}

module.exports = Team;
