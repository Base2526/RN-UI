import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity} from 'react-native'

import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import * as actions from '../../Actions'

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

        sectionID: null,
        rowID: null,
      };
    }
  
    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.setState({
        data: this.loadData(),
        error: null,
        loading: false,
        refreshing: false
      });      
    }

    loadData=()=>{
      let group_member = []
      for (var key in this.props.groups) {
        let group =  this.props.groups[key]
        group_member.push({...group, group_id:key});
      }
      return group_member
    }

    componentWillReceiveProps(nextProps) {      
      let group_member = []
      for (var key in nextProps.groups) {    
        let group = nextProps.groups[key]

        group_member.push({...group, group_id:key});
      }

      this.setState({
        data: group_member,
      });
    }
    
    renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#CED0CE",
          }}
        />
      );
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
      // console.log(index)
      let swipeoutRight = [{
                            component:<View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:16, textAlign:'center'}}>LEAVE GROUP</Text>
                                      </View>,
                            backgroundColor: 'red',
                            onPress: () => { 
                              Alert.alert(
                                '',
                                'If you leave this group, you\'ll no longer be able to see its member list or chat history Continue?',
                                [
                                //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                                ],
                                { cancelable: false }
                              )
                            }
                          }]

      // console.log(this.state.rowID)
      return(
        <Swipeout 
          style={{backgroundColor:'white'}} 
          right={swipeoutRight}
          rowID={index}
          sectionID={0}
          onOpen={(sectionId, rowId) => {
            this.setState({
              sectionID: sectionId,
              rowID: rowId,
            })
          }}
          close={!(this.state.rowID === index)}
          >
          <TouchableOpacity 
            key={item.item_id} 
            onPress={() => {
              this.props.params.navigation.navigate("ManageGroupPage", {'group_id': item.group_id}) 
            }}>
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                flexDirection: 'row'
              }}>
                <TouchableOpacity
                  style={{width: 80, height: 80, borderRadius: 40}}
                  onPress={() => {
                    this.props.params.navigation.navigate("ManageGroupPage", {'group_id': item.group_id}) 
                  }}>
                  <FastImage
                      style={{width: 80, height: 80, borderRadius: 40, borderWidth:.5, borderColor:'gray'}}
                      source={{
                        uri: item.group_profile.image_url,
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
                <View style={{paddingLeft: 10}}>
                  <Text style={{fontSize: 18, 
                                fontWeight: '600', 
                                paddingBottom:5
                              }}>
                      {item.group_profile.name} ({ Object.keys(item.group_profile.members).length })
                  </Text>
                </View>
            </View>
          </TouchableOpacity>
      </Swipeout>)
    }
  
    render() {
      let {renderContent} = this.state;

      if(!this.props.hasOwnProperty('groups')){
        return <View style={{flex: 1}}></View>
      }

      return (
        <View style={{flex:1}}>
        {
          renderContent && 
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={item => item.item_id}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={50}
            extraData={this.state}
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
    groups:state.auth.users.groups
  }
}

export default connect(mapStateToProps, actions)(GroupsPage);