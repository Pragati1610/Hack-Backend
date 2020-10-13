const events = require("../controllers/events");
const express = require("express");
const router = express.Router();
const jwtAuth = require("../middlewares/jwtAuthMiddleware");
const adminAuth = require("../middlewares/adminAuthMiddleware");

router.post("/createEvent", [jwtAuth, adminAuth], async (req, res) => {
	const response = await team.createEvent(req.body);
	return res.status(response.isError?400:200).send(response);
});

router.get("/:eventId", [jwtAuth, adminAuth], async (req, res) => {
	const response = await team.getEvent(req.params.eventId);
	return res.status(response.isError?400:200).send(response);
});

router.get("/allEvents", [jwtAuth, adminAuth], async (req, res) => {
	const response = await team.getAllEvents();
	return res.status(response.isError?400:200).send(response);
});

router.get("/updateEvent", [jwtAuth, adminAuth], async (req, res) => {
	const response = await team.updateEvent(req.body);
	return res.status(response.isError?400:200).send(response);
});

router.get("/deleteEvent", [jwtAuth, adminAuth], async (req, res) => {
	const response = await team.deleteEvent(req.body.eventId);
	return res.status(response.isError?400:200).send(response);
});

module.exports = router;
