const express = require('express')
const router = express.Router();

const reviewsController = require('../controller/reviews')
// const validation = require('../middleware/validate')
// const { isAuthenticated } = require('../middleware/authentication')

router.get('/', reviewsController.allReviews);
