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
      dateCreateRegister: new Date().toJSON(),
      dateModifiedRegister: new Date().toJSON()
    }
    await DocumentClient.put({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise()

    await cognitoLib.addUserToUserGroup(user.id)
    console.log('user added in group')
    
    return event
  } else {
    return event
  }
}