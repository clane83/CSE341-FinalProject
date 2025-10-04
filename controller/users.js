
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
        /* #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
            email: 'user@example.com',
            displayName: 'Alice Carter',
            password: 'password123',
            favorites: {
              songs: ['66f100000000000000000001','66f100000000000000000003'],
              playlists: ['66f200000000000000000001']
            }
          }
       }
    */
        const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        // accept optional favorites, default to []
        const fav = req.body.favorites || {};
        const songs = fav.songs == null ? [] : (Array.isArray(fav.songs) ? fav.songs : [fav.songs]);
        const playlists = fav.playlists == null ? [] : (Array.isArray(fav.playlists) ? fav.playlists : [fav.playlists]);

        const user = {
            email: req.body.email,
            displayName: req.body.displayName,
            password: req.body.password,
            favorites: {
                songs,
                playlists,
            },
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



async function updateUser(req, res) {
    /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'user@example.com',
        displayName: 'Alice Carter',
        password: 'password123',
        favorites: {
          songs: ['66f100000000000000000001','66f100000000000000000003'],
          playlists: ['66f200000000000000000001']
        }
      }
   }
*/
    // at top of controller/users.js you should already have:
    // const { ObjectId } = require('mongodb');
    // const dbClient = require('../data/database');
    try {
        // 1) Validate id
        const id = String(req.params.id || '').trim();
        if (!ObjectId.isValid(id)) {
            return res.status(400).json('Must use a valid user id to update a user.');
        }
        const _id = new ObjectId(id);

        // 2) Build $set ONLY from provided fields (keeps your format)
        const todayYMD = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
        const set = { updatedAt: todayYMD };

        if (req.body.email !== undefined) set.email = req.body.email;
        if (req.body.displayName !== undefined) set.displayName = req.body.displayName;
        if (req.body.password !== undefined) set.password = req.body.password;

        // favorites.* are optional; set only if present
        if (req.body.favorites) {
            const fav = req.body.favorites;
            if (fav.songs !== undefined) {
                set['favorites.songs'] = Array.isArray(fav.songs) ? fav.songs : [fav.songs];
            }
            if (fav.playlists !== undefined) {
                set['favorites.playlists'] = Array.isArray(fav.playlists) ? fav.playlists : [fav.playlists];
            }
        }

        // 3) Run update
        const col = dbClient.getDb().collection('users'); // <-- IMPORTANT: dbClient, not mongodb
        const resp = await col.updateOne({ _id }, { $set: set });

        if (resp.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 4) Return updated (omit password from response if you prefer)
        const updated = await col.findOne({ _id }, { projection: { password: 0 } });
        return res.status(200).json(updated);
    } catch (err) {
        // Keep this to see the real server error while you debug
        console.error('updateUser error:', err);
        return res.status(500).json({ message: err.message });
    }
}


const deleteUser = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json('Must use a valid user id to delete a user.');
        }

        const userId = new ObjectId(req.params.id);
        const response = await dbClient
            .getDb()
            .collection('users')              
            .deleteOne({ _id: userId });     

        if (response.deletedCount > 0) {
            return res.status(204).send();    // No Content on success
        }
        return res.status(404).json({ message: 'User not found.' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports = { allUsers, createUser, updateUser, deleteUser };