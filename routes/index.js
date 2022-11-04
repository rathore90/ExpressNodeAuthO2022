var express = require("express");
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const blogController = require('./../controller/blogController');

// Application routes
router.get('/', blogController.blog_index);
router.get('/secured', requiresAuth(), blogController.secured_endpoint);
router.get('/create', requiresAuth(), blogController.role_based_authentication);
router.post('/blogs', blogController.blog_create_post);
router.get('/blog/:id', blogController.blog_edit_view);
router.post('/blog_edit/:id', blogController.blog_update);
router.post('/blog/payment', blogController.blog_payment);

module.exports = router;