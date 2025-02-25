import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import AuthRoutes from "./Routes/AuthRoutes.js";
const app = express();
const uri = "mongodb+srv://diyabala:db03082024@cluster0.5hj7ajf.mongodb.net/"; 

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

connectDB();

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    })
)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", AuthRoutes);
