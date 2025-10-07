const isAuthenticated = (req, res, next) => {
    // let CORS preflight through
    if (req.method === 'OPTIONS') return next();

    // what you actually set in /github/callback
    const authed = req.session?.user || req.user; // session user (preferred), or Passport's req.user

    if (!authed) {
        // Swagger "Try it out" sends application/json; return JSON 401 for APIs
        const wantsJSON = (req.get('accept') || '').includes('application/json') || req.xhr || req.path.startsWith('/api');
        if (wantsJSON) {
            return res.status(401).json('You do not have access.');
        }
        // browser navigation → bounce to login
        return res.redirect('/login?error=auth_required');
    }

    // (optional) expose user to downstream
    req.user = authed;
    next();
};

module.exports = { isAuthenticated };