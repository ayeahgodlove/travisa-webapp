const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const { dbAuthenticate } = require("./services/database.config");
const session = require("express-session");

require("dotenv").config();
const passport = require("passport");
const flash = require("connect-flash");

// Passport config
require("./config/passport-auth")(passport);

const authRoutes = require("./routes/auth");

const port = process.env.SERVER_PORT;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to serve static files
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// Express session middleware
app.use(
  session({
    secret: `${process.env.SESSION_KEY}`,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

/**
 * connect to database
 */
// Test the connection
dbAuthenticate();

// Route to render the home page
app.get("/", (req, res) => {
  res.render("pages/index");
});
app.get("/about-us", (req, res) => {
  res.render("pages/about", { pageTitle: "About Us", uri: "About" });
});
app.get("/services", (req, res) => {
  res.render("pages/services", { pageTitle: "Services", uri: "Services" });
});
app.get("/contact-us", (req, res) => {
  res.render("pages/contact", { pageTitle: "Contact Us", uri: "Contact" });
});

app.get("/features", (req, res) => {
  res.render("pages/feature", { pageTitle: "Features", uri: "Feature" });
});
app.get("/countries", (req, res) => {
  res.render("pages/country", { pageTitle: "Countries", uri: "Country" });
});
app.get("/testimonials", (req, res) => {
  res.render("pages/testimony", {
    pageTitle: "Testimonials",
    uri: "Testimonial",
  });
});
app.get("/trainings", (req, res) => {
  res.render("pages/training", { pageTitle: "Trainings", uri: "Training" });
});

app.use("/", authRoutes);

// 404 route handler
app.use((req, res, next) => {
  res.status(404).render("pages/404", { title: "404 - Page Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
