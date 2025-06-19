import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
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

// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Serve static files (image uploads) from 'public/uploads'
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes
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
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });

