const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/db");
const Review = require("./review");
const Team = require("./team");

const schema = {
	commentId: {type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true}, 
	commentBody: {type: DataTypes.STRING, allowNull: false}
};

const Comments = sequelize.define('Comments', schema);

Team.hasMany(Comments);
Review.hasMany(Comments);

Comments.sync({
	alter: true
});

module.exports = Comments;
