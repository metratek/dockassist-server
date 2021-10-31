var nodemailer = require('nodemailer');



var transporter = nodemailer.createTransport({
  pool: true,
  host: "mail.metratek.co.uk",
  port: 587,
  secure: true, // use TLS
  auth: {
    user: "info@metratek.co.uk",
    pass: ")nc?CBos-&#6"
  }
});

var mailOptions = {
  from: 'info@metratek.co.uk',
  to: 'andreas.sakellariou@gmail.com',
  subject: 'DockAssist Web',
  text: ''
};

//export the function to be ready to use anywhere in an other module

module.exports = function (text){
  mailOptions.text = text;
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
};