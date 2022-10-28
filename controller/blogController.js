
const blog_index = (req, res)=> {
  let isAuthenticated = req.oidc.isAuthenticated();
  res.render("index", { 
      title: "My auth app",
      isAuthenticated: isAuthenticated
   });
}

  module.exports = {
    blog_index
  }
  