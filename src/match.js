import express from "express";
import multer from "multer";
import bodyParser from 'body-parser';

const route = express.Router();
const form = multer();

import {
    update_match,
    fetch_match,
    match_exist,
    fetch_matches_in_period,
    fetch_matches_month,
  } from "./matchdb.js";

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

export default route;