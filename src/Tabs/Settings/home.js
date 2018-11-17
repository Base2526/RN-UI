// import React, { Component } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import Styles from '../../styles';

// class SettingsHome extends Component {

//     static navigationOptions = ({ navigation }) => ({
//         title: "Settings",
//         headerLeft: (
//             <TouchableOpacity
//                 style={Styles.headerButton}
//                 onPress={() => navigation.openDrawer()}>
//                 <Icon name="bars" size={25} />
//             </TouchableOpacity>
//         ),

//     })

//     render() {
//         return (
//             <View style={Styles.container}>
//                 <Text>Memory Settings</Text>
//                 <Icon name="memory" size={48} />

//             </View>
//         );
//     }
// }

// export default SettingsHome;

import React from 'react'
// import {View, Text} from 'react-native'

import {
    View,
    Text,
    TouchableOpacity,
    AppRegistry,
    Button,
    FlatList, 
    ActivityIndicator,
    Alert,
    AsyncStorage
} from 'react-native';
  
import Icon from 'react-native-vector-icons/FontAwesome5';
import ExpandableList from 'react-native-expandable-section-list';
import MockData from '../CONTACTS/mockData';
import DictStyle from '../CONTACTS/dictStyle';

import Styles from '../../styles';

import { List, ListItem, SearchBar } from "react-native-elements";

export default class SettingsHome extends React.Component{
    // static navigationOptions = ({ navigation }) => ({
    //     title: "Settings",
    //     headerLeft: (
    //         <TouchableOpacity
    //             style={DictStyle.headerButton}
    //             onPress={() => navigation.openDrawer()}>
    //             <Icon name="bars" size={25} />
    //         </TouchableOpacity>
    //     ),

    // })

    static navigationOptions = ({ navigation }) => ({
        title: "Settings",
        headerLeft: (
            <TouchableOpacity
                style={Styles.headerButton}
                onPress={() => navigation.openDrawer()}>
                <Icon name="bars" size={25} />
            </TouchableOpacity>
        ),
        // headerRight: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => alert("address-book click")}>
        //         <Icon name="address-book" size={20} />
        //     </TouchableOpacity>
        //   ),
    })

    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          data: [],
          page: 1,
          seed: 1,
          error: null,
          refreshing: false
        };
      }

      componentDidMount() {
        // this.makeRemoteRequest();
        this.setState({
          data: this._data(),
          error: null,
          loading: false,
          refreshing: false
        });
      }
  
      _data=()=>{
        return(
          [ {"name":"Hide"},
            {"name":"Block"},
            {"name":"Manage class"},
            {"name":"Manage group"},
            {"name":"Manage my application"},
            {"name":"Force Logout"},
            {"name":"Customize Tab Menus"},
            {"name":"Logout"},
          ]      
        )
      }

      makeRemoteRequest = () => {
        const { page, seed } = this.state;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
        this.setState({ loading: true });
    
        fetch(url)
          .then(res => res.json())
          .then(res => {
            this.setState({
              data: page === 1 ? res.results : [...this.state.data, ...res.results],
              error: res.error || null,
              loading: false,
              refreshing: false
            });
          })
          .catch(error => {
            this.setState({ error, loading: false });
          });
      };
    
      handleRefresh = () => {
        this.setState(
          {
            page: 1,
            seed: this.state.seed + 1,
            refreshing: true
          },
          () => {
            this.makeRemoteRequest();
          }
        );
      };
    
      handleLoadMore = () => {
        this.setState(
          {
            page: this.state.page + 1
          },
          () => {
            this.makeRemoteRequest();
          }
        );
      };
    
      renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
      };
    
      renderHeader = () => {
        return <SearchBar placeholder="Type Here..." lightTheme round />;
      };
    
      renderFooter = () => {
        if (!this.state.loading) return null;
    
        return (
          <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 1,
              borderColor: "#CED0CE"
            }}
          >
            <ActivityIndicator animating size="large" />
          </View>
        );
      };
    
      render() {
        return (
          <View style={{flex:1, backgroundColor:'white'}}>
          {/* <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}> */}
            <FlatList
              data={this.state.data}
              // renderItem={({ item }) => (
              //   <ListItem
              //     roundAvatar
              //     title={`${item.name.first} ${item.name.last}`}
              //     subtitle={item.email}
              //     avatar={{ uri: item.picture.thumbnail }}
              //     containerStyle={{ borderBottomWidth: 0 }}
              //     onPress={()=>console.log("item click")}
              //   />
              // )}
              renderItem={({item}) =>
                <TouchableOpacity
                  style={{backgroundColor:'white'}}
                  onPress={()=>{

                    Alert.alert(
                      'Logout',
                      'Are you sure you want to log out?',
                      [
                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        {text: 'Cancel', 
                        onPress: () => {console.log("cancel")}, 
                        style: 'cancel'},
                        {text: 'OK', 
                        onPress: () => {
                            AsyncStorage.removeItem("auth-demo-key", ()=>{
                              this.props.navigation.navigate("SignedOut")

                            //   // AsyncStorage.getItem("auth-demo-key")
                            //   // .then(res => {
                            //   //   console.log("3, res")
                            //   //   console.log(res)
                            //   //   console.log("4, res")
                                
                            //   // })
                            //   // .catch(err => alert("error"));
                            })
                            console.log(this.props)

                        }, },
                      ],
                      { cancelable: false }
                    )
                  }}>
                  <View style={{padding: 20}}>
                      <Text >{item.name}</Text>
                      {/* <Text >{item.email}</Text> */}
                  </View>
                </TouchableOpacity>
              }
              keyExtractor={item => item.email}
              ItemSeparatorComponent={this.renderSeparator}
              // ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
            //   onRefresh={this.handleRefresh}
            //   refreshing={this.state.refreshing}
              // onEndReached={this.handleLoadMore}
              // onEndReachedThreshold={50}
            />
          {/* </List> */}
          </View>
        );
      }
  }