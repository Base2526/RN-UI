import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  NativeModules,
} from 'react-native';

import ExpandableList from 'react-native-expandable-section-flatlist'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');
import FastImage from 'react-native-fast-image'
import ActionButton from 'react-native-action-button';

import MyIcon from '../../config/icon-font.js';
import * as actions from '../../actions'
import {makeUidState} from '../../reselect'

class home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "",
    headerTintColor: '#C7D8DD',
    headerStyle: {
      backgroundColor: 'rgba(186, 53, 100, 1.0)',
      // ios navigationoptions underline hide
      borderBottomWidth: 0,

      // android navigationoptions underline hide
      elevation: 0,
      shadowOpacity: 0
    },
    headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}>
          <MyIcon
              name={'menu'}
              size={30}
              color={'#C7D8DD'}
              />
      </TouchableOpacity>
    ),
    headerRight: (
        <View style={{flexDirection:'row', paddingRight:10}}>
            <TouchableOpacity
                style={{height: 25,
                        width: 25,
                        alignItems:'center',
                        marginRight:5,}}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleSettings()
                }}>
                <MyIcon
                    name={'settings'}
                    size={25}
                    color={'#C7D8DD'} />
            </TouchableOpacity>
        </View>
    ),
  }) 

  constructor(props){
    super(props)

    this.state = {
        renderContent:false,
        loading: false,
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSettings: this.handleSettings })
    // console.log(this.props.dispatch)

    this.loadData(this.props)
  }

  componentWillReceiveProps(nextProps){
    this.loadData(nextProps)
  }

  loadData = (props) =>{
    let all_name_cards ={title: 'All name cards',
                            member: [
                                {
                                    name: 'profile.name',
                                }
                            ]
                        }

    let friend_cards ={ title: 'Friend cards',
                            member: [
                                {
                                    name: 'profile.name',
                                },
                                {
                                    name: 'profile.name',
                                },
                                {
                                    name: 'profile.name',
                                },
                                {
                                    name: 'profile.name',
                                }
                            ]
                        }

    let family_cards ={ title: 'Family cards',
                            member: [
                                {
                                    name: 'profile.name',
                                }
                            ]
                        }

    let data = [all_name_cards, friend_cards, family_cards];
    this.setState({data, renderContent: true})
  }

  handleSettings = () =>{
    this.props.navigation.navigate("settings_name_cards")
  }

  _renderSection = (section, sectionId, state)  => {

    let ic_collapse = <MyIcon
                              name={state?'collapse-up':'collapse-down'}
                              size={8}
                              color={'#C7D8DD'} />

    let member_size = this.state.data[sectionId].member.length
    if(member_size == 0){
        return ;
    }

    return (
        <View
            style={{ 
                    height: 30, 
                    flexDirection: 'row',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#E4E4E4' }}>
            <View style={{ flexDirection: 'row', 
                        alignItems: 'center'}}>
                <Text style={{ fontSize: 13, 
                                color: 'gray',
                                paddingLeft: 10,
                                fontWeight:'700' }}>
                {section + "("+ member_size +")" }
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center', marginRight:10 }}>
                {ic_collapse}
            </View>
        </View>
      )
  }

  _renderRow = (rowItem, rowId, sectionId) => {
    return (
        <TouchableOpacity 
          key={rowId} 
          onPress={()=>{
            // this._itemOnPress(rowItem, rowId, sectionId)
          }}>
          <View
            style={{
              alignItems: 'center', 
              padding: 10,
              borderColor: '#E4E4E4',
              flexDirection: 'row',
            }}>
              <TouchableOpacity
                onPress={()=>{
                //   this._itemOnPress(rowItem, rowId, sectionId)
                }}>
                <FastImage
                      style={{width: 50, height: 50, borderRadius: 10, borderColor:'gray'}}
                      source={{
                        uri: 'https://cdn.shopify.com/s/files/1/1004/6990/products/il_fullxfull.1529010643_n33g_1024x1024.jpg?v=1525171498',
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />                
              </TouchableOpacity>
              <View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: '#222',
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                        Nane card
                    </Text>
                   
                  </View>

                  <Text style={{fontSize: 13, 
                              color: '#222',
                              paddingLeft: 10}}>
                              xxx
                  </Text>
              </View>
          </View>
          {/* {this.showMenuFriend(rowItem)} */}
        </TouchableOpacity>
      )
  }

  render() {
    let {renderContent, loading, data} = this.state

    if(!renderContent){
        return(<View style={{flex:1}}></View>)
    }

    return (
        <View style={{flex:1}}>
            <Spinner
                visible={loading}
                textContent={'Wait...'}
                textStyle={{color: '#FFF'}}
                overlayColor={'rgba(0,0,0,0.5)'}/>
            <ExpandableList
              ref={instance => this.ExpandableList = instance}
              dataSource={data}
              headerKey="title"
              memberKey="member"
              renderRow={this._renderRow}
              headerOnPress={(i, state) => {
              } }
              renderSectionHeaderX={this._renderSection}
              openOptions={[0]}/>
            <ActionButton 
              buttonColor="rgba(231,76,60,1)"
              offsetX={10} 
              offsetY={10}
              hideShadow={true}
              renderIcon={() => {
                  return(<MyIcon
                      name={'name-card'}
                      size={25}
                      color={'#C7D8DD'} />)
                  }}
              onPress={()=>{
                  this.props.navigation.navigate("qrcode_reader_name_card")
              }} />
        </View>
     );
  }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state)

    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }
  
    return{
        uid:makeUidState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(home);