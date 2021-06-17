const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()
const cognitoLib = require('../lib/create-cognito-user');

module.exports.handler = async (event) => {
  console.log(event);
  cognitoLib.setUserPoolId(event.userPoolId);
  
  const USERS_TABLE = process.env.USERS_TABLE
  console.log(`User table ${USERS_TABLE}`);
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const name = event.request.userAttributes['name']
    const email = event.request.userAttributes['email']
    const user = {
      id: event.userName,
      name: name,
      email: email,
      createdOn: new Date().toJSON(),
      updatedOn: new Date().toJSON(),
      hasLink: false,
      hasSchedule: false
    }
    await DocumentClient.put({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise()

    await cognitoLib.addUserToUserGroup(user.id)        
    return event
  } else {
    return event
  }
}