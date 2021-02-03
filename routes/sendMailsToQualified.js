const xlsxFile = require('read-excel-file/node');

const sendClearedRoundMail = require('./templates/sendClearedRoundMail');
const mail = require('../routes/mail');
const disqualified = require('./templates/disqualified');

xlsxFile('./data.xlsx').then((rows) => {

    for (let i = 0; i <= rows.length - 2; i++) {
        let emails = [rows[i + 1][2]];
        let details = { name: rows[i + 1][1] };
        let htmlPart = {
            Charset: "UTF-8",
            Data: disqualified(details)
        };
        let subject = {
            Charset: 'UTF-8',
            Data: `Ideathon DSC VIT: Thank you for participating in Ideathon 2020`
        }
        mail(emails, htmlPart, subject);
    }
})