// index.js (Main Server File)

// Hinglish: Hum zaroori tools (packages) ko bula rahe hain.
// express: Restaurant ka main structure banane ke liye.
// connectDB: Kitchen (database) ko chalu karne ke liye.
// authRoutes: Menu card (URLs) ko laane ke liye.
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Step 1: Database se connect karna
// Manager sabse pehle kitchen (DB) check kar raha hai ki woh taiyar hai ya nahi.
connectDB();

// Step 2: Express app ko initialize karna
// Manager ne restaurant (app) ko khol diya hai.
const app = express();
const PORT = 5000; // Restaurant ka address/phone number.

// Step 3: Middleware Setup
// Manager ne waiter ko instruction diya hai ki customer (request) se jo bhi order (data) mile,
// use JSON format mein aache se likh kar kitchen tak bhejna hai.
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Step 4: Routes ko use karna
// Manager ne menu card (authRoutes) ko counter par rakh diya hai.
// Ab koi bhi customer aayega to isi menu se order dega.
app.use("/", authRoutes);

// Step 5: Server ko start karna
// Finally, manager ne "OPEN" ka board laga diya hai.
// Restaurant ab customers ke liye khul gaya hai.
app.listen(PORT, () => {
  console.log(`🚀 API Server is running on http://localhost:${PORT}`);
});