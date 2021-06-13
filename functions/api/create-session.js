const DynamoDB = require('aws-sdk/clients/dynamodb');
const moment = require('moment');
const DocumentClient = new DynamoDB.DocumentClient()

const { USER_SESSION_TABLE } = process.env;

module.exports.handler = async (event) => {
    const { id, name, email, sessionTime, duration, timezone } = JSON.parse(event.body)
    console.log(id, name, email, sessionTime, duration, timezone);

    const result = {
        statusCode : 200,
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
    }catch(e){
        result.statusCode = 500
        result.body = JSON.stringify({message: 'Invalid session time'})        
    }

    return result;
};