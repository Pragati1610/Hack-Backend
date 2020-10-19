const events = require('../controllers/events');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');
const adminAuth = require('../middlewares/adminAuthMiddleware');

router.post('/createEvent', [jwtAuth, adminAuth], async (req, res) => {
  const response = await events.createEvent(req.body);
  return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/allEvents', [jwtAuth], async (req, res) => {
  const response = await events.getAllEvents();
  return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/:eventId', [jwtAuth, adminAuth], async (req, res) => {
  const response = await events.getEvent(req.params.eventId);
  return res.status(response.isError ? 400 : 200).send(response);
});

router.patch('/updateEvent', [jwtAuth, adminAuth], async (req, res) => {
  const response = await events.updateEvent(req.body);
  return res.status(response.isError ? 400 : 200).send(response);
});

router.delete('/deleteEvent', [jwtAuth, adminAuth], async (req, res) => {
  const response = await events.deleteEvent(req.body.eventId);
  return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;
