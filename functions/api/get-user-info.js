const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()

const { USER_LINK_TABLE, USER_TABLE } = process.env;

module.exports.handler = async (event) => {    
    const { linkName } = event.queryStringParameters;

    const link = await DocumentClient.get({
        TableName: USER_LINK_TABLE,
        Key: {
            link: linkName
        }
    }).promise();

    let user = {}
    if(link.Item){
        const userRec = await DocumentClient.get({
            TableName: USER_TABLE,
            Key: {
                id: link.Item.userId
            }
        }).promise();

        if(userRec.Item){
            user = {
                id: link.Item.userId,
                name: userRec.Item.name,
                email: userRec.Item.email,
                schedule: userRec.Item.schedule
            }
        }
    }

    return {
        statusCode : 200,
        body: JSON.stringify(user || {})
    };
};