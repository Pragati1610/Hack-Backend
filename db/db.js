require("dotenv").config();
const {Sequelize} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URL, {
	dialect: "postgres",
	query: {
		raw: true
	},
	dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;