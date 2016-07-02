'use strict';

let io = require('socket.io')();

let app = require(__dirname + '/../client/main');

const CONFIG      = require('./config');
let ClientManager = require('./modules/ClientManager');
let User          = require('./modules/User');
let logger        = new (require('./modules/Logger'))('SERVER [WEBSOCKET]', CONFIG);

ClientManager.initialize(io, CONFIG).then(function(clientManager) {
    io.sockets.on('connection', function (socket) {
      logger.info('Socket Connected', socket.id);

      if (socket.handshake.query.name) {
        let userId = User.getId(socket.handshake.query.name);
        let user = clientManager.getUser(userId);
        if (!user) {
          user = new User(CONFIG);
          user.initialize(socket, {
            name: socket.handshake.query.name
          });
          clientManager.addUser(user);
          logger.info('Adding New User: ' + user.getName(), socket.id);
        }

        clientManager.data.sessions[socket.id] = userId;
        clientManager.bindSocketToModuleEvents(socket);
      }

      socket.on('disconnect', function () {
        let user = clientManager.getUserBySocketId(this.id);
        delete(clientManager.data.sessions[this.id]);
        if (user.data.instance) {
          let instance = clientManager.getClientInstance(user.data.instance);
          if (instance && instance.hasUser(user)) {
            instance.removeUser(user);
          }
        }

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