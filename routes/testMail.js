const sgMail = require('@sendgrid/mail')
console.log(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const router = require('express').Router()
const Team = require('../controllers/team');

router.post('/:reviewId/:rank', [jwtAuth, adminAuth], async(req, res) => {
    const response = await Team.getQualifiedTeams(req.params);
    return res.status(response.isError ? 400 : 200).send(response);
});

const msg = {
    to: 'pragatibhattad1610@gmail.com', // Change to your recipient
    from: 'info@dscvit.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })