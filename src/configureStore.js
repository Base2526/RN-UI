import { createStore, compose, applyMiddleware} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import ReduxThunk from 'redux-thunk'
import reducers from './Reducers'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export default () => {
//   let store = createStore(persistedReducer)

  const store = createStore(persistedReducer, {}, compose(
    applyMiddleware(ReduxThunk),
    // applyAppStateListener(),
    // autoRehydrate()
  ))
  let persistor = persistStore(store)
  return { store, persistor }
}