const AWS = require("aws-sdk");
const commons = require('../lib/common');

module.exports.handler = async (event) => {
    console.log(event);

    await commons.asyncForEach(event.Records, async (r) => {
        if (r.eventName === 'INSERT') {
            let newImg = AWS.DynamoDB.Converter.unmarshall(r.dynamodb.NewImage);
            console.log(newImg);
        }else{
            console.log(`${r.eventName} ${r.dynamodb.OldImage} ${r.dynamodb.NewImage}`);
        }
    });
};