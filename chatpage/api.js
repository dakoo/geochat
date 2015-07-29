var call = require('./handlers');
exports.api = [
    { method: 'GET', path: '/', handler: call.front },
    { method: 'GET', path: '/{filename*}', handler: call.get}];