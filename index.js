const express = require("express");
const app = express();
const { User } = require("./db");
const bcrypt = require("bcrypt");

const SALT_COUNT = 5;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  try {
    res.send(
      "<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>"
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post("/register", async (req, res, next) => {
  try {
    // res.send("<p>you are posting</p>");
    console.log(req.body);
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    await User.create({
      username,
      password: hashedPassword,
    });
    res.send(`successfully created user ${username}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

// we export the app, not listening in here, so that we can run tests

app.post("/login", async (req, res, next) => {
  try {
    // res.send("<p>you are posting</p>");
    console.log(req.body);
    const { username, password } = req.body;
    const searchedUser = await User.findOne({ where: { username } });
    if (searchedUser) {
      console.log("this username exists");
      let correct = await bcrypt.compare(password, searchedUser.password);
      if (correct) {
        res.send(`successfully logged in user ${searchedUser.username}`);
      } else {
        res.send("incorrect username or password").status(200);
      }
    } else {
      res.send("incorrect username or password").status(401);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = app;
