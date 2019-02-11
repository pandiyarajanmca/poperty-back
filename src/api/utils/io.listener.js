const io = require('../../config/io');

/**
 * listing all sockets events
 */
io.sockets.on('connection', (socket) => {
    if (socket.decoded) {
        socket.emit('joined', { connected: true });
    }

    socket.on('loggedIn', (data) => {
        console.log(data);
    });
});
