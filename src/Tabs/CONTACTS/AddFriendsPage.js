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

    renderItem = ({item, index}) => {
        // return here
        console.log("renderItem : " + index)
        
        switch(index){
            case 0:{
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
                                  uri: 'https://unsplash.it/400/400?image=1',
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
                              <FastImage
                                  style={{width: 40, height: 40, borderRadius: 10}}
                                  source={{
                                  uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png',
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
                                  this.props.navigation.navigate("AddFriendByIdPage")
                                }}>
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
                    <TouchableOpacity 
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
                    </TouchableOpacity>
                </View>)
            }
            break
            case 1:{
                return(<View><Text>People you may know.</Text></View>)
            }
            break
            default:{
                return(
                    <TouchableOpacity key={ item.name } onPress={() => {
                    }}>
                      <View
                        style={{
                          alignItems: 'center', 
                          // margin: 5, 
                          padding: 10,
                          // borderWidth: 0.5, 
                          borderColor: DictStyle.colorSet.lineColor,
                          flexDirection: 'row',
                          backgroundColor: 'white'
                        }}
                      >
                            <TouchableHighlight 
                                style={{height:60,
                                        width: 60,
                                        borderRadius: 10}}>
                                <FastImage
                                    style={{width: 60, height: 60, borderRadius: 10}}
                                    source={{
                                    uri: 'https://unsplash.it/400/400?image=1',
                                    headers:{ Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </TouchableHighlight>
                            <Text style={{fontSize: DictStyle.fontSet.mSize, 
                                        color: DictStyle.colorSet.normalFontColor,
                                        paddingLeft: 10}}>
                                {item.name}
                            </Text>
                            <TouchableHighlight
                                style={{
                                    position:'absolute',
                                    borderRadius:3,
                                    top:3,
                                    right:0,
                                    padding:2,
                                    borderWidth:1,
                                    borderColor:'red',
                                    padding:10}}    
                                underlayColor='#fff'>
                                <Text style={{color:'green', fontSize:16}}>Add Friend</Text>
                            </TouchableHighlight>
                      </View>
                    </TouchableOpacity>
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
              // ListHeaderComponent={this.renderHeader}
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