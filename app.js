var express = require("express");
var app = express();
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
};

app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("public"));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use("/", indexRouter);

var port = 3000;

app.listen(3000, () => {
    console.log(`App is running on ${port}` );
})