const express = require('express')
const router = express.Router();

const playlistsController = require('../controller/playlists')
// const validation = require('../middleware/validate')
// const { isAuthenticated } = require('../middleware/authentication')

router.get('/', playlistsController.allPlaylists);

module.exports = router;