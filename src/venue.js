import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import { fetch_venue, update_match, fetch_all_venue } from "./venuedb.js";

const route = express.Router();
const form = multer();

route.post("/venue", bodyParser.json(), async (req, res) => {
  //console.log(req.body);
  const venue_name = req.body.venue;
  const venue = await fetch_venue(venue_name);

  return res.json({
    status: "success",
    venue: JSON.stringify(venue),
  });
});

route.get("/seat", async (req, res) => {
  const venue = req.query.venue;
  const id = req.query.id;
  //console.log(venue);
  res.redirect(`/seat.html?venue=${venue}&id=${id}`);
});

route.post("/fetch_all_venue", async (req, res) => {
  //console.log(req.body);
  const venue_lst = await fetch_all_venue();
  console.log(venue_lst);
  return res.json({
    status: "success",
    venue_lst: JSON.stringify(venue_lst),
  });
});

export default route;
