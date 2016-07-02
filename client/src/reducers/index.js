import {combineReducers} from 'redux'

import manager  from './manager'
import instance from './instance'
import user     from './user'

const rootReducer = combineReducers({
  manager,
  instance,
  user
})

export default rootReducer