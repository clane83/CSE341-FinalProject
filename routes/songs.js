const express = require('express')
const router = express.Router();

const songsController = require('../controller/songs')
// const validation = require('../middleware/validate')
// const { isAuthenticated } = require('../middleware/authentication')

router.get('/', songsController.allSongs);
