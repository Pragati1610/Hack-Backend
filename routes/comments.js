const comments = require('../controllers/comments');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');
const adminAuth = require('../middlewares/adminAuthMiddleware');

router.get('/getAllComments/:teamId', [jwtAuth, adminAuth], async (req, res) => {
  const response = await comments.getAllComments(req.params.teamId);
  return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/getComment/:teamId/:reviewId', [jwtAuth, adminAuth], async (req, res) => {
  const response = await comments.getEvent(req.params);
  return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;
