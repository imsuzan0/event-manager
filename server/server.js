import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.route.js";
import { eventRouter } from "./routes/event.route.js";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRouter);
app.use("/api/event", eventRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Press Ctrl+C to stop the server");
    });
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
};

startServer();