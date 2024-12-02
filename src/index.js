import express from "express";
import session from "express-session";
import login from "./login.js";
import match from "./match.js";
import venue from "./venue.js";
import Mongostore from "connect-mongo";
import client from "./dbclient.js";

const app = express();

app.use(
  session({
    secret: "<Student ID>_eie4432_ftss",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: Mongostore.create({
      client,
      dbName: "ftss",
      collectionName: "session",
    }),
  }),
);

app.use("/", express.static("static"));

app.use("/auth", login);

app.use("/booking", match);

app.use("/seat_map", venue);

app.get("/", (req, res) => {
  if (req.session.logged == true) {
    res.redirect("/matches.html");
  } else {
    res.redirect("/login.html");
  }
});

app.get("/matches", async (req, res) => {
  res.redirect("/matches.html");
});

app.get("/profile", async (req, res) => {
  res.redirect("/profile.html");
});

app.get("/admin", async (req, res) => {
  res.redirect("/admin.html");
});

app.listen(8080, () => {
  console.log(`Current date and time in HKT: ${Date().toString()}`);
  console.log(`Server is running on http://localhost:${8080}`);
});
