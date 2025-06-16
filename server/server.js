import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.route.js";
import { eventRouter } from "./routes/event.route.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use("/api/auth", authRouter);
app.use("/api/event", eventRouter);

app.listen(PORT, () => {
  console.log("Listening at port", PORT);
});
