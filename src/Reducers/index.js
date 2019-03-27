/* Populated by react-webpack-redux:reducer */
import {combineReducers} from 'redux';

import AuthReducer from './AuthReducers'
import AppStateReducers from './AppStateReducers'
import AppReducers from './AppReducers'
import AppPresence from './AppPresence'

import test from '../reducers/test.js';
import uuid from '../reducers/uuid.js';
import messages from '../reducers/messages';
import groups from '../reducers/groups';
import contacts from '../reducers/contacts';



export default combineReducers({
    auth: AuthReducer,
    appState: AppStateReducers,
    // app:AppReducers
    presence:AppPresence,

    test,
    uuid,
    messages,
    groups,
    contacts
})