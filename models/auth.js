const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/db");

const schema = {
	authId: {type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true}, 
	email: {type: DataTypes.STRING, allowNull: false},
	password: {type: DataTypes.STRING, allowNull: false},
	isAdmin: {type: DataTypes.BOOLEAN, allowNull: false}
};

const auth = sequelize.define('Auth', schema);

auth.sync({
	alter: true
});

module.exports = auth;
