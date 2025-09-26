const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;

async function initDb(callback) {
    try {
        if (database) {
            console.log('Database already initialized');
            return callback(null, database);
        }
        const client = await MongoClient.connect(process.env.MONGODB_URL);
        database = client.db(); // uses default DB from connection string
        console.log('MongoDB connected');
        return callback(null, database);
    } catch (err) {
        return callback(err);
    }
}

function getDb() {
    if (!database) throw new Error('Database not initialized');
    return database;
}

module.exports = {
    initDb,
    getDb,
};