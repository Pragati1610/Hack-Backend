const auth = require('../controllers/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require("express-validator");

// mail validation
// oAuth2 - firebase 

function validate(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }
}

router.post('/signup', [
    check("email").isEmail(),
    check("password").isLength({ min: 8, max: 32 }),
    check("isAdmin").isBoolean()
], async(req, res) => {

    validate(req, res);

    // console.log(req.body.isAdmin)
    // if (req.body.isAdmin === true) {
    //     return res.status(406).send({ message: "User cannot be created" });
    // }

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

    // if (!user.confirmed) {
    //     return res.status(401).send({ message: "Email not verified" });
    // }

    if (!user.isError) {
        const match = bcrypt.compareSync(req.body.password, user.password);
        const token = jwt.sign(JSON.stringify(user), process.env.JWT_PASS);
        return res.status(match ? 200 : 400).send({ user, token });
    } else {
        console.log(user)
        return res.status(401).send({ message: "User not authorized" })
    }
});

module.exports = router;