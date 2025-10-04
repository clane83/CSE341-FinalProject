const router = require('express').Router();
const passport = require('passport');


router.use('/users', require('./users'));
router.use('/songs', require('./songs'));
router.use('/reviews', require('./reviews'));
router.use('/playlists', require('./playlists'));
router.use('/', require('./swagger'));


router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);

        req.session.destroy(err2 => {
            if (err2) return next(err2);

            // If you use special cookie flags in prod, mirror them here:
            // res.clearCookie('connect.sid', { sameSite: 'none', secure: true });
            res.clearCookie('connect.sid');

            // Swagger prefers JSON; browsers like a redirect.
            const wantsJSON = (req.get('accept') || '').includes('application/json');
            if (wantsJSON) return res.status(200).json({ message: 'Logged out' });
            return res.redirect('/');
        });
    });
});

module.exports = router;