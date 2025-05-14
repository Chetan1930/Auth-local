const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

// Auth Middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Please login to view that resource");
  res.redirect("/login");
}


// Authorization Middleware ( ye toh maine baad mei add kiya h )
function ensureAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  req.flash("error", "Admin access only");
  res.redirect("/dashboard");
}

// Register Routes
router.get("/register", (req, res) => res.render("register"));
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/register");
    }
    user = new User({ username, password, role });
    await user.save();
    req.flash("success", "Registered successfully! Please login");
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login Routes
router.get("/login", (req, res) => res.render("login"));
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true
}));

// Dashboard(ye niche wala phele ka likha kya tha usse niche wala maine role ke liye add kiya bs) 



router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});


router.get("/admin", ensureAuthenticated, ensureAdmin, (req, res) => {
  res.send("<h2>Welcome Admin! You have special access.</h2><a href='/dashboard'>Back</a>");
});


// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "You are logged out");
    res.redirect("/login");
  });
});

module.exports = router;
