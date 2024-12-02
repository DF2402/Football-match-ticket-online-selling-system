import fs from "fs/promises";
import client from "./dbclient.js";
import { ObjectId } from "mongodb";

async function init_db() {
  try {
    const transactions = client.db("ftss").collection("transaction");
    if ((await transactions.countDocuments()) === 0) {
      const jsonData = await fs.readFile("transactions.json");
      const data = JSON.parse(jsonData);
      await transactions.insertMany(data);
      console.log(`Added transactions`);
    }
  } catch (err) {
    console.log(err);
    console.error("Unable to initialize the database!");
    process.exit(1);
  }
}

init_db().catch(console.dir);

function isValidExpiryDate(date) {
  const date_lst = date.split("/");
  if (date_lst.length !== 2) return false;
  const month = parseInt(date_lst[0], 10);
  const year = parseInt(date_lst[1], 10);
  const currentDate = new Date();
  const expiryDate = new Date(year, month - 1, 1);
  return expiryDate < currentDate;
}

async function validate_transaction(username, match_id, ticket, credit_card) {
  try {
    //const ticket_data = ticket;
    const credit_card_data = credit_card;
    if (
      !username ||
      !match_id ||
      //!ticket_data.seat_class ||
      //!ticket_data.fee ||
      //!ticket_data.seat ||
      !credit_card_data.cardNo ||
      !credit_card_data.name ||
      !credit_card_data.expriydate ||
      !credit_card_data.cvv
    ) {
      return false;
    }

    if (isValidExpiryDate(credit_card_data.expriydate)) {
      return false;
    }

    const users = client.db("ftss").collection("users");

    const user = await users.findOne({
      username: username,
    });
    if (!user) {
      return false;
    }

    const matches = client.db("ftss").collection("match");
    var o_id = new ObjectId(match_id);
    const match = await matches.findOne({
      _id: o_id,
    });
    if (!match) {
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function fetch_transaction(id) {
  try {
    const matches = client.db("ftss").collection("transaction");
    var o_id = new ObjectId(id);
    const transaction = await matches.findOne({ _id: o_id });
    return transaction;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function fetch_transactions(match_id) {
  try {
    const transactions = client.db("ftss").collection("transaction");
    const transaction_lst = await transactions
      .find({ match_id: match_id })
      .toArray();
    const seat_lst = transaction_lst
      .map((transaction) => {
        return transaction.ticket.map((ticket) => ticket.seat);
      })
      .flat();
    //console.log(seat_lst);
    return seat_lst;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function fetch_user_transactions(username) {
  try {
    const matches = client.db("ftss").collection("transaction");
    const transaction_lst = matches.find({ username: username });
    return transaction_lst;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function generate_transaction(username, match_id, ticket, credit_card) {
  try {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}`;
    const document = {
      username: username,
      date: date,
      time: time,
      match_id: match_id,
      ticket: ticket,
      credit_card: credit_card,
    };
    const transactions = client.db("ftss").collection("transaction");
    await transactions.insertOne(document);

    if (transactions.upsertedCount === 1) {
      console.log("Added 1 transactions");
      return true;
    } else {
      console.log(`Added 0 transactions`);
      return true;
    }
  } catch (err) {
    console.error("Unable to update the database!", err);
    process.exit(1);
    return false;
  }
}

async function fetch_all_transactions(username) {
  try {
    const matches = client.db("ftss").collection("transaction");
    const transaction_lst = matches.find().toArray();
    return transaction_lst;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}
export {
  fetch_transaction,
  fetch_transactions,
  generate_transaction,
  validate_transaction,
  fetch_all_transactions,
};
