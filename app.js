const express = require("express");
const bcrypt = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const app = express();
const userRouter = require("./routes/userRoutes.routes");
const moRouter = require("./routes/matholympiad.routes");
const pcRouter = require("./routes/programingcontest.routes");
require("./config/passport")(passport);

app.use(express.static("public"));
app.set("view engine", "ejs");

//Session and Flash
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(userRouter);
app.use(moRouter);
app.use(pcRouter);

app.use((req, res) => {
  res.status(401).send("page doesn't exist");
});
module.exports = app;
