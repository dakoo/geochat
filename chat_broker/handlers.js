var _ = require('underscore');
var User = function(username, position, radius){
    this.username = username;
    this.position = position;
    this.radius = radius;
    this.talkers = [];
}
var users = [];
var createTalkerGroup = function(socket, username, position, radius){
    var user = new User(username, position, radius);
    if(user.length == 0){
        socket.join(username);
        users.push(user);
        return true;
    }
    if(_.findWhere(users, {username:username})!= undefined){
        return false;
    }
    socket.join(username);
    var talkers = _.filter(users, function(member){
       var distance = calculateDistance(user.position.latitude,
       user.position.longitude, member.position.latitude, member.position.longitude);
        console.log('distance: '+ distance);
        console.log('user.radius: ' + user.radius);
        console.log('member.raidus: ' + member.radius);
        if((user.radius > distance) && (member.radius > distance)){
            member.talkers.push(username);
            return true;
        }
        else {
            return false;
        }
    });
    user.talkers = _.pluck(talkers, 'username');
    users.push(user);
    return true;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
};

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
};

var sendMessageToGroup = function(socket, username, head, body){
    var user = _.findWhere(users, {username:username});
    if(user == undefined){
        return;
    }
    if(user.talkers.length == 0){
        return;
    }
    _.each(user.talkers, function(membername){
        socket.broadcast.to(membername).emit(head, body);
    });
};

var terminateGroup = function(socket, username){
    var user = _.findWhere(users, {username: username});
    if(user == undefined){
        return;
    }
    users = _.reject(users, {username:username});
    _.each(user.talkers, function(talker){
        socket.broadcast.to(talker).emit('user left', {
            username:username,
            numUsers: _.findWhere(users, {username:username}).talkers.length + 1
        });
    });
    _.each(users, function (member){
        member.talkers = _.reject(member.talkers, function(name){
            return name === username;
        });
    });
};

exports.message = function(socket, msg) {
    sendMessageToGroup(socket, socket.username, 'new message', {
        username: socket.username,
        message: msg
    });
};

exports.join = function(socket, username, position, radius) {
    var isSuccessful = createTalkerGroup(socket, username, position, radius);
    if(!isSuccessful){
        socket.emit('login failed');
        return;
    }
    socket.username = username;
    socket.emit('login', {
       numUsers: _.findWhere(users, {username:username}).talkers.length + 1
    });
    sendMessageToGroup(socket, username, 'user joined', {
        username: socket.username,
        numUsers: _.findWhere(users, {username: username}).talkers.length + 1
    });
};

exports.typing = function(socket) {
    sendMessageToGroup(socket, socket.username, 'typing', {
        username: socket.username
    });
};

exports.stoptyping = function(socket) {
    sendMessageToGroup(socket, socket.username, 'stop typing', {
        username: socket.username
    });
};

exports.disconnect = function(socket) {
    terminateGroup(socket, socket.username);
};
