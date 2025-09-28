
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

module.exports = { allUsers, createUser };