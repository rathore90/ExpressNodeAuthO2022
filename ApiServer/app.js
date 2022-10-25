// this application is made to make sure, every call is secured....how we can make it secured???.....
// to make sure, every call has a valid token
// In this application, we will check is the token is valid
// after varification, we will give access to a user

const express = require('express');
const app  = express();
const { expressjwt: jwt } = require('express-jwt');
var jwks = require('jwks-rsa');

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-mda53ujl.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'http://localhost:5000/',
  issuer: 'https://dev-mda53ujl.us.auth0.com/',
  algorithms: ['RS256']
});

app.get('/public', (req, res) => {
    res.json({
        type: "Public"
    })
})

// jwt middleware checking if the request has a valid token
app.get('/private', jwtCheck, (req, res) => {
    res.json({
        type: "Private"
    })
})

app.listen(5000);