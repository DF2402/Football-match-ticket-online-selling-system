import fs from "fs/promises";
import client from "./dbclient.js";

async function init_db() {
  try {
    const users = client.db("ftss").collection("users");
    if ((await users.countDocuments()) === 0) {
      const josnUsersData = await fs.readFile("users.json");
      const usersData = JSON.parse(josnUsersData);
      await users.insertMany(usersData);
      console.log(`Added ${usersData.length} users`);
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

async function update_user(
  username,
  password,
  nickname,
  email,
  gender,
  birthday,
) {
  try {
    const users = client.db("ftss").collection("users");

    const user = await users.updateOne(
      { username: username },
      {
        $set: {
          password: password,
          nickname: nickname,
          email: email,
          gender: gender,
          birthday: birthday,
        },
      },
      { upsert: true },
    );
    if (users.upsertedCount === 1) {
      console.log("Added 1 user");
      return true;
    } else {
      console.log(`Added 0 users`);
      return true;
    }
  } catch (err) {
    console.error("Unable to update the database!", err);
    process.exit(1);
    return false;
  }
}

async function fetch_user(username) {
  try {
    const users = client.db("ftss").collection("users");

    const user = await users.findOne({ username: username });
    return user;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function validate_user(username, password) {
  try {
    if (!username || !password) {
      return false;
    }

    const users = client.db("ftss").collection("users");

    const user = await users.findOne({
      username: username,
      password: password,
    });
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function username_exist(username) {
  try {
    const users = client.db("ftss").collection("users");
    const user = await users.findOne({ username: username });
    if (user === null) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

async function fetch_all_user() {
  try {
    const users = client.db("ftss").collection("users");

    const user_lst = await users.find().toArray();
    return user_lst;
  } catch (err) {
    console.error("Unable to fetch from database!", err);
    process.exit(1);
  }
}

export {
  validate_user,
  update_user,
  fetch_user,
  username_exist,
  fetch_all_user,
};
