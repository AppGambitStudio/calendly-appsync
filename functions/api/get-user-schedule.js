
const DynamoDB = require('aws-sdk/clients/dynamodb');
const moment = require('moment');
const DocumentClient = new DynamoDB.DocumentClient()

const { USER_SESSION_TABLE } = process.env;

module.exports.handler = async (event) => {
    const { id, month, year } = event.queryStringParameters;

    const startDate = moment(new Date(year, month-1, 1, 0,0,0)).format('YYYY-MM-DD');
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');

    const sessions = await DocumentClient.query({
        TableName: USER_SESSION_TABLE,
        KeyConditionExpression: `#id = :id and #sessionTime between :startDate and :endDate`,
        ExpressionAttributeNames: {
            "#id": "id",
            "#sessionTime": "sessionTime"
        },
        ExpressionAttributeValues: {
            ':id': id,
            ":startDate": startDate,
            ":endDate": endDate
        },
    }).promise();

    let bookings = [];
    if(sessions.Items){
        bookings = sessions.Items.map((rec) => {
            return {
                sessionTime: rec.sessionTime,
                duration: rec.duration
            }
        });
    }
    return {
        statusCode : 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        body: JSON.stringify(bookings)
    };
};