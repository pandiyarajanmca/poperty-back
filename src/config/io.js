

const jwt = require('jsonwebtoken');
//const redis = require('socket.io-redis');
const { ioPort, jwtSecret } = require('./vars');
const io = require('socket.io').listen(ioPort);

//io.adapter(redis({ host: 'localhost', port: 6379 }));


io.sockets.use((socket, next) => {
    try {
        const token = JSON.parse(socket.handshake.query.token);
        if (token) {
            jwt.verify(token.accessToken, jwtSecret, (err, decoded) => {
                if (err) {
                    if (err instanceof jwt.TokenExpiredError) {
                        return next(new Error('EXPIRED'));
                    }

                    return next(new Error('FORBIDDEN'));
                }
                socket.decoded = decoded;
            });
            return next();
        }
    } catch (e) {
        return next();
    }
});


module.exports = io;
