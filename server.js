// server.js
require('dotenv').config();

const express = require('express');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const app = express();
const port = Number(process.env.PORT) || 5500;
const host = process.env.HOST || '0.0.0.0';

// IMPORTANT: so req.protocol reflects x-forwarded-proto ("https" on Render)
app.set('trust proxy', 1);

// --- global middleware BEFORE routes ---
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Z-Key'],
}));
// app.options('/(.*)', cors());

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true on Render (https)
        sameSite: 'lax',
    },
}));


app.use(passport.initialize());
app.use(passport.session());

// Health check for Render
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Serve swagger.json with correct host/scheme dynamically
app.get('/swagger.json', (req, res) => {
    const doc = { ...swaggerDoc };
    doc.host = req.get('host');      // e.g., your-app.onrender.com
    doc.schemes = [req.protocol];    // 'https' on Render (because of trust proxy)
    doc.basePath = doc.basePath || '/';
    res.json(doc);
});

// Use same dynamic values for the UI
const swaggerSetup = (doc) => (req, res, next) => {
    const docCopy = { ...doc };
    docCopy.host = req.get('host');
    docCopy.schemes = [req.protocol];
    docCopy.basePath = docCopy.basePath || '/';
    return swaggerUi.setup(docCopy, { explorer: true })(req, res, next);
};
app.use('/api-docs', swaggerUi.serve, swaggerSetup(swaggerDoc));

// Your routes
app.use('/', require('./routes/index.js'));

app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/', (req, res) => {
    res.send(
        req.session.user && req.session.user.username
            ? `Logged in as ${req.session.displayName || req.session.user.username}`
            : 'Logged Out'
    );
});



// OAuth callback
app.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', (err, user, info) => {
        if (err) {
            console.error('[OAuth callback err]', err);
            return res.status(500).send('OAuth error: ' + (err.message || String(err)));
        }
        if (!user) {
            console.warn('[OAuth callback no user]', info);
            return res.status(401).send('OAuth failed: ' + (info && (info.message || JSON.stringify(info))));
        }

        // 1) Regenerate session to prevent fixation
        req.session.regenerate((regenErr) => {
            if (regenErr) return next(regenErr);

            // 2) Let Passport establish the login (sets req.user via serializeUser)
            req.login(user, (loginErr) => {
                if (loginErr) return next(loginErr);

                // Optional: also keep a copy for your middleware
                req.session.user = user;

                const dest = req.session.returnTo || '/';
                delete req.session.returnTo;
                return res.redirect(dest);
            });
        });
    })(req, res, next);
});

// DB init → then start server
mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize DB:', err);
        if (process.env.NODE_ENV === 'production') return process.exit(1);
        console.warn('Continuing without DB connection (dev only).');
    }
    const server = app.listen(port, host, () => {
        console.log(`Server listening on http://${host}:${port}`);
    });
    server.on('error', (e) => {
        console.error('Server error:', e);
        process.exit(1);
    });
});

// Passport setup (unchanged)
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL, // must be HTTPS Render URL in prod
},
    function (accessToken, refreshToken, profile, done) {
        //User.findOrCreate((githubId: profile.id), function(err,user){
        return done(null, profile);
        //})
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
