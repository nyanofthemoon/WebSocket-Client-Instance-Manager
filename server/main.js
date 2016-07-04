'use strict';

let io = require('socket.io')();

const CONFIG      = require('./config');
let ClientManager = require('./modules/ClientManager');
let User          = require('./modules/User');
let logger        = new (require('./modules/Logger'))('SERVER [WEBSOCKET]', CONFIG);
let app           = require(__dirname + '/../client/main');

ClientManager.initialize(io, CONFIG).then(function(clientManager) {
    io.sockets.on('connection', function (socket) {
      logger.info('Socket Connected', socket.id);
      clientManager.handleSocketConnection(socket);
      socket.on('disconnect', function () {
        clientManager.handleSocketDisconnection(socket);
        logger.info('Socket Disconnected', this.id);
      });
    });

    try {
      if (CONFIG.environment.name === 'development') {
        io.listen(CONFIG.environment.port);
        logger.success('Listening on port ' + CONFIG.environment.port);
      } else {
        var server = require('http').createServer(app.app);
        io.listen(server);
        server.listen(CONFIG.environment.port, function () {
          app.logger.success('Listening on port ' + CONFIG.environment.port);
          logger.success('Listening on port ' + CONFIG.environment.port);
        });
      }
    } catch (e) {
      logger.error('Not listening on port ' + CONFIG.environment.port, e);
    }
})
.catch(function (reason) {
  logger.error('ClientManager Initialization Failure', reason);
});