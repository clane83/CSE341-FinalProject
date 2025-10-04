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


async function createSongs(req, res) {
    /* #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
            title: 'user@example.com',
            artist: 'Alice Carter',
            album: 'password123',
            durationSec: '90',
            year: '2023',
            genre: 'pop',
            tags: ['66f100000000000000000001','66f100000000000000000003'],
            
          }
       }
    */
    try {
        // const desitnationId = new ObjectId(req.params.id);
        const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        const tagArray = req.body.tags || {};
        const tags = tagArray.tags == null ? [] : (Array.isArray(tagArray.tags) ? tagArray.tags : [tagArray.tags]);

        const songs = {
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            genre: req.body.genre,
            durationSec: req.body.durationSec,
            year: req.body.year,
            tags,
            updatedAt: todayYMD, //use formatted date to insert into database
        }

        const response = await dbClient.getDb().collection('songs').insertOne(songs);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the song.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function updateSongs(req, res) {
    /* #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
            title: 'user@example.com',
            artist: 'Alice Carter',
            album: 'password123',
            durationSec: '90',
            year: '2023',
            genre: 'pop',
            tags: ['66f100000000000000000001','66f100000000000000000003'],
            
          }
       }
    */
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid playlist id to update a song.');
    }
    const songsId = new ObjectId(req.params.id);
    const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const t = req.body.tags;
    const tags = Array.isArray(t) ? t : (t == null ? [] : [t]);

    const songs = {
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        durationSec: req.body.durationSec,
        year: req.body.year,
        tags,
        updatedAt: todayYMD, //use formatted date to insert into database
    }

    const response = await dbClient
        .getDb()
        .collection('songs')
        .replaceOne({ _id: songsId }, songs);
    if (response.modifiedCount > 0) {
        res.status(201).end();
    }
    else {
        res.status(500).json(response.error || 'Some error occurred while updating the song.');
    }
};

async function deleteSongs(req, res) {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete a song.');
    }
    const songsId = new ObjectId(req.params.id);
    const response = await dbClient
        .getDb()
        .collection('songs')
        .deleteOne({ _id: songsId }, true);
    if (response.deletedCount > 0) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleteing the song.');
    }
};



module.exports = { allSongs, createSongs, updateSongs, deleteSongs };