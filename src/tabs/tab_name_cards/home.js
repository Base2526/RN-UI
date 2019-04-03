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
import {
  MenuProvider,
  Menu,
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import Share, {ShareSheet, Button} from 'react-native-share';

import MyIcon from '../../config/icon-font.js';
import * as actions from '../../actions'
import {makeUidState} from '../../reselect'
import {getHeaderInset, isEmpty, checkInternetDialog} from '../../utils/Helpers'

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
        <Menu style={{ zIndex: 10 }}>
            <MenuTrigger>
                <MyIcon
                    // style={{paddingRight:10}}
                    name={'dot-vertical'}
                    size={25}
                    color={'#C7D8DD'} />
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={{ }}>
                <MenuOption onSelect={() => {}}>
                    <Text style={{padding:10, fontSize:18}}>Export and share</Text>
                </MenuOption>
                <MenuOption onSelect={() => {}}>
                    <Text style={{padding:10, fontSize:18}}>Download</Text>
                </MenuOption>
                <MenuOption onSelect={() => {
                  const { params = {} } = navigation.state
                  params.handleSettings()
                }}>
                    <Text style={{padding:10, fontSize:18}}>Setting</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
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
    let my_name_cards ={title: 'My name cards',
                            member: [
                                {
                                    name: 'สมัคร AIA',
                                    image_url: 'https://yt3.ggpht.com/a-/AAuE7mDQA6D0f5wYu9QPHSXbCH-oEhkOoAaN2I3hlQ=s900-mo-c-c0xffffffff-rj-k-no'
                                },
                                {
                                  name: 'บัตรสมาชิก MK',
                                  image_url: 'data:image/png;base64,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'
                                },
                                {
                                  name: 'บัตรสมาชิก ปตท',
                                  image_url: 'https://yt3.ggpht.com/a-/AAuE7mCnUp7cIfESMvFw2UyO3bme-5QqkjuF_XfBvw=s900-mo-c-c0xffffffff-rj-k-no'
                                },
                                {
                                  name: 'บัตรสมาชิก ร้านลุงโต',
                                  image_url: 'data:image/jpeg;base64,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'
                                },
                                {
                                  name: 'Starbucks',
                                  image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png'
                                }
                            ]
                        }
    let all_name_cards ={title: 'All name cards',
                            member: [
                                {
                                    name: 'ร้านของขวัญเบเกอรี่',
                                    image_url: 'https://scontent.fbkk5-7.fna.fbcdn.net/v/t1.0-9/16939230_1859464577610393_7255220658795599010_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk5-7.fna&oh=e83cd3f1f5d98640fb4b22948bd2dd61&oe=5D3B80DC'
                                }
                            ]
                        }

    let friend_cards ={ title: 'Friend cards',
                            member: [
                                {
                                    name: 'Early Bite Cafe',
                                    image_url: 'http://www.gourmetandcuisine.com/Images/editor_upload/_editor20171025112554_original.jpg'
                                },
                                {
                                    name: 'The Mandarin Oriental Shop',
                                    image_url: 'https://photos.mandarinoriental.com/is/image/MandarinOriental/bangkok-mandarin-shop-2014-1?wid=2880&hei=1032&fmt=jpeg&qlt=75,0&op_sharpen=0&resMode=sharp2&op_usm=0,0,0,0&iccEmbed=0&printRes=72&fit=wrap'
                                },
                                {
                                    name: 'บางกอกดอยคาเฟ่',
                                    image_url: 'http://www.wheregugo.com/wp-content/uploads/2017/08/cropped-cropped-15002395_1559374754079395_3472125845531164252_o.jpg'
                                },
                                // {
                                //     name: 'Peaberry Coffee',
                                //     image_url: 'https://www.peaberryltd.com/image/cache/catalog/SLIDE-Home/pb%20pragard%20songkran%20web-01-650x510.jpg'
                                // }
                            ]
                        }

    let family_cards ={ title: 'Family cards',
                            member: [
                                {
                                    name: 'B-STORY CAFE',
                                    image_url: 'https://f.ptcdn.info/568/043/000/o8taswrrqC4ceJC64rE-o.jpg'
                                }
                            ]
                        }

    let data = [my_name_cards, all_name_cards, friend_cards, family_cards];
    this.setState({data, renderContent: true})
  }

  handleSettings = () =>{
    this.props.navigation.navigate("settings_name_cards")
  }

  showMenu = (rowItem) =>{
    return( <View style={{flex:1,
                          position:'absolute', 
                          top:0,
                          right:0, 
                          marginRight:10,
                          zIndex:100}}>
                <Menu>
                <MenuTrigger>
                  <MyIcon 
                      style={{padding:10}}
                      name={'dot-horizontal'}
                      size={15}
                      color={'gray'} />  
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset())}}>
                    <MenuOption onSelect={() => {
                      let shareOptions = {
                        title: "React Native",
                        message: "Hola mundo",
                        url: "http://facebook.github.io/react-native/",
                        subject: "Share Link" //  for email
                      }
                      Share.open(shareOptions);
                    }}>
                        <Text style={{padding:10, fontSize:18}}>Share</Text>
                    </MenuOption>
                </MenuOptions>
                </Menu>
            </View>)
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
            this.props.navigation.navigate("name_card")
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
                  this.props.navigation.navigate("name_card")
                }}>
                <FastImage
                      style={{width: 50, height: 50, borderRadius: 10, borderColor:'gray'}}
                      source={{
                        uri: rowItem.image_url,
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
                        {rowItem.name}
                    </Text>
                  </View>
              </View>
          </View>
          {this.showMenu(rowItem)}
        </TouchableOpacity>
      )
  }

  render() {
    let {renderContent, loading, data} = this.state

    if(!renderContent){
        return(<View style={{flex:1}}></View>)
    }

    return (
        <MenuContext>
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
              openOptions={[0,1, 2, 3, 4,5,6,8]}
              />
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
        </MenuContext>
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