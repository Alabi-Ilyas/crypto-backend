const axios = require("axios");

const verifyCaptcha = async (token) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET; // your secret key from Google
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );

    return response.data.success; // true if CAPTCHA passed
  } catch (err) {
    console.error("Captcha verification error:", err.message);
    return false;
  }
};

module.exports = verifyCaptcha;
