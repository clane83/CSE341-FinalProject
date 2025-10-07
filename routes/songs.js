const express = require('express')
const router = express.Router();

const songsController = require('../controller/songs')
const validation = require('../middleware/validate')
const { isAuthenticated } = require('../middleware/authentication')

router.get('/', songsController.allSongs);

router.post('/',
  isAuthenticated,
  validation.saveSongs,
  async (req, res, next) => {
    try {
      await songsController.createSongs(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id',
  isAuthenticated,
  validation.saveSongs,
  async (req, res, next) => {
    try {
      await songsController.updateSongs(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

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
  validation.saveSongs,
  async (req, res, next) => {
    try {
      await songsController.deleteSongs(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);


module.exports = router;
