var mailgun_api_key = process.env.MAILGUN_API_KEY;
var mailgun_domain =  process.env.MAILGUN_DOMAIN;
var mailgun_from = process.env.MAILGUN_FROM;
var mailgun = require('mailgun-js')({apiKey: mailgun_api_key, domain: mailgun_domain});

 
exports.sendEmailViaMailgun = (accountDetails) => {
  const mailOptions = {
    from: mailgun_from, // sender address
    to: accountDetails.email, // list of receivers
    subject: accountDetails.subject, // Subject line
    html: accountDetails.html, // plain text body
  };
   
  mailgun.messages().send(mailOptions, function (error, body) {
    if (error) {
       console.log(err);
     } else {
       console.log(body);
     }
  });
  
}

exports.sendEmailTemplate = async (emailVariable, accountDetails, templateDetails) => {
  console.log(emailVariable, accountDetails, templateDetails)
  if(templateDetails && templateDetails.SUBJECT){
    accountDetails.subject = templateDetails.SUBJECT;
    accountDetails.html = templateDetails.HTML_MSG;
    emailVariable.COMPANY_NAME = 'Block Gemini'
    emailVariable.WEBSITE_LINK = 'www.blockgemini.com'
    Object.keys(emailVariable).map(function(variable) {
      let replaceVariable = '[' + variable + ']';
      accountDetails.html = accountDetails.html.replace(replaceVariable, emailVariable[variable]);
    });
    exports.sendEmailViaMailgun(accountDetails);
  }
  return;
};