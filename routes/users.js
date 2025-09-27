const express = require('express')
const router = express.Router();

const usersController = require('../controller/users')
// const validation = require('../middleware/validate')
// const { isAuthenticated } = require('../middleware/authentication')

router.get('/', usersController.allUsers);

module.exports = router;