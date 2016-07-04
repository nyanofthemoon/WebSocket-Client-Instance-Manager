import * as _ from 'lodash';

import Store      from './store'
import {createSocketConnection, emitSocketUserQueryEvent, emitSocketInstanceQueryEvent, emitUserJoin, emitUserLeave} from './helpers/socket'
import Config     from './config'
import * as types from './constants/ActionTypes'

let socket
let dispatch

function _getState() {
  return Store.getState()
}

export function connectSocket(username, store) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.CONNECT_SOCKET_REQUESTED)
  }
  socket = createSocketConnection(username, store)
  dispatch = store.dispatch
  socket.on('error', function (error) {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Error', error)
    }
    connectSocketFailure()
  })
  socket.on('connect', function () {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Connect')
    }
    connectSocketSuccess()
  })
  return {type: types.CONNECT_SOCKET_REQUESTED}
}

function connectSocketSuccess() {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.CONNECT_SOCKET_SUCCEEDED)
  }
  dispatch({type: types.CONNECT_SOCKET_SUCCEEDED})
  socket.on('query', function (data) {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Query', data)
    }
    switch (data.type) {
      case 'instance':
        return queryInstanceReception(data)
      case 'user':
        return queryUserReception(data)
      default:
        return queryUnknownReception(data)
    }
  })
  socket.on('join', function (data) {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Join', data)
    }
    return joinInstanceReception(data)
  })
  socket.on('speak', function (data) {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Speak', data)
    }
    return speakInstanceReception(data)
  })
  socket.on('leave', function (data) {
    if (Config.environment.isVerbose()) {
      console.log('[WebSocket] Received Leave', data)
    }
    return leaveInstanceReception(data)
  })
  dispatch({type: types.QUERY_USER_REQUESTED})
  emitSocketUserQueryEvent()
  bindWindowResizeEvent()
  window.dispatchEvent(new Event('resize'))
}

function connectSocketFailure(message) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.CONNECT_SOCKET_FAILED)
  }
  dispatch({type: types.CONNECT_SOCKET_FAILED})
}

export function queryUser() {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.QUERY_USER_REQUESTED)
  }
  emitSocketUserQueryEvent()
  return {type: types.QUERY_USER_REQUESTED, payload: {}}
}

function queryUserReception(data) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.QUERY_USER_RECEIVED + ' for User')
  }
  dispatch({type: types.QUERY_USER_RECEIVED, payload: data.data})
}

export function queryInstance(id) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.QUERY_INSTANCE_REQUESTED)
  }
  emitSocketInstanceQueryEvent(id)
  return {type: types.QUERY_INSTANCE_REQUESTED, payload: {id: id}}
}

function queryInstanceReception(data) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.QUERY_INSTANCE_RECEIVED)
  }
  dispatch({type: types.QUERY_INSTANCE_RECEIVED, payload: data.data})
}

export function joinInstance(id) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.USER_JOIN_INSTANCE_REQUESTED)
  }
  emitUserJoin(id)
  return {type: types.USER_JOIN_INSTANCE_REQUESTED, payload: {id: id}}
}

function joinInstanceReception(data) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.USER_JOIN_INSTANCE_RECEIVED)
  }
  dispatch({type: types.USER_JOIN_INSTANCE_RECEIVED, payload: data.data})
}

function speakInstanceReception(data) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.USER_SPEAK_INSTANCE_RECEIVED)
  }
  dispatch({type: types.USER_SPEAK_INSTANCE_RECEIVED, payload: data.data})
}

export function leaveInstance(id) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.USER_LEAVE_INSTANCE_REQUESTED)
  }
  emitUserLeave(id)
  return {type: types.USER_LEAVE_INSTANCE_REQUESTED, payload: {id: id}}
}

function leaveInstanceReception(data) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.USER_LEAVE_INSTANCE_RECEIVED)
  }
  dispatch({type: types.USER_LEAVE_INSTANCE_RECEIVED, payload: data.data})
}

function queryUnknownReception(data) {
  if (Config.environment.isVerbose()) {
    console.log('[Action   ] Run ' + types.QUERY_UNKNOWN_RECEIVED)
  }
  dispatch({type: types.QUERY_UNKNOWN_RECEIVED, payload: data})
}

function bindWindowResizeEvent() {
  window.addEventListener('resize', _.debounce(function (e) {
    if (Config.environment.isVerbose()) {
      console.log('[Action   ] Run ' + types.WINDOW_RESIZE_EVENT_RECEIVED)
    }
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    dispatch({type: types.WINDOW_RESIZE_EVENT_RECEIVED, payload: {width: width, height: height}})
  }, Config.debounce.windowResize.interval, Config.debounce.windowResize.options))
}