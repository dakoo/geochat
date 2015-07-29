exports.front = {
    file: function (request) {
        return __dirname + '/client/' + 'index.html';
    }
};
exports.get = {
    file: function (request) {
        return __dirname + '/client/' + request.params.filename;
    }
};
