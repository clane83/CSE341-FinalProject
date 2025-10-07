const express = require('express')
const router = express.Router();

const playlistsController = require('../controller/playlists')
const validation = require('../middleware/validate')
const { isAuthenticated } = require('../middleware/authentication')

router.get('/', playlistsController.allPlaylists);


router.post('/',
  isAuthenticated,
  validation.savePlayLists,
  async (req, res, next) => {
    try {
      await playlistsController.createPlayLists(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id',
  isAuthenticated,
  validation.savePlayLists,
  async (req, res, next) => {
    try {
      await playlistsController.updatePlayLists(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);
router.delete('/:id',
  /*
  #swagger.consumes = []   // explicitly no request body
*/
  isAuthenticated,
  validation.savePlayLists,
  async (req, res, next) => {
    try {
      await playlistsController.deletePlayLists(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);


module.exports = router;