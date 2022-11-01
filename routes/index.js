var express = require("express");
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const blogController = require('./../controller/blogController');

// Application routes
router.get('/', blogController.blog_index);
router.get('/secured', requiresAuth(), blogController.secured_endpoint);
router.get('/create', requiresAuth(), blogController.role_based_authentication);
router.post('/blogs', blogController.blog_create_post);

module.exports = router;