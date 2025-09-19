const axios = require("axios");

const verifyCaptcha = async (token) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret,
        response: token,
      })
    );

    if (!response.data.success) {
      console.warn("Captcha failed:", response.data["error-codes"]);
    }

    return response.data.success;
  } catch (err) {
    console.error(
      "Captcha verification error:",
      err.response?.data || err.message
    );
    return false;
  }
};

module.exports = verifyCaptcha;
