// server.js

// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

// --- Swagger UI (ADD) ---
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const app = express();
const port = Number(process.env.PORT) || 5500;
const host = process.env.HOST || '0.0.0.0';



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
        if (process.env.NODE_ENV === 'production') return process.exit(1);
        console.warn('Continuing without DB connection (dev only).');
    }

    app
        .use(express.json())
        .use(session({ secret: 'secret', resave: false, saveUninitialized: true }))
        .use(passport.initialize())
        .use(passport.session())
        .use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-Key', 'Authorization'],
        }));

    // Health check for Render
    app.get('/healthz', (_req, res) => res.status(200).send('ok'));

    // Per-request Swagger doc so host/scheme are correct in prod & dev
    function swaggerSetup(doc) {
        return (req, res, next) => {
            const docCopy = { ...doc };
            docCopy.host = req.get('host');
            docCopy.schemes = [req.protocol];
            docCopy.basePath = docCopy.basePath || '/';
            return swaggerUi.setup(docCopy)(req, res, next);
        };
    }

    app
        .get('/swagger.json', (req, res) => {
            const docCopy = { ...swaggerDoc };
            docCopy.host = req.get('host');
            docCopy.schemes = [req.protocol];
            docCopy.basePath = docCopy.basePath || '/';
            res.json(docCopy);
        })
        .use('/api-docs', swaggerUi.serve, swaggerSetup(swaggerDoc));

    // Your routes
    app.use('/', require('./routes/index.js'));

    app.get('/', (req, res) => {
        res.send(
            req.session.user && req.session.user.username
                ? `Logged in as ${req.session.displayName || req.session.user.username}`
                : 'Logged Out'
        );
    });

    app.get('/github/callback',
        passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
        (req, res) => {
            req.session.user = req.user;
            res.redirect('/');
        }
    );

    const server = app.listen(port, host, () => {
        console.log(`Server listening on http://${host}:${port}`);
    });

    server.on('error', (e) => {
        console.error('Server error:', e);
        process.exit(1);
    });
});

// Passport GitHub strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
