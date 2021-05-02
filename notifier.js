const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    type: "OAuth2",
    user: "shubhdeep41280@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken,
    tls: {
      rejectUnauthorized: false,
    },
  },
});

// const mailOptions = {
//   from: "your.gmail.here@gmail.com",
//   to: "shubhdeep41280@gmail.com",
//   subject: "Node.js Email with Secure OAuth",
//   generateTextFromHTML: true,
//   html: "<b>test</b>",
// };

// // smtpTransport.sendMail(mailOptions, (error, response) => {
// //   error ? console.log(error) : console.log(response);
// //   smtpTransport.close();
// // });

exports.sendEmail = function (email, subjectLine, slotDetails, callback) {
  let options = {
    from: String("Vaccine Checker " + process.env.EMAIL),
    to: email,
    subject: subjectLine,
    text: "Vaccine available. Details: \n\n" + slotDetails,
  };
  const mailOptions = {
    from: String("Vaccine Checker " + process.env.EMAIL),
    to: email,
    subject: subjectLine,
    text: "Vaccine available. Details: \n\n" + slotDetails,
  };
  smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return callback(error);
    }
    callback(error, info);
  });
};
