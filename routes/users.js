const express = require('express')
const router = express.Router();

const usersController = require('../controller/users')
const validation = require('../middleware/validate')
const { isAuthenticated } = require('../middleware/authentication')

router.get('/', usersController.allUsers);



router.post('/',
    isAuthenticated,
    validation.saveUser,
    usersController.createUser);
// router.put('/:id',
//     isAuthenticated,
//     validation.saveUser,
//     usersController.updateUser);
// router.delete('/:id',
//     isAuthenticated,
//     validation.saveUser,
//     usersController.deleteUser);


module.exports = router;