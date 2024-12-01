import fs from "fs/promises";
import client from "./dbclient.js";

async function init_db() {
  try {
    const venues = client.db("ftss").collection("venue");
    if ((await venues.countDocuments()) === 0) {
      const jsonData = await fs.readFile("venues.json");
      const data = JSON.parse(jsonData);
      await venues.insertMany(data);
      console.log(`Added venues`);
    }
  } catch (err) {
    console.log(err);
    console.error("Unable to initialize the database!");
    process.exit(1);
  }
}

init_db().catch(console.dir);

async function fetch_venue(venue) {
  try {
    const venues = client.db("ftss").collection("venue");
    const result = await venues.findOne({ venue: venue });
    return result;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function update_match(venue, stand, m, n) {
  try {
    const venues = client.db("ftss").collection("venue");

    await venues.updateOne(
      { venue: venue },
      {
        $set: {
          "stands.$[elem].m": m,
          "stands.$[elem].n": n,
        },
      },
      {
        arrayFilters: [{ "elem.stand": stand }],
      },
    );

    if (matches.upsertedCount === 1) {
      console.log("Added 1 venues");
      return true;
    } else {
      console.log(`Added 0 venues`);
      return true;
    }
  } catch (err) {
    console.error("Unable to update the database!", err);
    process.exit(1);
    return false;
  }
}

export { fetch_venue, update_match };
