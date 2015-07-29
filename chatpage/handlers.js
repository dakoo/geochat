exports.front = {
    file: function (request) {
        return __dirname + '/client/' + 'chat.html';
    }
};
exports.get = {
    file: function (request) {
        return __dirname + '/client/' + request.params.filename;
    }
};