'use strict';

let Logger = require('./logger')

const CLIENT_INSTANCE_STATUS_INIT  = 'initializing'
const CLIENT_INSTANCE_STATUS_WAIT  = 'waiting'
const CLIENT_INSTANCE_STATUS_START = 'started'
const CLIENT_INSTANCE_STATUS_STOP  = 'stopped'

class ClientInstance {

  constructor(config) {
    this.logger = new Logger('CLIENT INSTANCE', config)
    this.socket = null
    this.data = {
      id     : null,
      status : null,
      users  : {}
    };
  }

  initialize(socket, data) {
    this.socket      = socket
    this.data.status = CLIENT_INSTANCE_STATUS_INIT
    var that         = this
    Object.keys(data).forEach(function (key) {
      that.data[key] = data[key]
    })
  }

  getId() {
    return this.data.id
  }

  getStatus() {
    return this.data.status
  }

  wait() {
    // @TODO Waiting for users to join. Add logic.
    this.data.status = CLIENT_INSTANCE_STATUS_WAITING
  }

  start() {
    // @TODO Start! Add running logic.
    this.data.status = CLIENT_INSTANCE_STATUS_STARTED
  }

  stop() {
    // @TODO Ended... Add completion logic.
    this.data.status = CLIENT_INSTANCE_STATUS_STOPPED
  }

  query() {
    var struct = {
      type: 'instance',
      data: {
        id    : this.getId(),
        status: this.getStatus(),
        users : this.getUsers()
      }
    }

    return struct
  }

  getUsers() {
    return this.data.users
  }

  hasUser(user) {
     if (!this.data.users[user.getId()]) {
       return false
     }

    return true
  }

  removeUser(user) {
    delete this.data.users[user.getId()]
  }

  addUser(user) {
    this.data.users[user.getId()] = true
  }

}

module.exports = ClientInstance