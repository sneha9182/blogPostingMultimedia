const jwt = require('jsonwebtoken');
const logger = require('../config/logger');


// module.exports = auth;
const auth = (req, res, next) => {
    const token = req.headers['token'];
    
    console.log('Received token:', token); // Debug token value

    if (!token) {
        res.status(401).send('Access token is missing or not provided');
        logger.info('Access token is missing or not provided');
        return;
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).send('Access token has expired');
                logger.info('Access token has expired');
            } else {
                res.status(403).send('Unauthorized access');
                logger.info('Unauthorized access');
            }
            return;
        }

        req.user = user; // Ensure this contains user_id
        next();
    });
};

module.exports = auth;
