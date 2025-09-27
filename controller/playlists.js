const { ObjectId } = require('mongodb');
const dbClient = require('../data/database');

async function allPlaylists(_req, res) {
    try {
        const playlists = await dbClient
            .getDb()
            .collection('playlists')
            .find({})
            .toArray();
        res.status(200).json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { allPlaylists };