'use strict';

var goController = require('go-node');
var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({
    port: 3000
});

var io = require('socket.io')(server.listener);

// GET     /                           controllers.Application.index()

// GET     /connectWebSocket           controllers.Application.connectWebSocket()

io.on('connection', function() {
    console.log('new user');
    io.emit('new-user');
});

goController.gameField.on('setStone', function(cell) {
    io.emit('setStone', cell);
});

var game = null;
server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        goController.createField(9);
        reply('<html><head><script src="https://cdn.socket.io/socket.io-1.2.1.js"></script></head><body><script>var socket = io();</script></body></html>');
    }
});

server.route({
    method: 'POST',
    path: '/createNewField/{size}',
    handler: function(request, reply) {
        var size = encodeURIComponent(request.params.size);
        goController.createField(size);
        reply({
            gamefield: goController.gameField
        });
    }
});

server.route({
    method: 'GET',
    path: '/getGameField',
    handler: function(request, reply) {

        goController.setStone(1, 2);
        reply({
            gamefield: goController.gameField.gameField
        });
    }
});

server.route({
    method: 'POST',
    path: '/pass',
    handler: function(request, reply) {
        reply(goController.pass());
    }
});

server.route({
    method: 'GET',
    path: '/getNext',
    handler: function(request, reply) {
        reply(goController.getNext());
    }
});


server.route({
    method: 'GET',
    path: '/operate',
    handler: function(request, reply) {
        reply(goController.operate());
    }
});

server.route({
    method: 'GET',
    path: '/getScore',
    handler: function(request, reply) {

        reply(getScore());
    }
});

server.route({
    method: 'GET',
    path: '/getStatus',
    handler: function(request, reply) {

        reply(getStatus());
    }
});

function getScore() {
    var ws = goController.getWhitePlayerScore();
    var bs = goController.getBlackPlayerScore();
    return {
        white: ws,
        black: bs
    };
}

function getStatus() {
    var status = {};
    status.next = goController.getNext();
    status.score = getScore();
    return status;
}

server.start(function() {
    console.log('Server running at:', server.info.uri);
});
