const review = require('../controllers/review');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');
const adminAuth = require('../middlewares/adminAuthMiddleware');

router.get('/allReviews/:eventId', [jwtAuth, adminAuth], async(req, res) => {
    const response = await review.getAllReview(req.params.eventId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/allData/:eventId', [jwtAuth, adminAuth], async(req, res) => {
    const response = await review.getAllData(req.params.eventId);
    return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;