const validate = require('../helpers/validate');

/*********************
 * Save User
 *********************/
const saveUser = (req, res, next) => {
    //Only validate for POST/PUT
    if (req.method === 'POST' || req.method === 'PUT') {
        const validationRule = {
            email: 'required|string',   // fixed key name
            password: 'required|string'
        };
        validate(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
            } else {
                return next();
            }
        });
    } else {
        //skips validation for DELETE/GET
        return next()
    }

};


/*********************
 * Save Playlists
 *********************/

const savePlayLists = (req, res, next) => {
    //Only validate for POST/PUT
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.body.songs && !Array.isArray(req.body.songs)) {
            req.body.songs = [req.body.songs];
        }
        if (req.body.followers && !Array.isArray(req.body.followers)) {
            req.body.followers = [req.body.followers];
        }
        const validationRule = {
            owner: 'required|string',   // fixed key name
            name: 'required|string',
            description: 'required|string',
            isPublic: 'required|string',
            songs: 'required|array',
            followers: 'required|array',
            // createdat: 'required|date',  //set by the server
            // updatedat: 'required|date',  //set by the server

        };
        validate(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
            } else {
                return next();
            }
        });
    } else {
        return next();
    }

};



/*********************
 * Save Reviews
 *********************/

const saveReviews = (req, res, next) => {
    //Only validate for POST/PUT
    if (req.method === 'POST' || req.method === 'PUT') {

        const validationRule = {
            author: 'required|string',   // fixed key name
            targetType: 'required|string',
            targetId: 'required|string',
            rating: 'required|string',
            comment: 'required|string',
            // createdat: 'required|date',  //set by the server
            // updatedat: 'required|date',  //set by the server

        };
        validate(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
            } else {
                return next();
            }
        });
    } else {
        return next();
    }

};



/*********************
 * Save Songs
 *********************/
const saveSongs = (req, res, next) => {
    //Only validate for POST/PUT
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.body.tags && !Array.isArray(req.body.tags)) {
            req.body.tags = [req.body.tags];
        }

        const validationRule = {
            title: 'required|string',   // fixed key name
            artist: 'required|string',
            album: 'required|string',
            genre: 'required|string',
            durationSec: 'required|string',
            year: 'required|string',
            tags: 'required|array',
            // createdon: 'required|date',  //set by the server


        };
        validate(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
            } else {
                return next();
            }
        });
    } else {
        return next();
    }

};

module.exports = { saveUser, savePlayLists, saveReviews, saveSongs };


