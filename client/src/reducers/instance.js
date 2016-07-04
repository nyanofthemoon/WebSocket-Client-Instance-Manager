import * as _   from 'lodash';
import {fromJS} from 'immutable'

import Config     from './../config'
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
  state: 'unjoined',
  data: {
    id    : null,
    status: null,
    users : []
  }
})

const instance = (state = initialState, action) => {
  let actionIsInCurrentReducer = true
  let nextState
  switch (action.type) {
    case types.QUERY_INSTANCE_REQUESTED:
    case types.USER_JOIN_INSTANCE_REQUESTED:
    case types.USER_LEAVE_INSTANCE_REQUESTED:
      break
    case types.USER_JOIN_INSTANCE_RECEIVED:
      let dataAdd = fromJS(state).toJS().data
      if (_.findIndex(dataAdd.users, action.payload) == -1) {
        dataAdd.users.push(action.payload)
        nextState = fromJS(state).set('data', fromJS(dataAdd))
      }
      break
    case types.USER_LEAVE_INSTANCE_RECEIVED:
      let dataRem  = fromJS(state).toJS().data
      let userIndex = _.findIndex(dataRem.users, action.payload)
      if (userIndex > -1) {
        dataRem.users.splice(userIndex, 1)
        nextState = fromJS(state).set('data', fromJS(dataRem))
      }
      break
    case types.QUERY_INSTANCE_RECEIVED:
      nextState = fromJS(state).merge({
        state: 'joined',
        data : action.payload
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