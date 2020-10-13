const team = require("../controllers/team");
const express = require("express");
const router = express.Router();
const jwtAuth = require("../middlewares/jwtAuthMiddleware");

router.post("/createTeam", jwtAuth, async (req, res) => {
	const response = await team.createTeam(req.body);
	return res.status(response.isError?400:200).send(response);
});

router.get("/:teamId", jwtAuth, async (req, res) => {
	const response = await team.getTeam(req.params.teamId);
	return res.status(response.isError?400:200).send(response);
});

router.get("/updateTeam", jwtAuth, async (req, res) => {
	const response = await team.updateTeam(req.body);
	return res.status(response.isError?400:200).send(response);
});

router.get("/deleteTeam", jwtAuth, async (req, res) => {
	const response = await team.deleteTeam(req.body.teamId);
	return res.status(response.isError?400:200).send(response);
});

module.exports = router;
