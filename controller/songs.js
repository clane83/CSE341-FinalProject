const { ObjectId } = require('mongodb');
const dbClient = require('../data/database');

async function allSongs(_req, res) {
    try {
        const songs = await dbClient
            .getDb()
            .collection('songs')
            .find({})
            .toArray();
        res.status(200).json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { allSongs };