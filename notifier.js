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
// const data = {
//   sessions: [
//     {
//       center_id: 563020,
//       name: "Delhi Cantt Gen Hosp. Site 1",
//       state_name: "Delhi",
//       district_name: "New Delhi",
//       block_name: "Not Applicable",
//       pincode: 110010,
//       from: "09:00:00",
//       to: "17:00:00",
//       lat: 28,
//       long: 77,
//       fee_type: "Free",
//       session_id: "566c852f-ae6c-4aa5-b476-ac756ea14986",
//       date: "03-05-2021",
//       available_capacity: 38,
//       fee: "0",
//       min_age_limit: 45,
//       vaccine: "COVISHIELD",
//       slots: [
//         "09:00AM-11:00AM",
//         "11:00AM-01:00PM",
//         "01:00PM-03:00PM",
//         "03:00PM-05:00PM",
//       ],
//     },
//     {
//       center_id: 576301,
//       name: "Delhi Cantt Gen Hosp. Site 2",
//       state_name: "Delhi",
//       district_name: "New Delhi",
//       block_name: "Not Applicable",
//       pincode: 110010,
//       from: "09:00:00",
//       to: "17:00:00",
//       lat: 28,
//       long: 77,
//       fee_type: "Free",
//       session_id: "fd0ad122-c2f3-480b-ba35-ce766de2d7ba",
//       date: "03-05-2021",
//       available_capacity: 88,
//       fee: "0",
//       min_age_limit: 45,
//       vaccine: "COVISHIELD",
//       slots: [
//         "09:00AM-11:00AM",
//         "11:00AM-01:00PM",
//         "01:00PM-03:00PM",
//         "03:00PM-05:00PM",
//       ],
//     },
//   ],
// };
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
