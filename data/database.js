// data/database.js
const { MongoClient } = require('mongodb');

let client, database;

async function initDb(cb) {
    try {
        if (database) return cb?.(null, database);

        const uri = process.env.MONGODB_URL || process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('Missing MONGODB_URL/MONGODB_URI env var (Render).');
        }
        if (/localhost|127\.0\.0\.1/.test(uri)) {
            throw new Error('Mongo URI points to localhost. Use your Atlas/hosted URI in Render.');
        }

        client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
        await client.connect();

        // Use db name from env if you want to force it; otherwise use the one in URI
        const dbName = process.env.MONGODB_DB;
        database = dbName ? client.db(dbName) : client.db();

        await database.command({ ping: 1 }); // fail early if auth/network is wrong
        console.log('Mongo connected to:', database.databaseName);
        return cb?.(null, database);
    } catch (err) {
        console.error('Mongo init error:', err.message);
        return cb?.(err);
    }
}

function getDb() {
    if (!database) throw new Error('Database not initialized');
    return database;
}

module.exports = { initDb, getDb };
