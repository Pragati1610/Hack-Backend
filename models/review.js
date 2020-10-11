const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../db/db");
const Events = require("./events");
const Team = require("./team");

const schema = {
	reviewId: {type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
	reviewNo: {type: DataTypes.INTEGER, allowNull: false}
};

const Review = sequelize.define('Review', schema);

Events.hasMany(Review);

Review.sync({
	alter: true
});

module.exports = Review;
