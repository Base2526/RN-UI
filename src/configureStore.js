import { createStore, compose, applyMiddleware} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

// import { offline } from '@redux-offline/redux-offline';
// import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

import { composeWithDevTools } from 'redux-devtools-extension';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults/index';

import ReduxThunk from 'redux-thunk'
import reducers from './Reducers'

const persistConfig = {
  key: 'root',
  storage,
}

const {
  middleware: offlineMiddleware,
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore
} = createOffline({
  ...offlineConfig,
  persist: false
});

// const persistedReducer = persistReducer(persistConfig, reducers)

const persistedReducer = persistReducer(persistConfig, offlineEnhanceReducer(reducers))


export default () => {
  //   let store = createStore(persistedReducer)

  /*
  
  const store = createStore(
    persistedReducer,
    composeWithDevTools(
      offlineEnhanceStore,
      applyMiddleware(thunk, offlineMiddleware)
    )
  );
  */

  // const store = createStore(persistedReducer, {}, compose(
  //   applyMiddleware(ReduxThunk),
  //   // applyAppStateListener(),
  //   // autoRehydrate()
  //   // offline(offlineConfig)
  // ))

  const store = createStore(persistedReducer, {}, composeWithDevTools(
    offlineEnhanceStore,
    applyMiddleware(ReduxThunk, offlineMiddleware)
  ))

  let persistor = persistStore(store)
  return { store, persistor }
}