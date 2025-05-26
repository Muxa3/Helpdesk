import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import ticketRoute from "./routes/ticketRoute.js";
import authRoute from "./routes/authRoute.js";
import bazaznaniyRoute from "./routes/bazaznaniyRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Подключение к MongoDB успешно'))
    .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/bazaznaniy", bazaznaniyRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});