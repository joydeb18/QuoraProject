// index.js (Main Server File)
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Step 1: Database se connect karna
connectDB();

// Step 2: Express app ko initialize karna
const app = express();
const PORT = 5000;

// Step 3: Middleware Setup
// Hinglish: Ye middleware aane wali requests ko JSON format me padhne me मदद karta hai.
app.use(express.json()); 
// Hinglish: Ye URL-encoded data ko padhne me help karta hai (form submissions ke liye bhi kaam aa sakta hai).
app.use(express.urlencoded({ extended: true }));

// Step 4: Routes ko use karna
// Hinglish: Hum app ko bata rahe hain ki saare URLs ke liye 'authRoutes' file ka istemal karein.
app.use("/", authRoutes);

// Step 5: Server ko start karna
app.listen(PORT, () => {
  console.log(`🚀 API Server is running on http://localhost:${PORT}`);
});