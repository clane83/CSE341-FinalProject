const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');


const app = express();

const port = process.env.PORT || 3000;

// Catch unhandled errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});


// Initialize database first
mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize DB:', err);
        process.exit(1);
    }
    console.log('Database initialized, setting up middleware...');
    app
        .use(express.json())
        .use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }))
        .use(passport.initialize())
        .use(passport.session())
        .use(cors({
            origin: "*",
            methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-Key', 'Authorization'],
        }))
        .use("/", require("./routes/index.js"));

    app.get('/', (req, res) => {
        res.send(req.session.user !== undefined
            ? `Logged in as ${req.session.displayName || req.session.user.username}`
            : "Logged Out");
    });

    app.get('/github/callback', passport.authenticate('github', {
        failureRedirect: '/api-docs',
        session: false,
    }), (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
});


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));


passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});




