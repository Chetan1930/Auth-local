const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config();

const app = express();

app.use(express.static("public"));
// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Passport Setup
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routes
app.use("/", require("./routes/auth"));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
