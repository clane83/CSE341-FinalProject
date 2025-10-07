const express = require('express')
const router = express.Router();

const usersController = require('../controller/users')
const validation = require('../middleware/validate')
const { isAuthenticated } = require('../middleware/authentication')

router.get('/', usersController.allUsers);



router.post('/',
    isAuthenticated,
    validation.saveUser,
    async (req, res, next) => {
        try {
            await usersController.createUser(req, res, next);
        } catch (err) {
            next(err);
        }
    }
);

router.put('/:id',
    isAuthenticated,
    validation.saveUser,
    async (req, res, next) => {
        try {
            await usersController.updateUser(req, res, next);
        } catch (err) {
            next(err);
        }
    }
);

router.delete('/:id',
    isAuthenticated,
    validation.saveUser,
    async (req, res, next) => {
        try {
            await usersController.deleteUser(req, res, next);
        } catch (err) {
            next(err);
        }
    }
);



module.exports = router;