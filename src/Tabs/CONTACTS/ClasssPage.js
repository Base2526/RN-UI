import React from 'react'
import {View, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Alert} from 'react-native'

import { List, ListItem, SearchBar } from "react-native-elements";

// import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';
var _ = require('lodash');

import DictStyle from './dictStyle';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'

import ImageWithDefault from '../../Utils/ImageWithDefault'

class ClasssPage extends React.Component{
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

      // console.log("--ClasssPage")
    }

    componentDidMount() {

      setTimeout(() => {this.setState({renderContent: true})}, 0);

      let data = []
      for (var key in this.props.classs) {
        let classs =  this.props.classs[key]
        data.push({...{class_id:key}, ...classs});
      }

      this.setState({data,});
    }

    componentWillReceiveProps(nextProps) {

      // console.log(nextProps)

      let data = []
      for (var key in nextProps.classs) {
        let classs =  nextProps.classs[key]
        data.push({...{class_id:key}, ...classs});
      }

      this.setState({data,});
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

    countMembers = (item) =>{
      let count = 0
      if(item.members !== undefined){
        _.each(item.members, function(_v, _k) { 
            if(_v.status){
              count++
            } 
        })
      }

      return count
    }

    renderItem = ({ item, index }) => {

      console.log(item)
      var swipeoutBtns = [
        {
          text: 'Delete',
          backgroundColor: 'red',
          onPress: () => {
            Alert.alert(
              'Delete Classs',
              'Are you sure you want to delete?',
              [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', 
                onPress: () => {console.log("cancel")}, 
                style: 'cancel'},
                {text: 'OK', 
                onPress: () => {
                      
                    }, 
                },
              ],
              { cancelable: false })

          }
        }
      ]
      
      return (<Swipeout 
        style={{backgroundColor:'white'}} 
        right={swipeoutBtns}>
          <TouchableOpacity key={ item.name } onPress={() => {
            this.props.params.navigation.navigate("ManageClasssPage", {'data': item})
          }}>
            <View
              style={{
                alignItems: 'center', 
                // margin: 5, 
                padding: 10,
                // borderWidth: 0.5, 
                borderColor: DictStyle.colorSet.lineColor,
                flexDirection: 'row'
              }}
            >
                <TouchableOpacity 
                    style={{height:60,
                            width: 60,
                            borderRadius: 10}}>
                    
                    {/* <FastImage
                        style={{width: 60, height: 60, borderRadius: 10}}
                        source={{
                          uri: item.image_url === '' ? Constant.DEFAULT_AVATARSOURCE_URI : Constant.API_URL + item.image_url,
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    /> */}

                  <ImageWithDefault 
                    source={{uri: item.image_url}}
                    style={{width: 60, height: 60, borderRadius: 10}}
                  />
                </TouchableOpacity>
                <View style={{paddingLeft: 10}}>
                <Text style={{fontSize: 18, 
                                fontWeight: '600', 
                                color: DictStyle.colorSet.normalFontColor,
                                paddingBottom:5
                              }}>
                      {item.name}
                  </Text>
                  <Text>
                    {this.countMembers(item)} Users
                  </Text>
                </View>
            </View>
          </TouchableOpacity>
        </Swipeout>
        )
    }
  
    render() {
      let { renderContent } = this.state;

      if(!this.props.hasOwnProperty('classs')){
        return <View style={{flex: 1}}></View>
      }

      return (
        <View style={{flex:1}}>
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
            renderItem={this.renderItem}
            
            // keyExtractor={item => item.email}
            keyExtractor = { (item, index) => index.toString() } 
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

const mapStateToProps = (state) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }
  // groups
  return{
    // auth:state.auth
    classs:state.auth.users.classs
  }
}

export default connect(mapStateToProps, actions)(ClasssPage);