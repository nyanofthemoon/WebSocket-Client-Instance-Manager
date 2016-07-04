import {fromJS} from 'immutable'

import Config     from './../config'
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
  state: 'disconnected'
})

const manager = (state = initialState, action) => {
  let actionIsInCurrentReducer = true
  let nextState;
  switch (action.type) {
    case types.CONNECT_SOCKET_REQUESTED:
      nextState = fromJS(state).set('state', 'connecting')
      break;
    case types.CONNECT_SOCKET_SUCCEEDED:
      nextState = fromJS(state).set('state', 'connected')
      break;
    case types.CONNECT_SOCKET_FAILED:
      nextState = fromJS(state).set('state', 'disconnected')
      break;
    case types.WINDOW_RESIZE_EVENT_RECEIVED:
      break
    default:
      actionIsInCurrentReducer = false
      break;
  }
  if (Config.environment.isVerbose() && actionIsInCurrentReducer) {
    console.log('[Reducer  ] Manager ' + action.type)
  }
  return nextState || state
}

export default manager