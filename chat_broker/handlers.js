var usernames = {};
var numUsers = 0;
var addedUser = false;

exports.message = function(socket, msg) {
    socket.broadcast.emit('new message', {
        username: socket.username,
        message: msg
    });
};

exports.adduser = function(socket, username) {
    socket.username = username;
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
        numUsers: numUsers
    });
    socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
    });
};

exports.typing = function(socket) {
    socket.broadcast.emit('typing', {
        username: socket.username
    });
};

exports.stoptyping = function(socket) {
    socket.broadcast.emit('stop typing', {
        username: socket.username
    });
};

exports.disconnect = function(socket) {
    if (addedUser) {
        delete usernames[socket.username];
        --numUsers;
        socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
        });
    }
};
