import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< HEAD
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import userroutes from "./routes/user.js";
import questionroutes from "./routes/question.js";
import answerroutes from "./routes/answer.js";
import publicpostroutes from "./routes/publicpost.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

=======
import userroutes from "./routes/user.js";
import questionroutes from "./routes/question.js";
import answerroutes from "./routes/answer.js";

const app = express();
dotenv.config();

// Middleware
>>>>>>> 72376a5 (Edirprofileform.jsx)
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

<<<<<<< HEAD
// Serve static files (image uploads) from 'public/uploads'
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/user", userroutes);
app.use("/questions", questionroutes);
app.use("/answer", answerroutes);
app.use("/publicposts", publicpostroutes);

app.get("/", (req, res) => {
  res.send("🚀 Codequest is running successfully");
});

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    // useUnifiedTopology is deprecated and not needed in Mongoose 6+
    // Remove the following line to avoid the warning:
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });
=======
// Routes
app.use("/user", userroutes);
app.use("/questions", questionroutes);
app.use("/answer", answerroutes);

// Default route
app.get("/", (req, res) => {
  res.send("Codequest is running perfect");
});

// Environment variables
const PORT = process.env.PORT || 5000;
const database_url = process.env.MONGO_URI; // ✅ Using MONGO_URI from .env

// Connect to MongoDB and start server
mongoose
  .connect(database_url) // ✅ Cleaned up connection (no deprecated options)
  .then(() => app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }))
  .catch((err) => console.log(err.message));

  const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});
>>>>>>> 72376a5 (Edirprofileform.jsx)
