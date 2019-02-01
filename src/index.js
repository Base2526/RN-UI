import React from "react";
        
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'

import { AppNavigator } from "./App"; 
import configureStore from './configureStore'
const { persistor, store } = configureStore()

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(){
  }

  componentWillUnmount(){
  }

  componentDidUpdate(){
   
  }

  render() {
    return (<Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AppNavigator />
              </PersistGate>
            </Provider>);
  }
}
