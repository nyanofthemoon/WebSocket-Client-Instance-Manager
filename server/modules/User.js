'use strict';

let CryptoJS = require('crypto-js');

let Logger = require('./Logger');

const CONFIG = require('./../config');

class User {

  constructor(config) {
    this.logger = new Logger('USER', config);
    this.socket = null;
    this.data = {
      name    : CONFIG.user.defaultName,
      instance: null
    };
  }

  initialize(socket, data) {
    this.socket = socket;
    let that    = this;
    Object.keys(data).forEach(function (key) {
      that.data[key] = data[key];
    });
  }

  static getId(name) {
    return CryptoJS.SHA3(CONFIG.user.salt + [...name].reverse().join());
  }

  getId() {
    return User.getId(this.data.name);
  }

  getName() {
    return this.data.name;
  }

  getInstance() {
    return this.data.instance;
  }

  query() {
    var struct = {
      'type': 'user',
      'data': {
        'name': this.getName()
      }
    };

    return struct;
  }

  canJoin(instance) {
    return !instance.hasUser(this);
  }

  join(instance) {
    let instanceId = instance.getId();
    this.socket.join(instanceId);
    this.data.instance = instanceId;
    instance.addUser(this);
    this.socket.emit('query', instance.query());
    this.socket.to(instanceId).emit('join', this.query());
  }

  canLeave(instance) {
    return instance.hasUser(this);
  }

  leave(instance) {
    let instanceId = instance.getId();
    this.socket.leave(instanceId);
    instance.removeUser(this);
    this.socket.to(instanceId).emit('leave', this.query());
  }

};

module.exports = User;