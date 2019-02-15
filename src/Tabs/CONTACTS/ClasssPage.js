import React from 'react'
import {View, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Alert} from 'react-native'

import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

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
        refreshing: false,

        rowID: null,
      };
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
      console.log(nextProps)
      let data = []
      for (var key in nextProps.classs) {
        let classs =  nextProps.classs[key]
        data.push({...{class_id:key}, ...classs});
      }
      this.setState({data,});
    }

    renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#CED0CE",
            // marginLeft: "14%"
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

    isDefault = (item) =>{
      // {item.is_default ? '(default '+ item.is_favorites +')': ''}

      if(item.is_default){
        if(item.is_favorites){
          return(' (default, favorite)')
        }else{
          return(' (default)')
        }
      }else{
        if(item.is_favorites){
          return(' (favorite)')
        }else{
          return('')
        }
      }
    }

    renderItem = ({ item, index }) => {
      var swipeoutBtns = []
      if(!item.is_default){
        swipeoutBtns =  [{  component:<View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{fontWeight:'bold', color:'white', fontSize:16}}>DELETE</Text>
                                      </View>,
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
                                      console.log(item)
                                      if(item.class_id !== undefined){
                                        this.setState({loading:true})
                                        this.props.actionDeleteClass(this.props.uid, item.class_id, (result) => {
                                            console.log(result)
                                            this.setState({loading:false})
                                        })
                                      }
                                    }, 
                                  },
                                ],
                                { cancelable: false })
                            }
                          }
                        ]
      }
      
      return (<Swipeout 
                style={{backgroundColor:'white'}} 
                right={swipeoutBtns}
                rowID={index}
                sectionID={0}
                onOpen={(sectionId, rowId) => {
                  this.setState({
                    rowID: rowId,
                  })
                }}
                close={!(this.state.rowID === index)}>
          <TouchableOpacity key={ item.name } onPress={() => {
            this.props.params.navigation.navigate("ManageClasssPage", {'data': item, 'class_id':item.class_id})
          }}>
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                flexDirection: 'row'
              }}>
                <TouchableOpacity 
                    style={{height:80,
                            width: 80,
                            borderRadius: 40,
                            borderColor:'#DF2D6C',
                            borderWidth:3,
                            justifyContent:'center',
                            alignItems:'center'
                            }}
                    onPress={()=>{
                      this.props.params.navigation.navigate("ManageClasssPage", {'data': item, 'class_id':item.class_id})
                    }}>
                  <FastImage
                    style={{width: 64, 
                            height: 64, 
                            borderRadius: 32}}
                    source={{
                      uri: item.image_url,
                      headers:{ Authorization: 'someAuthToken' },
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}/>
                </TouchableOpacity>
                <View style={{paddingLeft: 10}}>
                  <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize: 18, 
                                    fontWeight: '600', 
                                    // color: DictStyle.colorSet.normalFontColor,
                                    paddingBottom:5
                                  }}>
                          {item.name} 
                      </Text>
                      <Text style={{fontSize:12, color:'gray', fontStyle:'italic'}}>
                        {this.isDefault(item)}
                      </Text>
                  </View>
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

      console.log(this.state.data)
      return (
        <View style={{flex:1}}>
        <Spinner
          visible={this.state.loading}
          textContent={'Wait...'}
          textStyle={{color: '#FFF'}}
          overlayColor={'rgba(0,0,0,0.5)'}
        />
        {
            renderContent && 
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor = { (item, index) => index.toString() } 
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
    uid:getUid(state),
    classs:state.auth.users.classs
  }
}

export default connect(mapStateToProps, actions)(ClasssPage);