// Core Modules
require("dotenv").config();
const fs = require('fs')
const path = require("path");
const express = require("express");


// External Modules
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require('cors');

// Local Modules
const hostRouter = require("./routes/hostRouter");
const storeRouter = require("./routes/storeRouter");
const authRouter = require("./routes/authRouter");
const cartRouter = require("./routes/cartRouter");
const paymentRouter = require("./routes/paymentsRouter");
const orderRouter = require("./routes/orderRoutes.js");

const app = express();



// mongodb connection
const uri = process.env.MONGO_URL;
mongoose.connect(uri)

//Image Storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });



app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:3000",
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use("/", hostRouter);
app.use("/", storeRouter);
app.use("/", authRouter);
app.use("/", cartRouter)
app.use("/", paymentRouter);
app.use("/", orderRouter);

// Creating uploadig endpoint for image 
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: true,
        message: "Image uploaded successfully",
        // image_url: `http://localhost:3000/images/${req.file.filename}`
        image_url: `${process.env.BACKEND_URL}/images/${req.file.filename}`

    })
})
app.use("/images", express.static(path.join(__dirname, "upload/images")));


app.get("/" , (req, res, next) => {
    res.send("App is running")
})

const port = process.env.PORT 

// app.listen(port, () => {
//     console.log(`Server is running on port http://localhost:${port}`);
// });

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});

