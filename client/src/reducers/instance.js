import {fromJS} from 'immutable'

import Config     from './../config'
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
  status: 'unjoined',
  data: {
    id    : null,
    status: 'waiting',
    users : {}
  }
})

const instance = (state = initialState, action) => {
  let actionIsInCurrentReducer = true
  let nextState
  switch (action.type) {
    case types.QUERY_INSTANCE_REQUESTED:
    case types.USER_ENTER_INSTANCE_REQUESTED:
    case types.USER_LEAVE_INSTANCE_REQUESTED:
      break
    case types.QUERY_INSTANCE_RECEIVED:
      nextState = fromJS(state).merge({
        status: 'joined',
        data  : action.payload
      })
      break
    default:
      actionIsInCurrentReducer = false
      break
  }
  if (Config.environment.isVerbose() && actionIsInCurrentReducer) {
    console.log('[Reducer  ] Instance ' + action.type)
  }
  return nextState || state
}

export default instance