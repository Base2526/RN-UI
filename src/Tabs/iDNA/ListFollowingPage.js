import React from 'react'
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableHighlight} from 'react-native'

import { List, ListItem, SearchBar } from "react-native-elements";
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'

// import DictStyle from '../CONTACTS/dictStyle';

import ImageWithDefault from '../../Utils/ImageWithDefault'


import * as actions from '../../Actions'

class ListFollowingPage extends React.Component{
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
      
      this.setState({
        error: null,
        loading: false,
        refreshing: false
      });

      let {followings} = this.props.auth.users

      let newValue = []
      Object.entries(followings).forEach(([key, value]) => {
        newValue.push({key, item_id: key, ...value})
      })

      this.setState({data:newValue})
    }
  
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

    renderItem =({ item, index }) => {
      var swipeoutBtns = [
        {
          text: 'Unfollowed',
          backgroundColor: 'gray',
          onPress: () => {
            alert('Unpublished')
          }
        }
      ]

      return(
        <Swipeout 
            key={item.item_id}
            style={{backgroundColor:'white'}} 
            right={swipeoutBtns}>
            <TouchableOpacity  onPress={() => {
                this.props.params.navigation.navigate("ApplicationDetailPage")
              }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    flexDirection: 'row'
                  }}>
                    <TouchableHighlight>
                        <FastImage
                            style={{width: 80, height: 80, borderRadius: 40}}
                            source={{
                            uri: 'item.image_url',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableHighlight>
                    <Text style={{paddingLeft: 10}}>
                        'item.name}
                    </Text>
                </View>
              </TouchableOpacity>
            </Swipeout>)
    }
    
    render() {

      let {renderContent, data} = this.state;
      return (
        <View style={{flex:1}}>
        {
          renderContent &&
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={item => item.item_id}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={50}
            extraData={this.state}/>
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

  return{
    auth:state.auth
  }
}

export default connect(mapStateToProps, actions)(ListFollowingPage);