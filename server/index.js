const express =  require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js")
const rateLimiter = require('express-rate-limit');
const authRoute = require("./routes/authRoute.js")
const supAuthRoute = require('./routes/supabaseAuthRoutes/supAuthRoute.js')
const passResetRoute = require("./routes/passResetRoute.js")
const otpRoute = require("./routes/otpRoute.js")
const cookieParser = require("cookie-parser");



const app = express();


const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
})


app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000", // Local development frontend
  "http://localhost:5173", // Example of another local URL
  "https://my-production-app.com", // Production frontend
  "https://staging-app.com", // Staging frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies)
  })
);

app.use(express.json());
app.use(limiter)

// Defined Routes
app.use('/api' , userRoutes)
app.use('/api/auth' , authRoute)
app.use('/api/' , passResetRoute)
app.use('/api/oauth' , supAuthRoute)
app.use('/api/otp' , otpRoute)


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})