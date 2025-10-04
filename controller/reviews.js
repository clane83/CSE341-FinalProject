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

async function createReviews(req, res) {
    try {
        // const desitnationId = new ObjectId(req.params.id);
        const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        const reviews = {
            author: req.body.author,
            targetType: req.body.targetType,
            targetId: req.body.targetId,
            rating: req.body.rating,
            comment: req.body.comment,
            createdAt: todayYMD, //use formatted date to insert into database
            updatedAt: todayYMD, //use formatted date to insert into database
        }

        const response = await dbClient.getDb().collection('reviews').insertOne(reviews);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the review.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function updateReviews(req, res) {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid playlist id to update a reviews.');
    }
    const reviewtId = new ObjectId(req.params.id);
    const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const reviews = {
        author: req.body.author,
        targetType: req.body.targetType,
        targetId: req.body.targetId,
        rating: req.body.rating,
        comment: req.body.comment,
        updatedAt: todayYMD, //use formatted date to insert into database
    }

    const response = await dbClient
        .getDb()
        .collection('reviews')
        .replaceOne({ _id: reviewtId }, reviews);
    if (response.modifiedCount > 0) {
        res.status(201).end();
    }
    else {
        res.status(500).json(response.error || 'Some error occurred while updating the reviews.');
    }
};

async function deleteReviews(req, res) {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete a review.');
    }
    const reviewsId = new ObjectId(req.params.id);
    const response = await dbClient
        .getDb()
        .collection('reviews')
        .deleteOne({ _id: reviewsId }, true);
    if (response.deletedCount > 0) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleteing the review.');
    }
};

module.exports = { allReviews, createReviews, updateReviews, deleteReviews };