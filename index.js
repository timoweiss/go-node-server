'use strict';

var goController = require('go-node');
var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({
    port: 3000
});

// GET     /                           controllers.Application.index()
// GET     /getStatus                  controllers.Application.getStatus()
// GET     /getScore                   controllers.Application.getScore()
// GET     /getGameField               controllers.Application.getGameField()
// GET     /getNext                    controllers.Application.getNext()
// GET     /operate                    controllers.Application.operate()

// GET     /connectWebSocket           controllers.Application.connectWebSocket()

// POST    /setStone                   controllers.Application.setStone()
// POST    /createNewField/:size       controllers.Application.createNewField(size)
// POST    /pass                       controllers.Application.pass()
var game = null;
server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        goController.createField(9);
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
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

server.start(function() {
    console.log('Server running at:', server.info.uri);
});
