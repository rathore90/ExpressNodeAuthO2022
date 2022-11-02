const axios = require('axios');
const Blog = require('../models/blog');

const blog_index = (req, res)=> {
  let isAuthenticated = req.oidc.isAuthenticated();
  if(isAuthenticated) {
    Blog.find().sort({
        createdAt: -1
    }).then(result => {
        res.render("index", { 
            blogs: result,
            title: "My auth app",
            isAuthenticated: isAuthenticated
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

  module.exports = {
    blog_index,
    secured_endpoint,
    role_based_authentication,
    blog_create_post
  }
  