// Importing Libraries that we installed
import express from "express";
const app = express();
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }));
import bcrypt from "bcrypt";
import flash from "express-flash";
import session from "express-session";
import ejs from "ejs";
import mongoose from "mongoose";

app.set("view engine", "ejs");
app.set("views", "./views");

mongoose.connect(
  "mongodb+srv://Trendy:trendy123@trendy.nfwh7xm.mongodb.net/Trendy?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

//checks if the data base is connected
const isConnected = mongoose.connection;
isConnected.once("connected", () => console.log("Mongodb Connected"));

import { UserModel } from "./Models/Users.js";
import jwt from "jsonwebtoken";

app.use(express.json());

//signup user endpoint
app.post("/signup", async (req, res) => {
  console.log("Handling signup request...");

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Fields are required" });
  }

  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingEmail = await UserModel.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userRemoveWhite = username.replace(/\s/g, "");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username: userRemoveWhite,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({
      newUser,
      message: "User successfully signed up!",
      success: true,
      redirect: "/login",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", success: false });
  }
});

import cookieParser from "cookie-parser";
app.use(cookieParser("secret"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  req.session.isLoggedIn = false;
  next();
});

//login endpoint
app.post("/login", async (req, res) => {
  console.log("Handling login request");
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username }, null, { timeout: 50000 });

  if (!user || !password) {
    return res
      .status(400)
      .render("login.ejs", { error: "Useername not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).render("login.ejs", { error: "Incorrect Password" });
  } else {
    const token = jwt.sign({ id: user._id }, "secret");
    res.cookie("token", token);

    //set isLoggedIn to true in the session
    req.session.isLoggedIn = true;

    // Update the username and render the index.ejs file
    const updatedUser = await UserModel.findById(user._id);
    res.render("index.ejs", {
      username: updatedUser.username,
      isLoggedIn: req.session.isLoggedIn,
    });
  }
});

// logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("token");
      res.redirect("/");
    }
  });
});

//Routes
app.get("/", async (req, res) => {
  let username = null;
  try {
    if (Object.keys(req.cookies).length !== 0 && req.cookies.token) {
      const decodedToken = jwt.verify(req.cookies.token, "secret");
      const user = await UserModel.findById(decodedToken.id);
      if (user) {
        // Update the username and render the index.ejs file
        const updatedUser = await UserModel.findById(user._id);
        username = updatedUser.username;
      }
    }
    // Render the index.ejs file with or without the updated username
    res.render("index.ejs", { username, isLoggedIn: req.session.isLoggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/login", (req, res) => {
  const errorMessage = req.query.error; // Get the error message from the query parameters

  res.render("login.ejs", { error: errorMessage });
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

//   Middle ware & static files
app.use(express.static("Public"));

app.listen(1000, () => console.log("server running on port 1000"));
