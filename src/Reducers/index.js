import {combineReducers} from 'redux'
import AuthReducer from './AuthReducers'
import AppStateReducers from './AppStateReducers'

import AppReducers from './AppReducers'

export default combineReducers({
    auth: AuthReducer,
    // appState: AppStateReducers,
    // app:AppReducers
})