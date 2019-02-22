import React from 'react'
import {View, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Dimensions} from 'react-native'

import ExpandableList from 'react-native-expandable-section-flatlist'
import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';
// import Image from 'react-native-remote-svg'
import {
  MenuProvider,
  Menu,
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import ActionButton from 'react-native-action-button';
import Spinner from 'react-native-loading-spinner-overlay';

import MyIcon from '../../config/icon-font.js';

import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'

class ListMyAppPage extends React.Component{
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
        numColumns:4,
        showSpinner: false,


        sectionID: null,
        rowID: null,
      };
    }

    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.setState({
        // data: this._data(),
        error: null,
        loading: false,
        refreshing: false
      });

      let {my_applications} = this.props.auth.users

      console.log(my_applications)

      let newValue = []
      Object.entries(my_applications).forEach(([key, value]) => {
        newValue.push({key, item_id: key, ...value})
      })

      this.setState({data:newValue})
    }
 
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
  
    renderFooter = () => {
      if (!this.state.loading) return null;
  
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    };

    loadData=()=>{
      let {my_applications} = this.props.auth.users

      let publishedMember = []
      let unPublishedMember = []
      Object.entries(my_applications).forEach(([key, value]) => {

        if(value.status){
          publishedMember.push({key, item_id: key, ...value})
        }else{
          unPublishedMember.push({key, item_id: key, ...value})
        }
      })

      let published = {
        title: 'Published',
        member: publishedMember
      }

      let unPublished = {
        title:'Unpublished',
        member: unPublishedMember
      }
      return [published, unPublished];        
    }

    // let {application_category} = this.props.auth

    manageMyApplicationPage = (item)=>{
      let {application_category} = this.props.auth

      if(application_category != null){
        this.props.params.navigation.navigate("ManageMyApplicationPage", {item})
      }else{
        this.setState({showSpinner: true})
        this.props.actionApplicationCategory().then((result) => {
          this.setState({showSpinner: false})
          if(result.status){
            this.props.params.navigation.navigate("ManageMyApplicationPage", {item})
          }
        })
      }
    }

    showMenu = (rowItem)=>{
      return( <View style={{flex:1,
                            position:'absolute', 
                            top:0,
                            right:0, 
                            marginRight:10,}}>
                <Menu>
                  <MenuTrigger>
                      <MyIcon 
                          style={{padding:10}}
                          name={'dot-vertical'}
                          size={15}
                          color={'gray'} />  
                  </MenuTrigger>
                  <MenuOptions optionsContainerStyle={{ marginTop: -(getHeaderInset() + 50)}}>
                      <MenuOption onSelect={() => {
                          // this.props.navigation.navigate("FriendProfilePage",{'friend_id': item.friend_id})

                          this.props.params.navigation.navigate("MyApplicationMyPost")
                      }}>
                          <Text style={{padding:10, fontSize:18}}>All post</Text>
                      </MenuOption>
                      <MenuOption onSelect={() => {
                          // this.setState({loading:true})
                          // this.props.actionDeleteClassMember(this.props.uid, this.state.class_id, item.member_key, (result) => {
                          //     console.log(result)
                          //     this.setState({loading:false})
                          // })
                          this.manageMyApplicationPage(rowItem)
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Settings</Text>
                      </MenuOption>
                  </MenuOptions>
              </Menu>
            </View>)
    }


    _renderRow = (rowItem, rowId, sectionId) => {
      console.log(rowItem)

      var swipeoutRightBtns = []
      if(rowItem.status){
        swipeoutRightBtns = [
          {
            component:<View style={{flex: 1, 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    backgroundColor: 'red',
                                    }}>
                        <Text style={{fontWeight:'bold', 
                                      color:'white',
                                      textAlign:'center',
                                      fontSize:16}}>UNPUBLISHED</Text>
                      </View>,
            onPress: () => {
              // console.log('UNPUBLISHED')

              this.setState({
                sectionID: sectionId,
                rowID: rowId,
                showSpinner:true
              })

              this.props.actionUpdateStatusMyApplication(this.props.uid, rowItem.item_id, (result)=>{
                this.setState({showSpinner:false})
              })
            }
          },
        ]
      }else{
        swipeoutRightBtns = [
          {
            component:<View style={{flex: 1, 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    backgroundColor: 'blue',
                                    }}>
                        <Text style={{fontWeight:'bold', 
                                      color:'white',
                                      textAlign:'center',
                                      fontSize:16}}>PUBLISHED</Text>
                      </View>,
            onPress: () => {

              this.setState({
                sectionID: sectionId,
                rowID: rowId,
                showSpinner:true
              })

              this.props.actionUpdateStatusMyApplication(this.props.uid, rowItem.item_id, (result)=>{
                console.log(result)

                this.setState({showSpinner:false})
              })
            }
          },
          {
            component:<View style={{flex: 1, 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    backgroundColor: 'red',
                                    }}>
                        <Text style={{fontWeight:'bold', 
                                      color:'white',
                                      textAlign:'center',
                                      fontSize:16}}>DELETE</Text>
                      </View>,
            onPress: () => {
              alert('DELETE')
            }
          },
        ]
      }

      swipeoutRightBtns = []

      return (
        // <Swipeout 
        //     // key={item.item_id}
        //     style={{backgroundColor:'white'}} 
        //     right={swipeoutRightBtns}
            
        //     rowID={rowId}
        //     sectionID={sectionId}
        //     // onOpen={(sectionId, rowId) => {
        //     //   this.setState({
        //     //     sectionID: sectionId,
        //     //     rowID: rowId,
        //     //   })
        //     // }}
        //     close={(this.state.sectionID === sectionId && this.state.rowID === rowId)}>
        // {/* <TouchableOpacity 
        //   key={ rowId } 
        //   onPress={()=>{
        //     // this._itemOnPress(rowItem, rowId, sectionId)
          
        //     this.manageMyApplicationPage(rowItem)
        //   }}> */}
          <View
            style={{
              alignItems: 'center', 
              padding: 10,
              borderColor: '#E4E4E4',
              flexDirection: 'row',
            }}>
              {/* <TouchableOpacity
                onPress={()=>{
                  // this.props.params.navigation.navigate("ManageMyApplicationPage", {item: rowItem})
                
                  this.manageMyApplicationPage(rowItem)
                }}> */}
                  <FastImage
                      style={{width: 50, height: 50, borderRadius: 25}}
                      source={{
                      uri: rowItem.image_url,
                      headers:{ Authorization: 'someAuthToken' },
                      priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                  />
              {/* </TouchableOpacity> */}
              <View>
                <Text style={{fontSize: 18, 
                              fontWeight: '600',
                              color: '#222',
                              paddingLeft: 10, 
                              paddingBottom:5}}>
                    {rowItem.name}
                </Text>
              </View>
              {this.showMenu(rowItem)}
          </View>
        // {/* </TouchableOpacity> */}
        // </Swipeout>
      )
    }

    _renderSection = (section, sectionId, state)  => {

      let ic_collapse = <MyIcon
                        name={state ? 'collapse-up' : 'collapse-down'}
                        size={8}
                        color={'#C7D8DD'} />

      let member_size = this.loadData()[sectionId].member.length
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
            {section}
            </Text>
        </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight:10 }}>
              {ic_collapse}
          </View>
        </View>
      )
    }

    render() {
      let {renderContent, data} = this.state;

      console.log(this.state.showSpinner)
      return (
        <MenuContext>
        <View style={{flex:1}}>
        <Spinner
                visible={this.state.showSpinner}
                textContent={'Wait...'}
                textStyle={{color: '#FFF'}}
                overlayColor={'rgba(0,0,0,0.5)'}
            />
        { 
          renderContent &&
          <ExpandableList
              ref={instance => this.ExpandableList = instance}
              dataSource={this.loadData()}
              headerKey="title"
              memberKey="member"
              renderRow={this._renderRow}
              headerOnPress={(i, state) => {
                // console.log(i, state)
                // alert('headerOnPress')
              } }
              renderSectionHeaderX={this._renderSection}
              openOptions={[0, 1, 2, 3]}
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
                  // this.props.params.navigation.navigate("AddFriendsPage")

                  this.props.params.navigation.navigate("CreateApplicationPage")
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

  return{
    uid:getUid(state),
    auth:state.auth
  }
}

export default connect(mapStateToProps, actions)(ListMyAppPage);