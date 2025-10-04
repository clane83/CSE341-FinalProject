const express = require('express')
const router = express.Router();

const songsController = require('../controller/songs')
const validation = require('../middleware/validate')
// const { isAuthenticated } = require('../middleware/authentication')

router.get('/', songsController.allSongs);

router.post('/',
    // isAuthenticated,
    validation.saveSongs,
    songsController.createSongs);
router.put('/:id',
    // isAuthenticated,
    validation.saveSongs,
    songsController.updateSongs);
router.delete('/:id',
    // isAuthenticated,
    validation.saveSongs,
    songsController.deleteSongs);

module.exports = router;
