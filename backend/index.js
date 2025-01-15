import express from "express"
import { connectDB } from "./Database/connectDB.js";
import dotenv from 'dotenv'
import authRoutes from "./Routes/auth.route.js"
import cookieParser from "cookie-parser";
import cors from 'cors'
dotenv.config()
const app = express();

const PORT= process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoutes)
app.listen(PORT, ()=> {
    connectDB();
    console.log("Server is running on port: ", PORT)
})