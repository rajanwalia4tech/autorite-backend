
const sgMail = require('@sendgrid/mail');
const config = require("../config");

function setEmailParams (to, from, subject, html, text="Hello"){
  return {
    to,from: from || 'noreply@autorite.me',subject,text,html
  };
}

async function sendEmail(msg){
  try {
    sgMail.setApiKey(config.apiKeys.sendgrid);
    await sgMail.send(msg);
    console.log("DONE")
  } catch (error) {
    console.error(error.response.body);
    throw new Error("something went wrong while sending email");
  }
}

module.exports = {
  sendEmail,
  setEmailParams
}
