import express from "express";
import multer from "multer";
import fs from "fs/promises";
import client from "./dbclient.js";
import bodyParser from "body-parser";

import {
  validate_user,
  update_user,
  fetch_user,
  username_exist,
  fetch_all_user,
} from "./userdb.js";

const route = express.Router();
const form = multer();

route.post("/login", form.none(), async (req, res) => {
  // Read user database from file
  //await init_userdb();
  req.session.logged = false;

  if (req.body?.username == "admin" && req.body?.password == "adminpass") {
    req.session.username = "admin";
    req.session.logged = true;
    req.session.loginTime = new Date();
    return res.json({
      status: "success",
      user: {
        username: "admin",
      },
    });
  }
  const user = await validate_user(req.body?.username, req.body?.password);
  if (!user) {
    return res.status(401).json({
      status: "failed",
      message: "Incorrect username and password",
    });
  } else {
    req.session.username = user.username;
    req.session.logged = true;
    req.session.loginTime = new Date();

    return res.json({
      status: "success",
      user: {
        username: user.username,
      },
    });
  }
});

route.get("/login", async (req, res) => {
  if (req.session.logged == false) {
    res.redirect("/login.html");
  }
});

route.get("/me", async (req, res) => {
  if (req.session.logged == true) {
    const username = req.session.username;
    console.log(username);
    return res.json({
      status: "success",
      username: username,
    });
  } else {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
});

route.get("/get_me", async (req, res) => {
  if (req.session.logged == true) {
    const username = req.session.username;
    const user = await fetch_user(username);
    //console.log(user);
    return res.json({
      status: "success",
      user: user,
    });
  } else {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
});

route.post("/get_me", bodyParser.json(), async (req, res) => {
  try {
    const username = req.session.username;
    console.log(req.body);
    const user = await fetch_user(username);
    var nickname = user.nickname;
    if (req.body.nickname) {
      nickname = req.body.nickname;
      console.log(nickname);
    }
    const password = req.body.password || user.password;

    const email = req.body.email || user.email;
    const gender = user.gender;
    const birthday = user.birthday;

    update_user(username, password, nickname, email, gender, birthday);

    return res.json({
      status: "success",
      user: user,
    });
  } catch (err) {
    return res.json({
      status: "failed",
      err: err,
    });
  }
});

route.post("/logout", async (req, res) => {
  if (req.session.logged == true) {
    req.session.destroy();
    res.end();
  } else {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
});

route.post("/register", form.none(), async (req, res) => {
  // Read user database from file
  //if (users.size === 0) await init_userdb();
  const username = req.body.username;
  const nickname = req.body.nickname;
  const email = req.body.email;
  const gender = req.body.gender;
  const birthday = req.body.birthday;
  const password = req.body.password;

  // null value handle
  if (!username || !nickname || !email || !birthday || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Missing fields",
    });
  }
  if (gender != "male" && gender != "female" && gender != "other") {
    return res.status(400).json({
      status: "failed",
      message: "gender is missing ",
    });
  }

  // invaild value handle
  if (username.length < 3) {
    return res.status(400).json({
      status: "failed",
      message: "Username must be at least 3 characters",
    });
  }
  const result = await username_exist(username);

  if (result) {
    return res.status(400).json({
      status: "failed",
      message: `Username ${username} already exists`,
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: "failed",
      message: "Password must be at least 8 characters",
    });
  }

  if (nickname.length < 6) {
    return res.status(400).json({
      status: "failed",
      message: "Nickname must be at least 6 characters",
    });
  }

  const regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  if (!regex.test(email)) {
    return res.status(400).json({
      status: "failed",
      message: "Email format is invalid",
    });
  }

  const today = new Date();
  if (today > birthday) {
    return res.status(400).json({
      status: "failed",
      message: "Birthday is invalid",
    });
  }

  if (
    await update_user(username, password, nickname, email, gender, birthday)
  ) {
    return res.json({
      status: "success",
      user: username,
    });
  } else {
    return res.status(500).json({
      status: "failed",
      message: "Account created but unable to save into the database",
    });
  }
});

route.post("/get_all_user", async (req, res) => {
  const user_lst = await fetch_all_user();
  return res.json({
    status: "success",
    user_lst: JSON.stringify(user_lst),
  });
});
export default route;
