const xlsxFile = require('read-excel-file/node');

const mail = require('../routes/mail');
const reminder = require('./reminder');

xlsxFile('./data.xlsx').then((rows) => {

    for (let i = 0; i <= rows.length - 2; i++) {
        let emails = [rows[i + 1][1]];
        // let details = { name: rows[i + 1][0] };
        let htmlPart = {
            Charset: "UTF-8",
            Data: reminder()
        };
        let subject = {
            Charset: 'UTF-8',
            Data: `Welcome to Extra Curricular course under DSC VIT!
            `
        }
        mail(emails, htmlPart, subject);
        console.log(emails);
    }
})