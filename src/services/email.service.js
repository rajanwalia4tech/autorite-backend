// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const config = require('../config');
const {sendEmail,setEmailParams} = require("../utils/sendEmail");
 
// Set the region and credentials
AWS.config.update({
    region: config.aws.region,
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId
});


async function sendEmailAWS(params){
  // Create the promise and SES service object
  const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      console.log("Successfully send the email ",data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
  });
}

function emailParamsAWS(sourceEmail,htmlData,subject,to,cc=[],textData=""){

  // Create sendEmail params 
  var params = {
    Destination: { /* required */
      CcAddresses: Array.isArray(cc) ? cc : [cc],
      ToAddresses: Array.isArray(to) ? to : [to]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
        Charset: "UTF-8",
        Data: htmlData
        },
        Text: {
        Charset: "UTF-8",
        Data: textData
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
      },
    Source: sourceEmail, /* required */
    ReplyToAddresses: [
    ],
  };

  return params;
}


async function sendVerificationEmail(name,email,token){
    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;
    let template = `Hi ${name},<br>
    <br>
    Thanks for signing up to autorite! Before we get started, we just need to confirm this is you.<br>
    <br>
    Please click here to verify your email address: ${verificationLink}
    <br><br>
    Thanks!<br>
    Autorite Team`
  const subject = `[Autorite] Verify your email`;
  const sourceEmail = config.email.noreply;

  let params = setEmailParams(email,sourceEmail,subject,template);
  await sendEmail(params);
}


module.exports = {
  sendVerificationEmail
}
