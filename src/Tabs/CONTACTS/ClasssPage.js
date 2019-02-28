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

import {
  MenuProvider,
  Menu,
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import ActionButton from 'react-native-action-button';

import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

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

      this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {
      // console.log(nextProps)
      
      this.loadData(nextProps)
    }

    loadData = (props) =>{
      let data = []
      for (var key in props.classs) {
        let classs =  props.classs[key]
        data.push({...{class_id:key}, ...classs});
      }
      this.setState({data});
    }
  
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
    }
    
    showMenuClasss = (item)=>{
      return( <View style={{flex:1,
                            position:'absolute', 
                            top:0,
                            right:0, 
                            marginRight:10,}}>
                <Menu>
                  <MenuTrigger>
                      <MyIcon 
                          style={{padding:10}}
                          name={'dot-horizontal'}
                          size={15}
                          color={'gray'} />  
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                      <MenuOption onSelect={() => {
                        this.props.params.navigation.navigate("ListClassMemberPage", {'class_id': item.class_id})
                      }}>
                          <Text style={{padding:10, fontSize:18}}>List members</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                          this.props.params.navigation.navigate('ClasssSettingsPage', {'class_id': item.class_id})
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Settings</Text>
                      </MenuOption>
                  </MenuOptions>
              </Menu>
            </View>)
    }

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
        // if(item.is_favorites){
        //   return(' (default, favorite)')
        // }else{
          return(' (default)')
        // }
      }else{
        // if(item.is_favorites){
        //   return(' (favorite)')
        // }else{
        //   return('')
        // }

        return('')
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
      
      return (<View
              style={{
                alignItems: 'center', 
                padding: 10,
                flexDirection: 'row'
              }}>
                <TouchableOpacity 
                    style={{height: 50,
                            width: 50,
                            borderRadius: 25,
                            borderColor:'#DF2D6C',
                            borderWidth:3,
                            justifyContent:'center',
                            alignItems:'center'
                            }}
                    // onPress={()=>{
                    //   this.props.params.navigation.navigate("ManageClasssPage", {'data': item, 'class_id':item.class_id})
                    // }}
                    >
                  <FastImage
                    style={{width: 40, 
                            height: 40, 
                            borderRadius: 20}}
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
                {this.showMenuClasss(item)}
            </View>)
    }

    FlatListItemSeparator = () => {
      return (
        <View
          style={{
            height: .5,
            width: "86%",
            backgroundColor: "#CED0CE",
            marginLeft: "14%"
          }}
        />
      );
    };
  
    render() {
      let { renderContent } = this.state;

      if(!this.props.hasOwnProperty('classs')){
        return <View style={{flex: 1}}></View>
      }

      console.log(this.state.data)
      return (
        <MenuContext>
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
            ItemSeparatorComponent = {this.FlatListItemSeparator}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={50}
            extraData={this.state}
          />
        }
        <ActionButton 
          buttonColor="rgba(231,76,60,1)"
          offsetX={10} 
          offsetY={10}
          hideShadow={true}
          renderIcon={() => {
              return(<MyIcon
                  name={'plus'}
                  size={25}
                  color={'#C7D8DD'} />)
              }}
          onPress={()=>{
              this.props.params.navigation.navigate("AddClasssPage")
          }} />
        </View>
        </MenuContext>
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

  if(!state.auth.isLogin){
    return;
  }

  return{
    uid:getUid(state),
    classs:state.auth.users.classs
  }
}

export default connect(mapStateToProps, actions)(ClasssPage);