const { ObjectId } = require('mongodb');
const dbClient = require('../data/datbase');

async function allReviews(_req, res) {
    try {
        const users = await dbClient
            .getDb()
            .collection('users')
            .find({})
            .toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { allReviews }