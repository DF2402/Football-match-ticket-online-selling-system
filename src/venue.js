import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import { fetch_venue, update_match } from "./venuedb.js";

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
  //console.log(venue);
  res.redirect(`/seat.html?venue=${venue}`);
});

export default route;
