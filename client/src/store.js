import {createStore, applyMiddleware} from 'redux'
import rootReducer from './reducers'

function configureStore() {
  const store = createStore(rootReducer)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

export default configureStore()