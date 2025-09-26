const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');


const app = express();

const port = process.env.PORT || 6000;

app
    .use(bodyParser.json())
    .use(session({
        secret: "secret", //cookie for this you will want to use a better name than secret
        resave: false,
        saveUninitialized: true,
    }))
    //this is the basic express session(..)) initialization
    .use(passport.initialize())
    //Init passport on every route call
    .use(passport.session())
    //allow passport to use "express-session"
    .use((req, res, next) => {
        res.setHeader("Access-Controll-Allow-Origin", "*");
        res.setHeader("Access-Controll-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
        );
        res.setHeader(
            "Access-Controll-Allow-Methods",
            "POST, GET, PUT, PATCH, OPTIONS, DELETE"
        );
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
    .use(cors({ origin: "*" }))
    .use("/", require("./routes/index.js"));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
},
    function (accessToken, refreshToken, profile, done) {
        //User.findOrCreate((githubId: profile.id), function(err,user){
        return done(null, profile);
        //})
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {
    res.send(req.session.user !== undefined
        ? `logged in as ${req.session.displayName || req.session.user.username}`
        : "Logged Out")
});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false
}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize DB', err);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
        });
    }
});