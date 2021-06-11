const AWS = require('aws-sdk');

const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
    // apiVersion: "2016-04-19"    
}); 

let cognitoPoolId = process.env.COGNITO_USER_POOL_ID;

const setUserPoolId = (id) => {
    cognitoPoolId = id;
}

const addUserToUserGroup = async (email) => {
    var params = {
        GroupName: 'User',
        UserPoolId: cognitoPoolId,
        Username: email
    };
    return COGNITO_CLIENT.adminAddUserToGroup(params).promise()    
};

const createUser = async (email, tempPassword) => {
    var poolData = {
        UserPoolId: cognitoPoolId,
        Username: email,
        DesiredDeliveryMediums: ["EMAIL"],
        TemporaryPassword: tempPassword,
        UserAttributes: [
            {
                Name: "email",
                Value: email
            },
            {
                Name: "email_verified",
                Value: "true"
            }
        ]
    };

    return COGNITO_CLIENT.adminCreateUser(poolData)
    .promise()
    .then((data) => {
        var params = {
            GroupName: 'User',
            UserPoolId: cognitoPoolId,
            Username: email
        };
        return COGNITO_CLIENT.adminAddUserToGroup(params).promise();
    })
}

module.exports = {
    createUser,
    addUserToUserGroup,
    setUserPoolId
};