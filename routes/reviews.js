const express = require('express')
const router = express.Router();

const reviewsController = require('../controller/reviews')
const validation = require('../middleware/validate')
const { isAuthenticated } = require('../middleware/authentication')

router.get('/', reviewsController.allReviews);

router.post('/',
    isAuthenticated,
    validation.saveReviews,
    reviewsController.createReviews);
router.put('/:id',
    isAuthenticated,
    validation.saveReviews,
    reviewsController.updateReviews);
router.delete('/:id',
    isAuthenticated,
    validation.saveReviews,
    reviewsController.deleteReviews);

module.exports = router;