const router = require('express').Router();
const passport = require('passport');

router.use('/users', require('./users'));
router.use('/destination', require('./songs'));
router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags = ['Hello world']
    res.send('API is running. See /api-doc for swagger UI.');
});

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(err2 => {
            if (err2) return next(err2);
            res.clearCookie('connect.sid');
            const wantsJSON = (req.get('accept') || '').includes('application/json');
            if (wantsJSON) return res.status(200).json({ message: 'Logged out' });
            return res.redirect('/');
        });
    });
});