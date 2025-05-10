import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import flashcardsRoutes from "./routes/flashcards.routes.js"; // 👈 Add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/flashcards", flashcardsRoutes); // 👈 Add this line

app.get("/", (req, res) => {
  res.send("🚀 Study Partner Backend is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});