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
    //TODO: group������ ������ username�� �ִ��� Ȯ���ϱ�(underscore.jsȰ��), �̹� �����ϸ� error return�ϱ�
    var isUnique = true;
    if(!isUnique){
        socket.emit('login failed');
        return;
    }
    socket.username = username;
    usernames[username] = username;
    //TODO: ����ڸ� room�� �ֱ�
    socket.join(defaultGroupId);      //TODO: group ������ ���� ����� �̸��� �ִ� ������ �ٲٶ�
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
    //TODO: group�� ����鿡�Ը� ������
    socket.broadcast.in(defaultGroupId).emit('typing', {
        username: socket.username
    });
};

exports.stoptyping = function(socket) {
    //TODO: group�� ����鿡�Ը� ������
    socket.broadcast.in(defaultGroupId).emit('stop typing', {
        username: socket.username
    });
};

exports.disconnect = function(socket) {
    //TODO: group���� �����ϱ�
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
