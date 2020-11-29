const score = require('../controllers/scores');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');
const adminAuth = require('../middlewares/adminAuthMiddleware');

router.post('/createTeamScore', [jwtAuth, adminAuth], async(req, res) => {
    const response = await score.createTeamScore(req.body);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/getTeamScore/:reviewId/:teamId', [jwtAuth, adminAuth], async(req, res) => {
    const response = await score.getTeamScore(req.params);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.patch('/updateTeamScore', [jwtAuth, adminAuth], async(req, res) => {
    const response = await score.updateTeamScore(req.body);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.patch('/updateTeamComment', [jwtAuth, adminAuth], async(req, res) => {
    const response = await score.updateTeamComment(req.body);
    return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;