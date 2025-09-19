const verifyCaptcha = require("../utils/verifycaptcha");

const captchaMiddleware = async (req, res, next) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ message: "Captcha is required" });
  }

  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return res.status(400).json({ message: "Captcha verification failed" });
  }

  next(); // ✅ continue to controller if valid
};

module.exports = captchaMiddleware;
