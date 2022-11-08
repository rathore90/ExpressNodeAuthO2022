const axios = require('axios');
// const { claimCheck } = require('express-openid-connect');
const Blog = require('../models/blog');
require('dotenv').config();
const PUBLISHER_KEY = process.env.PUBLISHER_KEY
const SECRET_KEY = process.env.SECRET_KEY

const stripe = require('stripe')(SECRET_KEY);

const blog_index = (req, res)=> {
  let isAuthenticated = req.oidc.isAuthenticated();
  if(isAuthenticated) {
    Blog.find().sort({
        createdAt: -1
    }).then(result => {
        res.render("index", { 
            blogs: result,
            title: "My auth app",
            isAuthenticated: isAuthenticated,
            key: PUBLISHER_KEY
         });
    });
    } else {
    res.render("noindex", { 
        title: "My auth app",
        isAuthenticated: isAuthenticated
     });
  }
}

const secured_endpoint = async(req, res) => {
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
}; 

// claims for checking if the user is admin, customer, or client 
// const role_based_authentication =  claimCheck((req, claims) => {
//     console.log(claims)
// });
// 

const role_based_authentication = async(req, res) => {
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
  
}

const blog_create_post = (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_edit_view = (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('edit', {
                blog: result,
                title: "Blog Edit",
                isAuthenticated: req.oidc.isAuthenticated(),
                user: req.oidc.user
            })
        })
        .catch(err => {
            console.log("Error ", err);
        })
}

const blog_update = async (req, res) => {
    // Need ID
    const _id = req.params.id;
    // Blog.findOne(_id)
    const doc = await Blog.findOne({ _id });
    // Overwrite
    doc.overwrite({
        title: req.body.title,
        snippet: req.body.snippet,
        body: req.body.body
    })

    await doc.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log("ERROR ", err);
        })
}

const blog_payment = (req, res) => {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: "Pardeep Rathore",
        address: {
            line1: '801 Fennel Road',
            postal_code: '110092',
            city: 'Kelowna',
            state: 'BC',
            country: 'Canada',
        }
    })
        .then((customer) => {
            return stripe.charges.create({
                amount: 7000,
                description: "Product Development",
                currency: "USD",
                customer: customer.id
            })
        })
        .then((charge) => {
            res.render('payment_success', { title: "Payment Success" });
        })
        .catch((err) => {
            res.send(err)    // If some error occurs 
        })
}

  module.exports = {
    blog_index,
    secured_endpoint,
    role_based_authentication,
    blog_create_post,
    blog_edit_view,
    blog_update,
    blog_payment
  }
  