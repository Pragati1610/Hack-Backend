const p_t = require('../controllers/participantTeam.js');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');
const notAdmin = require('../middlewares/notAdminAuthMiddleware');

router.post('/createTeam', [jwtAuth, notAdmin], async(req, res) => {
    const newTeam = await p_t.createTeam(req.body.team, req.user.authId, req.body.eventId);
    return res.status(newTeam.isError ? 400 : 200).send(newTeam);
});

router.post('/joinTeam', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.joinTeam(req.body.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.post('/getMembers', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.getMembers(req.body.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.post('/addTeamMember', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.addTeamMember(req.body.waitingMemberAuthId, req.user.authId, req.body.teamId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.post('/removeMember', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.removeMember(req.body.waitingMemberAuthId, req.user.authId, req.body.teamId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.post('/leaveTeam', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.leaveTeam(req.body.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.delete('/deleteTeam', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.leaveTeam(req.body.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response);
});

module.exports = router;