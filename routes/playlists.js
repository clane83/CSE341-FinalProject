const express = require('express')
const router = express.Router();

const playlistsController = require('../controller/playlists')
const validation = require('../middleware/validate')
const { isAuthenticated } = require('../middleware/authentication')

router.get('/', playlistsController.allPlaylists);


router.post('/',
    isAuthenticated,
    validation.savePlayLists,
    playlistsController.createPlayLists);
router.put('/:id',
    isAuthenticated,
    validation.savePlayLists,
    playlistsController.updatePlayLists);
router.delete('/:id',
    /*
    #swagger.parameters = [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'string',
        description: 'Song ID'
      }
    ]
    #swagger.consumes = []   // explicitly no request body
  */
    isAuthenticated,
    validation.savePlayLists,
    playlistsController.deletePlayLists);


module.exports = router;