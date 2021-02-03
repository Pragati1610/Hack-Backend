const router = require('express').Router();
const eventController = require('../controllers/events');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './file.csv',
    header: [
        { id: 'teamId', title: 'teamId' },
        { id: 'teamCode', title: 'teamCode' },
        { id: 'teamName', title: 'teamName' },
        { id: 'abstract', title: 'abstract' },
        { id: 'link', title: 'link' },
        { id: 'problemStatement', title: 'problemStatement' },
        { id: 'existingTeamMembers', title: 'existingTeamMembers' },
        { id: 'waitingTeamMembers', title: 'waitingTeamMembers' },
    ]
});

router.get('/getCSV/:eventId', async(req, res) => {
    const response = await eventController.getStats(req.params.eventId);
    csvWriter.writeRecords(response.teams).then(() => {
        console.log('...Done');
    }).catch((err) => {
        console.log(err);
    });
});



const xl = require('excel4node');

router.get('/getExcel/:eventId', async(req, res) => {

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    let response = await eventController.getStats(req.params.eventId);
    let arr;

    const data = response.teams;

    const headingColumnNames = [
        "teamId",
        "teamCode",
        "teamName",
        "abstract",
        "link",
        "problemStatement",
        "teamLeaderEmail",
        "teamLeaderName",
    ];
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });
    let rowIndex = 2;
    data.forEach(record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName => {
            ws.cell(rowIndex, columnIndex++)
                .string(record[columnName])
        });
        rowIndex++;
    });
    wb.write('ResponseData.xlsx');
});


module.exports = router;