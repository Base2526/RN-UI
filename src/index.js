import React from "react";
import {AppState} from "react-native";
        
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { AppNavigator } from "./App"; 
import Constant from './Utils/Constant'
import {loadAsyncStorage} from './Utils/Helpers'

import configureStore from './configureStore'
const { persistor, store } = configureStore()

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   checkedSignIn: false,
    //   signedIn: false,
    //   appState: AppState.currentState
    // };
  }

  componentDidMount() {

    // console.log("---> 009")

    // login("admin", "1234").then(data => {
    //   console.log('Print list of movies:', data);
    // })
    // console.log(logout())

    /*
    __test("mr.simajarn@gmail.com")
      .then((res) => {
          if(res.message === 'Not Found') {
            console.log("------------ y")
          }
        else {
          console.log("------------ x1")
          console.log(res)
          console.log("------------ x2")
          // this.props.navigator.push({
          //   title: res.name || 'No Title',
          //   passProps: {userInfo: res}
          // });
          // this.setState({
          //   error: false,
          //   username: ''
          // })
        }
    });
    */

    // console.log("componentDidMount")
    // AppState.addEventListener('change', this._handleAppStateChange);
    // AppState.addEventListener('memoryWarning', this._handleAppStateChange);

    // this.isSignedIn()

    // this.props.navigation.addListener('willFocus', () => {
    //   // // correctly gives params  
    //   // console.log(payload.state.params)
    
    //   // // undefined
    //   // console.log(this.props)

    //   this.log("===>");
    // })

    // console.log(this)

    // var observer = ReactObserver();
    // var listener = observer.subscribe('exampleEvent',(data)=>{
    //   console.log('data is: '+data);
    // });

    /*
    db.ref('/items').set({
      date_of_birth: "June 23, 1912",
      full_name: "Alan Turing",
      name: "Somkid Simajarn"
    });

    db.ref('/items').on("child_added", (snapshot, prevChildKey) => {
      var newPost = snapshot.val();
      // console.log("Author: " + newPost.author);
      // console.log("Title: " + newPost.title);
      // console.log("Previous Post ID: " + prevChildKey);

      console.log('1, child_added')
      console.log(newPost)
      console.log('2, child_added')
    });

    db.ref('/items').on("child_changed", (snapshot) => {
      var changedPost = snapshot.val();
      console.log('1, child_changed')
      console.log(changedPost);
      console.log('2, child_changed')
    });

    db.ref('/items/kid').on("child_removed", function(snapshot) {
      var deletedPost = snapshot.val();
      // console.log("The blog post titled '" + deletedPost.title + "' has been deleted");

      console.log('1, child_changed')
      console.log(deletedPost);
      console.log('2, child_changed')
    });

    // ref.off("value");
    db.ref('/items').off()
    */

  //  firebase.database().ref('/items').off()
  }

  componentWillReceiveProps(){
    console.log("componentWillReceiveProps")
  }

  componentWillUnmount(){
    console.log("componentWillUnmount")

    // AppState.removeEventListener('change', this._handleAppStateChange);
    // AppState.removeEventListener('memoryWarning', this._handleAppStateChange);
  }

  /*
  _firebase(){
    // console.log(DeviceInfo)
    console.log(DeviceInfo.getUniqueID())
    console.log(DeviceInfo.getVersion())
    console.log(DeviceInfo.getBuildNumber())  

    if (typeof DeviceInfo.getUniqueID() === 'undefined') {
      // color is undefined
      console.log("getUniqueID is undefined")
    }else{
      console.log("getUniqueID is defined")
    }

    
    firebase.database().ref('/items').on("value", (snapshot, prevChildKey) => {
      var newPost = snapshot.val();
      // console.log("Author: " + newPost.author);
      // console.log("Title: " + newPost.title);
      // console.log("Previous Post ID: " + prevChildKey);

      console.log('001, value')
      console.log(newPost)
      console.log('002, value')
    });

    firebase.database().ref('/items').on("child_changed", (snapshot) => {
      var changedPost = snapshot.val();
      // console.log('1, child_changed')
      // console.log(changedPost);
      // console.log('2, child_changed')
    });

    firebase.database().ref('/items').on("child_added", (snapshot, prevChildKey) => {
      var newPost = snapshot.val();
      // console.log("Author: " + newPost.author);
      // console.log("Title: " + newPost.title);
      // console.log("Previous Post ID: " + prevChildKey);

      // console.log('1, child_added')
      // console.log(newPost)
      // console.log('2, child_added')
    });
  
  }
  */

  /*
  _handleAppStateChange = (nextAppState) => {
    // if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    //   console.log('App has come to the foreground!')
    // }
    
    if (nextAppState === 'active') {
      // active application
      console.log("nextAppState : active")
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // inactive application
      console.log("nextAppState : inactive")
    }

    // console.log("nextAppState : " + nextAppState)
    this.setState({appState: nextAppState});
  }

  isSignedIn(){
    loadAsyncStorage(Constant.USER_LOGIN).then((data) => {      
      if(data.status){
        let value = JSON.parse(data.value)
        this.setState({
          checkedSignIn: true,
          signedIn: true
        })
      }else{
        this.setState({
          checkedSignIn: true,
          signedIn: false
        })
      }
    }).catch((error)=>{
      this.setState({
        checkedSignIn: true,
        signedIn: false
      })
    })
  };
  */

  componentDidUpdate(){
    // console.log("------> componentDidUpdate")
  }

  render() {
    // const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    // if (!checkedSignIn) {
    //   return null;
    // }

    // console.log("------- render --------")
    // if(!signedIn){
    //   console.log("off firebase")
    //   // firebase.database().ref('/items').off()
    // }else{
    //   console.log("on firebase")
    //   this._firebase()
    // }

    // console.log(this.props)

    // console.log('---1')

    // const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

    /*
    const persistConfig = {
      key: 'root',
      storage,
    }
    
    // const reducer = persistCombineReducers(config, reducers)

    // const createRehydrateRootReducer = reducer => (state, action) => {
    //   if (action.type === REHYDRATE) {
    //     return { ...state, ...action.payload, rehidrate: true };
    //   }
    //   return reducer(state, action);
    // };

    const persistedReducer = persistReducer(persistConfig, reducers)

    const store = createStore(persistedReducer, {}, compose(
      applyAppStateListener(),
      applyMiddleware(ReduxThunk),
      // autoRehydrate()
    ))


    // let persistor = persistStore(store)
    const middleware = [];

    const enhancers = [applyMiddleware(...middleware)];

    const _persistConfig = { enhancers };
    let persistor = persistStore(store, _persistConfig, () => {
      console.log(store.getState());
    });

    // persistStore(store, {}, () => {
    //   this.setState({ rehydrated: true })
    // })
        
    // persistStore(
    //   store,
    //   {
    //     storage: AsyncStorage,
    //     // transforms: [
    //     //   saveSubsetBlacklistFilter,
    //     // ]
    //   },
    //   () => {
    //     this.setState({
    //       isReady: true
    //     })
    //   }
    // ) //purge here
    */
    // console.log('#1')
    // console.log(store)
    // console.log('#2')
    // return(<View><Text>isSignedIn</Text></View>)
    // const Layout = createRootNavigator(signedIn);
    return (<Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AppNavigator />
              </PersistGate>
            </Provider>);
  }
}
