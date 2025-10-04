
const { ObjectId } = require('mongodb');
const dbClient = require('../data/database');

async function allUsers(_req, res) {
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

async function createUser(req, res) {
    try {
        const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
        const user = {
            email: req.body.email,
            displayName: req.body.displayName,
            password: req.body.password,
            createdAt: todayYMD, //use formatted date to insert into database
            updatedAt: todayYMD, //use formatted date to insert into database
            role: "user"
        };
        const result = await dbClient.getDb().collection('users').insertOne(user);
        res.status(201).json({ _id: result.insertedId, ...user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


const updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid playlist id to update a user.');
    }
    const userId = new ObjectId(req.params.id);
    const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const user = {
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password,
        songs: toObjectIdArray(req.body.songs),
        playlists: toObjectIdArray(req.body.playlists),
        updatedAt: todayYMD, //use formatted date to insert into database
        role: "user"
    }

    const response = await mongodb
        .getDb()
        .collection('user')
        .replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
        res.status(201).end();
    }
    else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

const deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete a user.');
    }
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
        .getDb()
        .collection('user')
        .deleteOne({ _id: userId }, true);
    if (response.deletedCount > 0) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleteing the user.');
    }
};

module.exports = { allUsers, createUser, updateUser, deleteUser };