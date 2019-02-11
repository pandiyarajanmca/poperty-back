const io = require('../../config/io');

/**
 * common function for emit data to socket events.
 * @param {} data
 */
exports.emitData = async (channelName, data) => {
    try {
        io.emit(channelName, { result: data });
        return true;
    } catch (error) {
        throw error;
    }
};
