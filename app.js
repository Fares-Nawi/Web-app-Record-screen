const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const config = require("config");

const appController = require("./controllers/appController");
const isAuth = require("./middleware/is-auth");
const connectDB = require("./config/db");
const mongoURI = config.get("mongoURI");

const app = express();
connectDB();

const store = new MongoDBStore({
  uri: mongoURI,
  collection: "mySessions",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//===================css

app.use(express.static(__dirname + '/views'));
//=================== Routes
// Landing Page
app.get("/", appController.landing_page);

// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// Register Page
app.get("/signup", appController.register_get);
app.post("/signup", appController.register_post);


// Verify Page
app.get("/verify", appController.verify_get);
app.get("/verify", appController.verify_post);

// Dashboard Page
app.get("/dashboard", isAuth, appController.dashboard_get);

app.post("/logout", appController.logout_post);

app.listen(5000, console.log("App Running on http://localhost:5000"));
