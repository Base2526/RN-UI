import React from 'react'
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableHighlight} from 'react-native'

import { List, ListItem, SearchBar } from "react-native-elements";
import { connect } from 'react-redux';

// import FastImage from 'react-native-fast-image'

import DictStyle from './dictStyle';

import * as actions from '../../Actions'

import Constant from '../../Utils/Constant'
import ImageWithDefault from '../../Utils/ImageWithDefault'

class GroupsPage extends React.Component{
    constructor(props) {
      super(props);
  
      this.state = {
        renderContent: false,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
      };

      // console.log("--GroupsPage")
    }
  
    componentDidMount() {
      // this.makeRemoteRequest();
      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.setState({
        data: this.loadData(),
        error: null,
        loading: false,
        refreshing: false
      });      
    }

    loadData=()=>{

      console.log(this.props.groups)

      let group_member = []
      for (var key in this.props.groups) {
    
        let group =  this.props.groups[key]
        // let friend_profile = friend_profiles[key]

        group_member.push({...group, group_id:key});
        /*
        switch(group.status){
          case Constant.FRIEND_STATUS_FRIEND:{
            // console.log('1, --' + key)
          
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_CANCEL:{
            // console.log('2, --' + key)
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_REQUEST:{
            // console.log('3, --' + key)
            break
          }

          case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
            // console.log('4, --' + key)
            break
          }
        }
        */
      }

      console.log(group_member)
      return group_member
    }

    
    componentWillReceiveProps(nextProps) {
      console.log(nextProps)
      
      let group_member = []
      for (var key in nextProps.groups) {    
        let group = nextProps.groups[key]

        group_member.push({...group, group_id:key});
      }

      this.setState({
        data: group_member,
      });
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

      let {
        renderContent
      } = this.state;

      console.log(this.props)
      if(!this.props.hasOwnProperty('groups')){
        return <View style={{flex: 1}}></View>
      }

      return (
        <View style={{flex:1}}>
        {/* <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}> */}

        {
            renderContent && 
          <FlatList
            data={this.state.data}
            renderItem={({item, key}) =>{

            return(
            <TouchableOpacity key={item.item_id} onPress={() => this.props.params.navigation.navigate("ManageGroupPage", {'group_id': item.group_id}) }>
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
                  <TouchableHighlight 
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}>
                      <ImageWithDefault 
                        source={{uri: item.group_profile.image_url}}
                        style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                      />
                  </TouchableHighlight>
                  <View style={{paddingLeft: 10}}>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600', 
                                  color: DictStyle.colorSet.normalFontColor,
                                  paddingBottom:5
                                }}>
                        {item.group_profile.name} ({ Object.keys(item.group_profile.members).length })
                    </Text>
                    
                  </View>
              </View>
            </TouchableOpacity>)
            }
            }
            keyExtractor={item => item.item_id}
            ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            // onRefresh={this.handleRefresh}
            // refreshing={this.state.refreshing}
            // onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />  
        }
        {/* </List> */}
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
    groups:state.auth.users.groups
  }

}

export default connect(mapStateToProps, actions)(GroupsPage);