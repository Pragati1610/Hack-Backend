const auth = require("../controllers/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
	const salt = bcrypt.genSaltSync(process.env.SALT);
	req.body.password = bcrypt.hashSync(req.body.password, salt);
	const response = await auth.createUser(req.body);
	return res.status(response.isError?400:200).send(response);
});

router.post("/login", async (req, res) => {
	const user = await auth.getAuthByEmail(req.body.email);
	const match = bcrypt.compareSync(req.body.password, user.password);
	const token = jwt.sign(user);
	return res.status(match?200:400).send({token});
});

module.exports = router;
