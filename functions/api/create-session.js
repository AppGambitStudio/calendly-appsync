const DynamoDB = require('aws-sdk/clients/dynamodb');
const DocumentClient = new DynamoDB.DocumentClient()
const moment = require('moment');
const moment_timezone = require('moment-timezone');
const commons = require('../lib/common');

const { USER_SESSION_TABLE, USERS_TABLE } = process.env;

module.exports.handler = async (event) => {
    const { id, name, email, sessionTime, duration, timezone } = JSON.parse(event.body)
    console.log(id, name, email, sessionTime, duration, timezone);

    const result = {
        statusCode : 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: ""
    };

    try{    
        const item = {
            id: id,
            sessionTime: sessionTime,
            contactName: name,
            contactEmail: email,                
            duration: duration,
            userTimezone: timezone || 'UTC'
        };
        
        await DocumentClient.put({
            TableName: USER_SESSION_TABLE,
            Item: item,
            ConditionExpression: "attribute_not_exists(id) and attribute_not_exists(sessionTime)"
        }).promise();

        const userObj = await DocumentClient.get({
            TableName: USERS_TABLE,
            Key: {
                id: id
            }
        }).promise();        

        const toEmail = userObj.Item.email;
        const toSessionTime = moment.tz(sessionTime, userObj.Item.timezone).format('DD-MM-YYYY h:mm:ss A')
        const userSessionTime = moment.tz(sessionTime, timezone).format('DD-MM-YYYY h:mm:ss A');
        await commons.sendEmail(toEmail, toSessionTime, {
            name,
            email,
            duration,
            sessionTime: userSessionTime
        })
    }catch(e){
        console.log(e);
        result.statusCode = 500
        result.body = JSON.stringify({message: 'Invalid session time'})        
    }

    return result;
};