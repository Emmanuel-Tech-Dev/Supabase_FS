const nodemailer = require('nodemailer')

const sendResetLink = async (email, resetToken , html , subject) => {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

 

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: email, // List of recipients
    subject: subject,
    html: html,
  };

  await transpoter.sendMail(mailOptions);
};


module.exports = sendResetLink