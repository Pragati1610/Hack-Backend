const p_t = require('../controllers/participantTeam.js');
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuthMiddleware');
const notAdmin = require('../middlewares/notAdminAuthMiddleware');
const mail = require('./mail');
const sendIdeathonMail = require('./templates/ideathon');
const sendJoinTeamRequest = require('./templates/joinTeamRequest');
const acceptedAsMember = require('./templates/acceptedAsMember');

router.post('/createTeam', [jwtAuth, notAdmin], async(req, res) => {
    const newTeam = await p_t.createTeam(req.body.team, req.user.authId, req.body.eventId);
    return res.status(newTeam.isError ? 400 : 200).send(newTeam);
});

router.post('/joinTeam', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.joinTeam(req.body.teamCode, req.user.authId);
    if (response.teamLeader) {
        response.teamLeader.password = null;
        let emails = [response.teamLeader.email];
        let details = { name: response.joinedMember.name };
        let htmlPart = {
            Charset: "UTF-8",
            Data: sendJoinTeamRequest(details)
        };
        let subject = {
            Charset: 'UTF-8',
            Data: 'Ideathon DSC VIT: Request to Join Team'
        }
        mail(emails, htmlPart, subject);
    }
    return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/getMembers/:teamId', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.getMembers(req.params.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.get('/getNonWaitingMembers/:teamId', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.getNonWaitingMembers(req.params.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.post('/addTeamMember', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.addTeamMember(req.body.waitingMemberAuthId, req.user.authId, req.body.teamId);

    if (response.addedMember) {
        response.addedMember.password = null;
        response.leaderAuth.password = null;
        let emails = [response.addedMember.email];
        let details = { name: response.leaderAuth.name, email: response.leaderAuth.email };
        let htmlPart = {
            Charset: "UTF-8",
            Data: acceptedAsMember(details)
        };
        let subject = {
            Charset: 'UTF-8',
            Data: 'Ideathon DSC VIT: Joining Team Request Accepted'
        }
        mail(emails, htmlPart, subject);
    }
    return res.status(response.isError ? 400 : 200).send(response);
});

router.post('/removeMember', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.removeMember(req.body.memberAuthId, req.user.authId, req.body.teamId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.post('/leaveTeam', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.leaveTeam(req.body.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.delete('/deleteTeam', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.deleteTeam(req.body.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response.message);
});

// router.patch('/updateTeam', [jwtAuth, notAdmin], async(req, res) => {
//     const response = await p_t.updateTeam(req.body, req.user.authId);
//     return res.status(response.isError ? 400 : 200).send(response);
// });

router.get('/:teamId', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.getTeam(req.params.teamId, req.user.authId);
    return res.status(response.isError ? 400 : 200).send(response);
});

router.post('/isInTeam', [jwtAuth, notAdmin], async(req, res) => {
    const response = await p_t.isInTeam(req.user.authId, req.body.eventId);
    return res.status(response.isError ? 409 : 200).send(response);
});

module.exports = router;