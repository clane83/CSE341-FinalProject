const { ObjectId } = require('mongodb');
const dbClient = require('../data/database');

async function allReviews(_req, res) {
    try {
        const reviews = await dbClient
            .getDb()
            .collection('reviews')
            .find({})
            .toArray();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { allReviews };