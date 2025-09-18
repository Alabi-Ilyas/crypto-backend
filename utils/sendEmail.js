// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
  port: process.env.SMTP_PORT, // e.g., 465 or 587
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
   tls: {
    rejectUnauthorized: false, // <- this bypasses Node’s strict check
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sovereign Assets" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html, // <- this was missing
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};


module.exports = { sendEmail };
