'use strict';

var sanitizer = require('sanitizer');

let Logger         = require('./Logger');
let ClientInstance = require('./ClientInstance');
let User           = require('./User');

class ClientManager {

    constructor(config) {
        this.logger  = new Logger('CLIENT MANAGER', config);
        this.config  = config;
        this.sockets = null;
        this.data    = {
            sessions : {},
            users    : {},
            instances: {}
        };
    }

    addUser(user) {
        this.data.users[user.getId()] = user;
    };

    getUser(sessionIdentifier) {
        return this.data.users[sessionIdentifier] || null;
    };

    getUsers() {
        return this.data.users || {};
    };

    addClientInstance(id, data) {
        this.data.instances[id] = data;
    };

    getClientInstance(id) {
        return this.data.instances[id] || null;
    };

    getClientInstances() {
        return this.data.instances || {};
    };

    static initialize(io, config) {
        return new Promise(function(resolve, reject) {
            try {
                let game     = new ClientManager(config);
                game.sockets = io;
                resolve(game);
            } catch (e) {
                reject();
            }
        });
    }

    getUserBySocketId(id) {
        return this.data.users[this.data.sessions[id]];
    }

    bindSocketToModuleEvents(socket) {
        var that = this;
        try {
            socket.on('error', function(data) { that.error(data, socket); });
            socket.on('query', function(data) { that.query(data, socket); });
            socket.on('enter', function(data) { that.enter(data, socket); });
            socket.on('leave', function(data) { that.leave(data, socket); });
        } catch (e) {
            this.logger.error('Socket ' + socket.id + ' not bound to events ', e);
        }
    }

    enter(data, socket) {
        try {
            let user     = this.getUserBySocketId(socket.id);
            var instance = this.getClientInstance(data.id);
            if (!instance) {
                instance = new ClientInstance(this.config);
                instance.initialize(this.sockets, {
                    id: data.id
                });
                this.addClientInstance(data.id, instance);
            }
            if (user.canEnter(instance)) {
                let enteredInstance = this.getClientInstance(user.getInstance());
                if (enteredInstance && user.canLeave(enteredInstance)) {
                    user.leave(enteredInstance);
                }
                user.enter(instance);
                this.logger.verbose('[ENTER] ' + JSON.stringify(data));
            } else {
                this.logger.verbose('[ENTER] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[ENTER] ' + JSON.stringify(data) + ' ' + e);
        }
    }

    leave(data, socket) {
        try {
            let user     = this.getUserBySocketId(socket.id);
            let instance = this.getClientInstance(data.id);
            if (instance && user.canLeave(instance)) {
                user.leave(instance);
                this.logger.verbose('[LEAVE] ' + JSON.stringify(data));
            } else {
                this.logger.verbose('[LEAVE] Invalid ' + JSON.stringify(data));
            }
        } catch (e) {
            this.logger.error('[LEAVE] ' + JSON.stringify(data), e);
        }
    }

    query(data, socket) {
        try {
            let info = null;
            switch(data.type) {
                case 'instance':
                    info = this.data.instances[data.id].query();
                    break;
                case 'user':
                    info = this.getUserBySocketId(socket.id).query();
                    break;
                default: break;
            }
            socket.emit('query', info);
            this.logger.verbose('[QUERY] ' + data.type);
        } catch (e) {
            this.logger.error('[QUERY] ' + JSON.stringify(info) + ' ' + e);
        }
    }

    error(data, socket) {
        try {
            socket.emit('error', {event: 'error'});
        } catch (e) {
            this.logger.error('An unknown socket error has occured', e);
        }
    }

};

module.exports = ClientManager;