const express = require('express')
const router = express.Router();

const reviewsController = require('../controller/reviews')
const validation = require('../middleware/validate')
const { isAuthenticated } = require('../middleware/authentication')

router.get('/', reviewsController.allReviews);

router.post('/',
    isAuthenticated,
    validation.saveReviews,
    async (req, res, next) => {
        try {
            await reviewsController.createReviews(req, res, next);
        } catch (err) {
            next(err);
        }
    }
);
   
router.put('/:id',
    isAuthenticated,
    validation.saveReviews,
    async (req, res, next) => {
        try {
            await reviewsController.updateReviews(req, res, next);
        } catch (err) {
            next(err);
        }
    }
);
   
router.delete('/:id',
    isAuthenticated,
    validation.saveReviews,
    async (req, res, next) => {
        try {
            await reviewsController.deleteReviews(req, res, next);
        } catch (err) {
            next(err);
        }
    }
);


module.exports = router;