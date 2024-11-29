import express from 'express';
import session from 'express-session';
import login from './login.js';
import Mongostore from 'connect-mongo';
import client from './dbclient.js';
const app = express();

app.use(
  session({
    secret: '<Student ID>_eie4432_ftss',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: Mongostore.create({
      client,
      dbName: 'ftss',
      collectionName: 'session',
    }),
  })
);

app.use('/auth', login);

app.get('/', (req, res) => {
  if (req.session.logged == true) {
    res.redirect('/index.html');
  } else {
    res.redirect('/login.html');
  }
});

app.use('/', express.static('static'));

app.listen(8080, () => {
  console.log(`Current date and time in HKT: ${Date().toString()}`);
  console.log(`Server is running on http://localhost:${8080}`);
});
