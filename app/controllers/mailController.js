var nodemailer = require("nodemailer");
var mailConfig = require('./../../config/mailing');

var sendMail = function (item) {

	var smtpConfig = {
	    host: mailConfig.host,
	    port: mailConfig.port,
	    secure: mailConfig.secure, // use SSL
	    auth: {
	        user: mailConfig.auth.user,
	        pass: mailConfig.auth.pass
	    }
	};

	var smtpTransport = nodemailer.createTransport(smtpConfig);

	var mailOptions = {
		from : mailConfig.auth.user,
	    to: item.to,
	    subject: item.subject,
	    text: item.text
	}

	smtpTransport.verify(function(error, success) {
	    if (error) {
	        console.log(error);
	    } else {
	        console.log('Server is ready to take our messages');
	        console.log(smtpConfig, mailOptions);
		    smtpTransport.sendMail(mailOptions, function(error, response) {
		        if (error) {
		            response = error;
		            console.log(error);
		            smtpTransport.close();
					return error;
		        } else {
		            console.log("Message sent: " + response.message);
		            smtpTransport.close();
					return true;
		        }
		    });
	    }
	});
}

module.exports = {
	sendMail : sendMail
}