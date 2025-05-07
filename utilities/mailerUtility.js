const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_USER, // generated ethereal user
    pass: process.env.MAILER_PASS, // generated ethereal password
  },
});

// Wrap in an async IIFE so we can use await.


const sendMailNotification = async (email, itineraryData) => {
    (async () => {
        const info = await transporter.sendMail({
          from: '"Itinerary Admin" <admin@ethereal.email>',
          to: email, // list of receivers
          subject: "Itinerary Confirmation", // Subject line
          text: "Itinerary Created", // plain‑text body
          html: JSON.stringify(itineraryData), // HTML body
        });
      
        console.log("Message sent:", info.messageId);
      })();
}

module.exports = {
  sendMailNotification,
};