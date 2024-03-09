const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.createJWT = (id, role) => {
    const payload = {
        id,
        role
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION
    });
};

exports.verifyUser = (req, res, next) => {
    let token = ''
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
            try {
                if (err) {
                    return res.status(401).json({ error: 'User unauthorized!' });
                }
                if (decoded) {
                    const user = await User.findByPk(decoded.id)
                    if (!user) {
                        return res.status(401).json({ error: 'User not found!' });
                    } else {
                        req.user = {
                            id: decoded.id,
                            role: decoded.role
                        }
                        return next();
                    }
                }
            } catch (e) {
                console.log(e)
                return res.status(500).json({ error: 'Something bad happened!' });
            }
        })
    } else {
        return res.status(401).json({ error: 'User unauthorized!' });
    }
};

// exports.withRole = (ArrayRoles) => (req, res, next) => {
//     const { user } = req
//     if (!user) {
//         return res.status(401).json({ error: 'User unauthorized!' });
//     }
//     if (!user.role) {
//         return res.status(403).json({ error: 'Forbidden!' });
//     }
//     if (ArrayRoles.includes(user.role)) {
//         return next();
//     }
//     return res.status(403).json({ error: 'Forbidden!' });
// };

