const auth = require('../controllers/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require("express-validator");
const { Auth, ParticipantTeam } = require('../models/relations');
const oAuthController = require('../controllers/oAuth');
const notAdmin = require('../middlewares/notAdminAuthMiddleware');
const adminAuth = require('../middlewares/adminAuthMiddleware');
const jwtAuth = require('../middlewares/jwtAuthMiddleware');

function validate(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
}

router.post('/oAuth', async(req, res) => {
    const user = await oAuthController.createUser(req.body.idToken);
    if (!user.isError) {
        const token = jwt.sign(JSON.stringify(user.createdAuth), process.env.JWT_PASS);
        user.token = token;
    }
    if (user.isLoggedIn) {
        const token = jwt.sign(JSON.stringify(user.user), process.env.JWT_PASS);
        user.token = token;
        return res.status(200).send(user);
    }
    return res.status(user.isError ? 400 : 201).send(user);
});

router.post('/signup', [
    check("email").isEmail(),
    check("password").isLength({ min: 8, max: 32 }),
    check("isAdmin").isBoolean()
], async(req, res) => {

    validate(req, res);

    console.log(req.body.isAdmin)
    if (req.body.isAdmin === true) {
        return res.status(406).send({ message: "User cannot be created" });
    }

    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    const response = await auth.createUser(req.body);

    if (!response.isError) {
        const token = jwt.sign(JSON.stringify(response.createdAuth), process.env.JWT_PASS);
        response.token = token;
    }
    return res.status(response.status).send(response);
});

// remember me
// jwt expire

router.post('/login', async(req, res) => {
    const user = await auth.getAuthByEmail(req.body);
    if (!user.isError) {
        const match = bcrypt.compareSync(req.body.password, user.password);
        const token = jwt.sign(JSON.stringify(user), process.env.JWT_PASS);
        return res.status(match ? 200 : 400).send({ user, token });
    } else {
        console.log(user)
        return res.status(401).send({ message: "User not authorized", m: user.message })
    }
});

// router.get('/findAuth', [notAdmin], async(req, res) => {
//     const user = await Auth.findOne({ where: { authId: req.user.authId } });
//     return res.status(200).send(user);
// })

router.get('/allAuths', async(req, res) => {
    const response = await Auth.findAll();
    return res.status(200).send(response);
});

module.exports = router;