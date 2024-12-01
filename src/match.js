import express from "express";
import multer from "multer";
import bodyParser from "body-parser";

const route = express.Router();
const form = multer();

import {
  update_match,
  fetch_match,
  match_exist,
  fetch_matches_in_period,
  fetch_matches_month,
} from "./matchdb.js";

import {
  fetch_transaction,
  fetch_transactions,
  generate_transaction,
  validate_transaction,
} from "./transactiondb.js";

route.post("/match_coming", bodyParser.json(), async (req, res) => {
  console.log(req.body);
  const month = req.body.month;
  const year = req.body.year;
  const match_lst = await fetch_matches_month(month, year);

  return res.json({
    status: "success",
    match_lst: JSON.stringify(match_lst),
  });
});

route.post("/match", bodyParser.json(), async (req, res) => {
  try {
    const id = req.body.id;
    const match = await fetch_match(id);
    console.log(match);
    return res.json({
      status: "success",
      match: JSON.stringify(match),
    });
  } catch (err) {
    return res.json({
      status: "failed",
      err: err,
    });
  }
});

route.get("/match_detail", async (req, res) => {
  const id = req.query.id;
  //console.log(id);
  res.redirect("/match_detail.html?id=" + id);
});

route.get("/matches", async (req, res) => {
  res.redirect("/matches.html");
});

route.get("/pay", async (req, res) => {
  //console.log(req.body);
  const id = req.query.id;
  const selected = req.query.selected;
  res.redirect(`/payment.html?id=${id}&selected=${JSON.stringify(selected)}`);
});

route.post("/pay", bodyParser.json(), async (req, res) => {
  const username = req.body.username;
  const match_id = req.body.match_id;
  const ticket = req.body.ticket;
  const credit_card = req.body.credit_card;
  console.log(username, match_id, ticket, credit_card);
  if (validate_transaction(username, match_id, ticket, credit_card)) {
    generate_transaction(username, match_id, ticket, credit_card);
    return res.json({
      status: "success",
      massage: `Your transaction is success`,
    });
  } else {
    return res.json({
      status: "fail",
      massage: `Your transaction is fail`,
    });
  }
});

route.post("/get_transactions", bodyParser.json(), async (req, res) => {
  //console.log(req.body);
  const match_id = req.body.match_id;
  const seat_lst = await fetch_transactions(match_id);
  //console.log(seat_lst);
  return res.json({
    status: "success",
    seat_lst: seat_lst,
  });
});

export default route;
