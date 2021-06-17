const AWS = require('aws-sdk');
const pinpoint = new AWS.Pinpoint();

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

const sendEmail = async (to, toSessionTime, {sessionTime, name, email, message = "", duration}) => {

  // User who created the booking
  const fromAddress = {};
  fromAddress[email] = { ChannelType: 'EMAIL' };  

  // User who received the booking
  const toAddress = {};
  toAddress[to] = { ChannelType: 'EMAIL' };  

  const params = {
      ApplicationId: process.env.PINPOINT_APP,
      MessageRequest: {
          MessageConfiguration: {
              EmailMessage: {
                  Body: `Calendly Clone - New Session Alert!! ${duration} booked by ${name}`,
                  Substitutions: {                        
                      Name: [
                          `${name}`.toUpperCase()
                      ],
                      Email: [
                          `${email}`.toUpperCase()
                      ],
                      Message: [
                          `${message}`
                      ],
                      ScheduledOn: [
                          `${sessionTime}`
                      ],
                      Duration: [
                          `${duration} Minutes` 
                      ]
                  }
              }
          },
          Addresses: fromAddress,
          TemplateConfiguration: {
              EmailTemplate: {
                  Name: process.env.NEW_SESSION_TEMPLATE
              }
          }
      }
  };

  try {
      //sendingemail on new session creation
      await pinpoint.sendMessages(params).promise();

      params.MessageRequest.Addresses = toAddress;
      params.MessageRequest.MessageConfiguration.EmailMessage.Substitutions.ScheduledOn = [`${toSessionTime}`];
      await pinpoint.sendMessages(params).promise();
  }catch(e){
      console.log(e);
  }
}

module.exports = {
    asyncForEach,
    sendEmail
}