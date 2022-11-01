var express = require("express");
var app = express();
const mongoose = require('mongoose');
var indexRouter = require("./routes/index");
const { auth } = require('express-openid-connect');
require('dotenv').config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER,
  clientSecret: process.env.CLIENTSECRET,
  authorizationParams: {
    response_type: 'code',
    audience: 'http://localhost:5000',
    scope: 'openid profile email read:messages'
  }
};

// connection string
const dbURI = process.env.MONGODBURL;

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use("/", indexRouter);