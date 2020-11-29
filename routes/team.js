const team = require('../controllers/team');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');
const notAdmin = require('../middlewares/notAdminAuthMiddleware');
const adminAuth = require('../middlewares/adminAuthMiddleware');

router.get('/allTeams/:eventId', [jwtAuth, adminAuth], async(req, res) => {
    const response = await team.getAllTeams(req.params.eventId);
    return res.status(response.isError ? 400 : 200).send(response);
});

// router.get('/:teamId', [jwtAuth, notAdmin], async(req, res) => {
//     const response = await team.getTeam(req.params.teamId);
//     return res.status(response.isError ? 400 : 200).send(response);
// });

// router.patch('/updateTeam', [jwtAuth, notAdmin], async(req, res) => {
//     const response = await team.updateTeam(req.body, req.user.authId);
//     return res.status(response.isError ? 400 : 200).send(response);
// });

// router.delete('/deleteTeam', [jwtAuth, notAdmin], async(req, res) => {
//     const response = await team.deleteTeam(req.body.teamId, req.body.authId);
//     return res.status(response.isError ? 400 : 200).send(response);
// });

router.get('/getEvaluatedTeams/:reviewId', [jwtAuth, adminAuth], async(req, res) => {
    const response = await team.getEvaluatedTeams(req.params.reviewId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/getUnEvaluatedTeams/:reviewId', [jwtAuth, adminAuth], async(req, res) => {
    const response = await team.getUnEvaluatedTeams(req.params.reviewId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/getQualifiedTeams/:reviewId/:rank', [jwtAuth, adminAuth], async(req, res) => {
    const response = await team.getQualifiedTeams(req.params);
    return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;