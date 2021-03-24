const xlsxFile = require('read-excel-file/node');

const sendClearedRoundMail = require('./templates/sendClearedRoundMail');
const mail = require('../routes/mail');
const disqualified = require('./templates/disqualified');
const wt = require('./templates/wt2020');
const cert = require('./templates/ideathonCert');
const club = require('./templates/clubs');
const reminder = require('./templates/reminder');

xlsxFile('./data.xlsx').then((rows) => {

    for (let i = 0; i <= rows.length - 2; i++) {
        let emails = [rows[i + 1][1]];
        let details = { name: rows[i + 1][0] };
        let htmlPart = {
            Charset: "UTF-8",
            Data: reminder(details)
        };
        let subject = {
            Charset: 'UTF-8',
            Data: `
            `
        }
        mail(emails, htmlPart, subject);
        // console.log(details);
    }
})