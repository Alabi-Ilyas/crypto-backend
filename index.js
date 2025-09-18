const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const i18nextMiddleware = require("i18next-http-middleware"); // ✅ updated middleware
const i18n = require("./i18n");
const cryptoRoutes = require("./routes/crypto"); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// i18n middleware
app.use(i18nextMiddleware.handle(i18n));

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true, // allow cookies/auth headers
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/plans", require("./routes/planRoutes"));
app.use("/api/investments", require("./routes/investments"));
app.use("/api/deposits", require("./routes/DepositRoutes"));
app.use("/api/withdrawals", require("./routes/WithdrawalRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/security", require("./routes/SecurityRoutes"));
app.use("/api/transactions", require("./routes/transactionroutes"));
app.use("/api/withdrawal-methods", require("./routes/withdrawalMethodRoutes"));
app.use("/api/faq", require("./routes/faqRoutes"));
app.use("/api/crypto", cryptoRoutes);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Test route
app.get("/", (req, res) => {
  res.send(req.t("welcome", { name: "Ilyas" })); // ✅ example i18n usage
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
