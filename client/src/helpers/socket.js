'use strict';

import io from 'socket.io-client'

import Config     from './../config'
import * as types from './../constants/ActionTypes'

let socket

export function createSocketConnection(username) {
  if (Config.environment.isVerbose()) {
    console.log('[WebSocket] Emit Connection for ' + username)
  }
  socket = io.connect('//' + Config.environment.host + Config.environment.port, {"query": {"name": username}})
  return socket
}

export function emitSocketUserQueryEvent() {
  if (Config.environment.isVerbose()) {
    console.log('[WebSocket] Emit User Query')
  }
  socket.emit('query', {type: 'user'})
}

export function emitUserJoin(id) {
  if (Config.environment.isVerbose()) {
    console.log('[WebSocket] Emit User Join')
  }
  socket.emit('join', {id: id})
}

export function emitUserLeave(id) {
  if (Config.environment.isVerbose()) {
    console.log('[WebSocket] Emit User Leave')
  }
  socket.emit('leave', {id: id})
}

export function emitSocketInstanceQueryEvent(id) {
  if (Config.environment.isVerbose()) {
    console.log('[WebSocket] Emit Instance Query for ' + id)
  }
  socket.emit('query', {type: 'instance', id: id})
}