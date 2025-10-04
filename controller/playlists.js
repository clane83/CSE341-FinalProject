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

async function createPlayLists(req, res) {
    /* #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
            owner: '66f000000000000000000001',
            name: 'Coding Lo-Fi',
            description: 'Lo-fi tracks for deep work sessions.',
            songs: ['66f100000000000000000001','66f100000000000000000003'],
            isPublic: true,
            followers: ['66f200000000000000000001']
          }
       }
    */

    try {
        // const desitnationId = new ObjectId(req.params.id);
        const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        const f = req.body.followers;
        const followers = Array.isArray(f) ? f : (f == null ? [] : [f]);

        const s = req.body.songs;
        const songs = Array.isArray(s) ? s : (s == null ? [] : [s]);


        const playlists = {
            owner: req.body.owner,
            name: req.body.name,
            description: req.body.description,
            isPublic: req.body.isPublic,
            songs,
            followers,
            createdby: req.body.createdby,
            createdAt: todayYMD, //use formatted date to insert into database
            updatedAt: todayYMD, //use formatted date to insert into database
        }

        const response = await dbClient.getDb().collection('playlists').insertOne(playlists);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the playlists.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function updatePlayLists(req, res) {
    /* #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
            owner: '66f000000000000000000001',
            name: 'Coding Lo-Fi',
            description: 'Lo-fi tracks for deep work sessions.',
            songs: ['66f100000000000000000001','66f100000000000000000003'],
            isPublic: true,
            followers: ['66f200000000000000000001']
          }
       }
    */
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid playlist id to update a playlist.');
    }
    const playListId = new ObjectId(req.params.id);
    const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const playlists = {
        owner: req.body.owner,
        name: req.body.name,
        description: req.body.description,
        isPublic: req.body.isPublic,
        songs: req.body.songs,
        followers: req.body.followers,
        createdby: req.body.createdby,
        updatedAt: todayYMD, //use formatted date to insert into database
    }

    const response = await dbClient
        .getDb()
        .collection('playlists')
        .replaceOne({ _id: playListId }, playlists);
    if (response.modifiedCount > 0) {
        res.status(201).end();
    }
    else {
        res.status(500).json(response.error || 'Some error occurred while updating the playlist.');
    }
};

async function deletePlayLists(req, res) {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete a playlist.');
    }
    const playListId = new ObjectId(req.params.id);
    const response = await dbClient
        .getDb()
        .collection('playlists')
        .deleteOne({ _id: playListId }, true);
    if (response.deletedCount > 0) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleteing the playlist.');
    }
};


module.exports = { allPlaylists, createPlayLists, updatePlayLists, deletePlayLists };