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
const port = process.env.PORT || 5500;

// Normalize Swagger for local dev (host/schemes/basePath)
swaggerDoc.host = `localhost:${port}`;
swaggerDoc.schemes = ['http'];
swaggerDoc.basePath = swaggerDoc.basePath || '/';

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
        // In dev, you can keep the server up so /api-docs still works.
        // Exit only in production.
        if (process.env.NODE_ENV === 'production') return process.exit(1);
        console.warn('Continuing without DB connection (dev only).');
    }

    console.log('Database initialized (or skipped for dev). Setting up middleware...');

    try {
        app
            .use(express.json())
            .use(
                session({
                    secret: 'secret',
                    resave: false,
                    saveUninitialized: true,
                })
            )
            .use(passport.initialize())
            .use(passport.session())
            .use(
                cors({
                    origin: '*',
                    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
                    allowedHeaders: [
                        'Origin',
                        'X-Requested-With',
                        'Content-Type',
                        'Accept',
                        'Z-Key',
                        'Authorization',
                    ],
                })
            )

            // --- Swagger endpoints (ADD) ---
            .get('/swagger.json', (_req, res) => res.json(swaggerDoc))
            .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

            // Your routes
            .use('/', require('./routes/index.js'));

        // Simple root
        app.get('/', (req, res) => {
            console.log('Root route hit');
            res.send(
                req.session.user && req.session.user.username
                    ? `Logged in as ${req.session.displayName || req.session.user.username}`
                    : 'Logged Out'
            );
        });

        // GitHub OAuth callback
        app.get(
            '/github/callback',
            passport.authenticate('github', {
                failureRedirect: '/api-docs',
                session: false,
            }),
            (req, res) => {
                console.log('GitHub callback route hit');
                req.session.user = req.user;
                res.redirect('/');
            }
        );

        // Start server — bind IPv4 explicitly
        const server = app.listen(port, '127.0.0.1', () => {
            console.log(`Server listening on http://localhost:${port}`);
        });

        server.on('error', (err) => {
            console.error('Server error:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('Error setting up middleware/routes:', err);
        process.exit(1);
    }
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
