var usernames = {};
var numUsers = 0;
var addedUser = false;
var defaultGroupId = "default_group_id";

exports.message = function(socket, msg) {
    socket.broadcast.in(defaultGroupId).emit('new message', {
        username: socket.username,
        message: msg
    });
};

exports.join = function(socket, username, position, radius) {
    //TODO: group내에서 동일한 username이 있는지 확인하기(underscore.js활용), 이미 존재하면 error return하기
    var isUnique = true;
    if(!isUnique){
        socket.emit('login failed');
        return;
    }
    socket.username = username;
    usernames[username] = username;
    //TODO: 사용자를 room에 넣기
    socket.join(defaultGroupId);      //TODO: group 개념이 들어가면 사용자 이름을 넣는 것으로 바꾸라
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
        numUsers: numUsers
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.in(defaultGroupId).emit('user joined', {
        username: socket.username,
        numUsers: numUsers
    });
};

exports.typing = function(socket) {
    //TODO: group내 사람들에게만 보내기
    socket.broadcast.in(defaultGroupId).emit('typing', {
        username: socket.username
    });
};

exports.stoptyping = function(socket) {
    //TODO: group내 사람들에게만 보내기
    socket.broadcast.in(defaultGroupId).emit('stop typing', {
        username: socket.username
    });
};

exports.disconnect = function(socket) {
    //TODO: group에서 제거하기
    // remove the username from global usernames list
    if (addedUser) {
        delete usernames[socket.username];
        --numUsers;

        // echo globally that this client has left
        socket.broadcast.in(defaultGroupId).emit('user left', {
            username: socket.username,
            numUsers: numUsers
        });
    }
};
