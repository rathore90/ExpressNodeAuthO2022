var express = require("express");
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const axios = require('axios');
const blogController = require('./../controller/blogController')

router.get('/', blogController.blog_index);

// trigger the endoint, and call the middleware, if the user is logged in or not
router.get('/secured', requiresAuth(), async(req, res) => {
    let data = {}
    const { token_type, access_token } = req.oidc.accessToken;

    try{
        // calling the server to get the data, make sure you get the data before moving forward(async, await)
        const apiResponse = await axios.get('http://localhost:5000/private', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        data = apiResponse.data;
        access_token.scope.push('read:messages');
    }catch(e) {
        console.log(e);
    }
    console.log(access_token);
    
    // when there is not error, you will be redirected to the secured page with the data you get fromt the api
    res.render('secured', {
        title: "Secured Page",
        isAuthenticated: req.oidc.isAuthenticated(),
        data
    })
}) 

// Create
router.get('/create', requiresAuth(), async(req, res) => {
    let data = {}
    const { token_type, access_token } = req.oidc.accessToken;

    try{
        // calling the server to get the data, make sure you get the data before moving forward(async, await)
        const apiResponse = await axios.get('http://localhost:5000/role', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        data = apiResponse.data;

        // when there is not error, you will be redirected to the secured page with the data you get fromt the api
        res.render('create', {
            title: 'Admin User', 
            isAuthenticated: req.oidc.isAuthenticated(),
            user: req.oidc.user,
            data: data
        })
    }catch(e) {
        console.log(e);
        res.render('notAccess', {
            title: 'Not Access Page',
            isAuthenticated: req.oidc.isAuthenticated()
          });
    }
    
}) 

module.exports = router;