const review = require('../controllers/review');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');
const adminAuth = require('../middlewares/adminAuthMiddleware');

router.get('/allReviews/:reviewId', [jwtAuth, adminAuth], async (req, res) => {
  const response = await events.getAllReview(req.params.reviewId);
  return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;
