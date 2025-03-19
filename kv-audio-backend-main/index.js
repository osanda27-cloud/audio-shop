import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
import cors from "cors";

dotenv.config();

const app = express();

// Use CORS to allow cross-origin requests
app.use(cors());

// Use body parser to handle JSON payloads
app.use(bodyParser.json());

// Middleware for JWT authentication
app.use((req, res, next) => {
  let token = req.header("Authorization");
  
  if (token != null) {
    token = token.replace("Bearer ", ""); // Remove the 'Bearer ' prefix

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded; // Assign decoded user data to the request object
      }
    });
  }
  
  next();
});

// Use the MongoDB URL from the .env file
let mongoUrl = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(mongoUrl)
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

// Use your routers for different routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
