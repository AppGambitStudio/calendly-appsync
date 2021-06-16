## Create Config file

Copy the `sample.config.json` file and create the `config.<stage>.json` file and set the correct values.

### Cognito Signup

https://calendly-app-dev.auth.us-east-1.amazoncognito.com/signup?response_type=token&client_id=6udqaedbp2ijhm2vdr1082c225&redirect_uri=http://localhost:8080

### Cognito Signin 

https://calendly-app-dev.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=6udqaedbp2ijhm2vdr1082c225&redirect_uri=http://localhost:8080

## Reset Cognito Password

```
aws cognito-idp admin-set-user-password --user-pool-id <user pool ID> --username <Cognito username> --password <password> --permanent --profile <AWS profile name>
```

## Setup Postman Collection

* Download the Postman collection.
* Go to your AWS AppSync console and get the API ID and API Key
* Set the API ID and API Key in the Postman Collection variable 

The 3rd variable is to set the User Access Token. There are two ways to get the access token.

### Generate Cognito Access Token from Command Prompt 

```
{
    "ClientId": "<cognito client id>", 
    "AuthFlow": "USER_PASSWORD_AUTH",
    "AuthParameters": {
        "USERNAME": "",
        "PASSWORD": ""
    }
}
```

Run the following commnad

```
aws cognito-idp initiate-auth --cli-input-json file://userauth.config.json
```