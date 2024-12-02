import fs from "fs/promises";
import client from "./dbclient.js";
import { ObjectId } from "mongodb";

async function init_db() {
  try {
    const matches = client.db("ftss").collection("matches");
    if ((await matches.countDocuments()) === 0) {
      const josnmatchesData = await fs.readFile("match_coming.json");
      const matchesData = JSON.parse(josnmatchesData);
      await matches.insertMany(matchesData);
      console.log(`Added ${matchesData.length} matches`);
    }

    // TODO
  } catch (err) {
    // TODO
    console.log(err);
    console.error("Unable to initialize the database!");
    process.exit(1);
  }
}

init_db().catch(console.dir);

async function update_match(match_name, team_A, team_B, date, time, venue) {
  try {
    const matches = client.db("ftss").collection("matches");

    const match = await matches.updateOne(
      { match: match_name },
      {
        $set: {
          match: match_name,
          team_A: team_A,
          team_B: team_B,
          date: date,
          time: time,
          venue: venue,
        },
      },
      { upsert: true },
    );
    if (matches.upsertedCount === 1) {
      console.log("Added 1 match");
      return true;
    } else {
      console.log(`Added 0 matches`);
      return true;
    }
  } catch (err) {
    console.error("Unable to update the database!", err);
    process.exit(1);
    return false;
  }
}

async function fetch_match(id) {
  try {
    const matches = client.db("ftss").collection("matches");
    var o_id = new ObjectId(id);
    const match = await matches.findOne({ _id: o_id });
    //console.log(match);
    return match;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function fetch_matches_in_period(start, end) {
  try {
    const matches = client.db("ftss").collection("matches");

    const match_lst = await matches
      .find({
        date: { $gte: start, $lte: end },
      })
      .toArray();
    //console.log(match_lst);
    return match_lst;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function fetch_matches_month(month, year) {
  try {
    const first_day = `${year}-${month}-01`;
    const calendar = new Date(year, month - 1, 0);
    const daysInMonth = calendar.getDate();
    const last_day = `${year}-${month}-${daysInMonth}`;
    return fetch_matches_in_period(first_day, last_day);
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function match_exist(team_A, team_B) {
  try {
    const matches = client.db("ftss").collection("matches");
    const match = await matches.findOne({ team_A: team_A, team_B: team_B });
    if (match === null) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function fetch_all_match() {
  try {
    const matches = client.db("ftss").collection("matches");
    const match_lst = await matches.find().toArray();
    console.log(match_lst);
    return match_lst;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

export {
  update_match,
  fetch_match,
  match_exist,
  fetch_matches_in_period,
  fetch_matches_month,
  fetch_all_match,
};
