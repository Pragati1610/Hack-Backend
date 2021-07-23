const auth = require('../controllers/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require("express-validator");
const { Auth } = require('../models/relations');
const oAuthController = require('../controllers/oAuth');

function checkPassword(password) {
    const re = new RegExp(`^[A-Za-z0-9_@./#&+-]{8,32}$`)
    return re.test(password)
};

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

router.post('/signup', async(req, res) => {
    console.log(req.body.isAdmin)
    if (req.body.isAdmin === true) {
        return res.status(406).send({ message: "User cannot be created" });
    }

    if (!(req.body.password) || !checkPassword(req.body.password)) {
        return res.status(400).send({
            message: "Valid password required"
        });
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
        user.password = null;
        const token = jwt.sign(JSON.stringify(user), process.env.JWT_PASS);
        return res.status(match ? 200 : 401).send(match ? { user, token } : { message: "Password doesn't match" });
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