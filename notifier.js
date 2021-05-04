const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const json2html = require("json-to-html");

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

exports.sendEmail = function (email, subjectLine, slotDetails, callback) {
  var html = "";
  slotDetails.map((slotDetail) => {
    str = json2html(slotDetail);
    str = str.replace(/[{}]/g, "");
    str = str.replace(/,/g, "<br>");
    str += "<br><br><br>";
    html += str;
  });

  const mailOptions = {
    from: String("Vaccine Checker " + "vaccinechecker128@gmail.com"),
    to: "shubhfake128@gmail.com",
    subject: subjectLine,
    generateTextFromHTML: true,
    html: "<h1>Vaccine Available, Details: </h1>" + html,
  };
  console.log(smtpTransport.accessToken);
  smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return callback(error);
    }
    callback(error, info);
  });
};
