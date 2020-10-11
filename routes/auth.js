const auth = require("../controllers/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
	const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
	req.body.password = bcrypt.hashSync(req.body.password, salt);
	const response = await auth.createUser(req.body);
	return res.status(response.isError?400:200).send(response);
});

router.post("/login", async (req, res) => {
	console.log(req.body);
	const user = await auth.getAuthByEmail(req.body.email);
	console.log(user.password);
	const match = bcrypt.compareSync(req.body.password, user.password);
	const token = jwt.sign(user, process.env.JWT_PASS);
	return res.status(match?200:400).send({token});
});

module.exports = router;
