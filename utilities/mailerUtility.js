const transporter = require("../config/nodeMailer.config");

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