var express = require("express");
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const axios = require('axios');
const blogController = require('./../controller/blogController');

// Application routes
router.get('/', blogController.blog_index);
router.get('/secured', requiresAuth(), blogController.secured_endpoint);
router.get('/create', requiresAuth(), blogController.create_record)

module.exports = router;