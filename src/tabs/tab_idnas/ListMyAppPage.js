import React from 'react'
import {View, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Dimensions} from 'react-native'
import ExpandableList from 'react-native-expandable-section-flatlist'
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
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
var _ = require('lodash');

import MyIcon from '../../config/icon-font.js';
import * as actions from '../../actions'
import {getHeaderInset, isEmpty} from '../../utils/Helpers'

import {makeUidState,
        makeApplicationCategoryState,
        makeMyAppicationsState} from '../../reselect'
        
let unsubscribes = []

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

        sectionID: null,
        rowID: null,
      };
    }

    componentDidMount() {
      let {uid, my_applications} = this.props

      this.props.trackMyApplications(uid, my_applications, (data)=>{
        unsubscribes.push(data.unsubscribe)
      })

      this.loadData(this.props)
    }

    componentWillUnmount(){
      unsubscribes.map((unsubscribe, k)=>{
        unsubscribe()
      })
    }

    componentWillReceiveProps(nextProps){
      this.loadData(nextProps)
    }

    loadData = (props) =>{
      let {uid, my_applications} = props

      let published = []
      let un_published = []
      _.map(my_applications, (value, key)=>{
        if(value.status){
          published.push({key, item_id: key, ...value})
        }else{
          un_published.push({key, item_id: key, ...value})
        }
      })

      let publisheds = {
        title: 'Published',
        member: published
      }

      let un_publisheds = {
        title:'Unpublished',
        member: un_published
      }
      this.setState({data:[publisheds, un_publisheds], renderContent: true})
    }
 
    settings = (item)=>{
      let {application_category} = this.props
      if( !isEmpty(application_category) ){ // item_id
        this.props.params.navigation.navigate("setting_myapplication", {application_id: item.item_id})
      }else{
        this.setState({loading: true})
        this.props.actionApplicationCategory().then((result) => {
          this.setState({loading: false})
          if(result.status){
            this.props.params.navigation.navigate("setting_myapplication", {application_id: item.item_id})
          }
        })
      }
    }

    showMenu = (rowItem)=>{
      console.log('rowItem', rowItem)
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
                          this.props.params.navigation.navigate("MyApplicationMyPost", {'app_id': rowItem.item_id})
                      }}>
                          <Text style={{padding:10, fontSize:18}}>All post</Text>
                      </MenuOption>
                      {/* <MenuOption onSelect={() => {
                          this.settings(rowItem)
                      }}>
                          <Text style={{padding:10, fontSize:18}}>Settings</Text>
                      </MenuOption> */}
                  </MenuOptions>
              </Menu>
            </View>)
    }

    _renderRow = (rowItem, rowId, sectionId) => {
      console.log(rowItem)
      return (
          <TouchableOpacity
            onPress={()=>{
              this.settings(rowItem)
            }}>
          <View
            style={{
              alignItems: 'center', 
              padding: 10,
              borderColor: '#E4E4E4',
              flexDirection: 'row',}}>
              <FastImage
                  style={{width: 50, height: 50, borderRadius: 25}}
                  source={{
                  uri: rowItem.image_url,
                  headers:{ Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}/>
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
          </TouchableOpacity>
      )
    }

    _renderSection = (section, sectionId, state)  => {
      let ic_collapse = <MyIcon
                          name={state ? 'collapse-up' : 'collapse-down'}
                          size={8}
                          color={'#C7D8DD'} />

      let {data} = this.state

      let member_size = data[sectionId].member.length
      if(member_size == 0){
        return
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

      return (
        <MenuContext>
        <View style={{flex:1}}>
          <Spinner
            visible={this.state.loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}/>
          { 
          renderContent &&
          <ExpandableList
              ref={instance => this.ExpandableList = instance}
              dataSource={data}
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
                this.props.params.navigation.navigate("CreateApplicationPage")
            }}/>
        </View>
        </MenuContext>
      );
    }
}

const mapStateToProps = (state, ownProps) => {
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
    uid: makeUidState(state, ownProps),
    application_category: makeApplicationCategoryState(state, ownProps),
    my_applications: makeMyAppicationsState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(ListMyAppPage);