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
        database = client.db();
        console.log('MongoDB connected to database:', database.databaseName);
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