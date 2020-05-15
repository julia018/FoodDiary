require("dotenv").config();

// Middleware IMPORT START
const bodyParser = require("body-parser");
const session = require("client-sessions");
//const path = require("path");
const helmet = require("helmet");
const express = require("express");
const app = express();
const path = require("path");
// Middleware IMPORT END

// Routing IMPORTS START
const food = require("./api/food");
const weight = require("./api/weight");
const signup = require("./api/signup");
const login = require("./api/login");
const userSettings = require("./api/user");
const isLoggedIn = require("./api/isLoggedIn");
const calorieNorm = require("./api/calorieNorm");
// Routing IMPORTS END

// Middleware Setup START
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, "/public")));
app.use(session({
    cookieName: "User",
    secret: process.env.cookieSecret,
    duration: 15552000000, // 6 months
    activeDuration: 1000 * 60 * 5,
    cookie: {
      httpOnly: true, // when true, cookie is not accessible from javascript
      secure: false // when true, cookie will only be sent over SSL.
    }
  }));
if(process.env.NODE_ENV === "production") app.use(express.static(path.join(__dirname, 'build')));

app.all("*", (req, res, next) => {
  const isDefined = typeof(req.User.userId) === "undefined" ? false : true;
  const path = req.path;
  
  if(  (path.includes("/api") || path.includes("/user") ) && path !== "/api/isLoggedIn" ) {
    if(isDefined) {
      return next();
    } else {
      return res.redirect(401, "/login");
    }
  }

  return next();
} );

// Middleware Setup END

// Use Routes START
app.use(food);
app.use(weight);
app.use(login);
app.use(userSettings);
app.use(signup);
app.use(isLoggedIn);
app.use(calorieNorm);

if(process.env.NODE_ENV === "production") {
    app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}
// Use Routes END

app.listen(process.env.PORT || 5000, () => console.log(`Working on Port ${process.env.PORT || 5000}`));
