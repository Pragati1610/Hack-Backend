require('dotenv').config();
var AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// emails []
// details {}
// html
// Html: {
//         Charset: "UTF-8",
//         Data: sendIdeathonMail(details)
//     },
const sendMail = function(emails, htmlPart, subject) {
    var params = {

        Destination: {
            CcAddresses: emails,
            ToAddresses: []
        },
        Source: '2cc@dscvit.com',

        ReplyToAddresses: [
            'dscvitvellore@gmail.com'
        ],
        Message: {
            Body: {
                Html: htmlPart
            },
            Subject: subject
        },
    };
    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
    sendPromise.then(
        function(data) {
            console.log(data);
        }).catch(
        function(err) {
            console.log(err, err.stack);
        });
}


module.exports = sendMail;