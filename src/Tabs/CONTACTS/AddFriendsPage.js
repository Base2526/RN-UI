import React from 'react'

import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';
import { List, ListItem, SearchBar } from "react-native-elements";
import FastImage from 'react-native-fast-image'
import DictStyle from '../CONTACTS/dictStyle';

export default class AddFriendsPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Add Friends",
  
        
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),
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
          renderContent: false,
          loading: false,
          data: [],
          page: 1,
          seed: 1,
          error: null,
          refreshing: false
        };

    }

    componentDidMount() {

      setTimeout(() => {this.setState({renderContent: true})}, 0);

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
            [{"name":'A1'}, {"name":'A2'}, {"name":'A3'}, {"name":'A4'}, {"name":'A5'}]
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
      // return <SearchBar placeholder="Type Here..." lightTheme round />;
      return(
        <View style={{flexDirection:'row', justifyContent:'center'}}>
            <TouchableOpacity 
                      style={{height:40,
                              width: 40,
                              borderRadius: 10,
                              margin:10}}
                        onPress={()=>{
                          this.props.navigation.navigate("InviteFriendForContactPage")
                        }}>
                      <FastImage
                          style={{width: 40, height: 40, borderRadius: 10}}
                          source={{
                          uri: 'https://cdn0.iconfinder.com/data/icons/thin-communication-messaging/57/thin-328_phone_book_number_contact-512.png',
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      />
            </TouchableOpacity>
            <TouchableOpacity 
                      style={{height:40,
                              width: 40,
                              borderRadius: 10,
                              margin:10}}
                        onPress={()=>{
            
                          this.props.navigation.navigate("QRCodeReaderPage")
                        }}>
                        <Icon name="qrcode" size={40} />
            </TouchableOpacity>
            <TouchableOpacity 
                      style={{height:40,
                              width: 40,
                              borderRadius: 10,
                              margin:10}}
                        onPress={()=>{
                          this.props.navigation.navigate("AddFriendByIdPage")
                        }}>
                        <Icon name="search" size={40} />
                      {/* <FastImage
                          style={{width: 40, height: 40, borderRadius: 10}}
                          source={{
                          uri: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/user-id-icon.png',
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      /> */}
            </TouchableOpacity>
            {/* <TouchableOpacity 
                      style={{height:40,
                              width: 40,
                              borderRadius: 10,
                              margin:10}}
                    onPress={()=>alert("4")}>
                      <FastImage
                          style={{width: 40, height: 40, borderRadius: 10}}
                          source={{
                          uri: 'https://unsplash.it/400/400?image=1',
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      />
            </TouchableOpacity> */}
        </View>)
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

    renderItem = ({item, index}) => {
        // return here
        // console.log("renderItem : " + index)
        
        switch(index){
            case 0:{
                return(<View><Text>People you may know.</Text></View>)
            }
            break
            default:{
                return(
                      <View
                        style={{
                          alignItems: 'center', 
                          padding: 10,
                          borderColor: DictStyle.colorSet.lineColor,
                          flexDirection: 'row',
                          backgroundColor: 'white'
                        }}
                      >
                        <View style={{flex:1, alignItems:'center'}}>
                          <TouchableOpacity 
                              style={{
                                      height: 40,
                                      width: 40,
                                      borderRadius: 10,
                                      alignItems:'center'}}
                              onPress={
                                ()=>this.props.navigation.navigate("FriendProfilePage")
                              }>
                              <FastImage
                                  style={{width: 40, height: 40, borderRadius: 10}}
                                  source={{
                                  uri: 'https://unsplash.it/400/400?image=1',
                                  headers:{ Authorization: 'someAuthToken' },
                                  priority: FastImage.priority.normal,
                                  }}
                                  resizeMode={FastImage.resizeMode.contain}
                              />
                          </TouchableOpacity>
                        </View>
                        <View style={{flex:3}}>
                          <Text style={{
                                      fontSize: 18, 
                                      color: DictStyle.colorSet.normalFontColor,
                                      paddingLeft: 5}}>
                              {item.name}
                          </Text>
                        </View>
                        <View style={{flex:2}}>
                          <TouchableOpacity
                              style={{
                                  borderRadius:3,
                                  top:3,
                                  right:0,
                                  borderWidth:1,
                                  borderColor:'red',
                                  alignItems:'center',
                                  padding:10}}
                                onPress={
                                  ()=>this.props.navigation.goBack()
                                }>
                              <Text style={{color:'green', fontSize:14}}>Add Friend</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                )
            }
        }

        
    }
    
    render() {

        // let swipeBtns = [{
        //   text: 'Delete',
        //   backgroundColor: 'red',
        //   underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        //   onPress: () => { this.deleteNote(rowData) }
        // }];
        let {
          renderContent
        } = this.state;
    
        return (
          <View style={{flex:1, backgroundColor: 'white'}}>
          {
          renderContent && 
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

              
              renderItem={this.renderItem.bind(this)}
              keyExtractor={item => item.name}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              // onRefresh={this.handleRefresh}
              // refreshing={this.state.refreshing}
              // onEndReached={this.handleLoadMore}
              onEndReachedThreshold={50}
            />
          }
          </View>
        );
      }
}