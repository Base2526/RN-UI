import React from 'react'
import {View, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Alert} from 'react-native'
import FastImage from 'react-native-fast-image'
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
import {getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeClasssState,
        makeClassMembersState} from '../../Reselect'

class ClasssPage extends React.Component{
    constructor(props) {
      super(props);
  
      this.state = {
        renderContent: false,
        loading: false,
        data: [],
      };
    }

    componentDidMount() {
      this.loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {
      // console.log(nextProps)
      
      this.loadData(nextProps)
    }

    loadData = (props) =>{
      let {classs, class_members} = props
      let data  = _.map(classs, (cv, ck)=>{
                      let members = _.find(class_members, (v, k)=>{
                                      return k == ck
                                    })

                      return {...cv, class_id:ck, members}
                  })

      this.setState({data, renderContent: true});
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

      let {class_id} = item

      let memu_delete_class = <View />
      if(!item.is_default){
        memu_delete_class = <MenuOption onSelect={() => {
                                Alert.alert(
                                  'Delete class',
                                  'Are you sure class '+item.name+'?',
                                  [
                                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                    {text: 'Cancel', 
                                      onPress: () => {
                                          console.log("cancel")
                                          }, style: 'cancel'},
                                    {text: 'OK', 
                                      onPress: () => {
                                        this.setState({loading:true})
                                        this.props.actionDeleteClass(this.props.uid, class_id, (result) => {
                                            console.log(result)
                                            this.setState({loading:false})
                                        })
                                      }, 
                                    },
                                  ],
                                  { cancelable: false }
                                )
                            }}>
                                <Text style={{padding:10, fontSize:18}}>Delete</Text>
                            </MenuOption>
      }
      
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
                        this.props.params.navigation.navigate("ListClassMemberPage", {'class_id': class_id})
                      }}>
                          <Text style={{padding:10, fontSize:18}}>List members</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                          this.props.params.navigation.navigate('ClasssSettingsPage', {'class_id': class_id})
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Settings</Text>
                      </MenuOption>
                      {memu_delete_class}
                  </MenuOptions>
              </Menu>
            </View>)
    }

    countMembers = (item) =>{
      let m_count = _.filter(item.members, (v, k)=>{
                      return v.status
                    })      
      return m_count.length
    }

    isDefault = (item) =>{
      if(item.is_default){
        return(' (default)')
      }else{
        return('')
      }
    }

    renderItem = ({ item, index }) => {
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
                            }}>
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
                        {item.is_default? '(default)' :''}
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
      if(!renderContent){
        return <View style={{flex: 1}}></View>
      }

      return (
        <MenuContext>
          <View style={{flex:1}}>
            <Spinner
              visible={this.state.loading}
              textContent={'Wait...'}
              textStyle={{color: '#FFF'}}
              overlayColor={'rgba(0,0,0,0.5)'}
            />
            <FlatList
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor = { (item, index) => index.toString() } 
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={50}
                extraData={this.state}
              />
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

const mapStateToProps = (state, ownProps) => {
  // console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  if(!state.auth.isLogin){
    return;
  }

  return{
    uid:makeUidState(state, ownProps),
    classs:makeClasssState(state, ownProps),
    class_members:makeClassMembersState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(ClasssPage);