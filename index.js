// Hinglish: Ye hamara main server file hai.

const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

// View engine setup (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static + Body Parser
app.use(express.urlencoded({ extended: true })); // Hinglish: HTML form data parse
app.use(express.static(path.join(__dirname, "public"))); // Hinglish: future CSS/JS ke liye

// DB connect
connectDB();

// Routes
app.use("/", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
