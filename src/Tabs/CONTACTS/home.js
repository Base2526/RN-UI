import React, { Component } from 'react';
import { View, 
        Text, 
        Button, 
        TouchableOpacity, 
        StyleSheet,
        FlatList, 
        Dimensions  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { Header } from 'react-navigation';

const utf8 = require('utf8');

import FriendsPage from './FriendsPage'
import GroupsPage from './GroupsPage'
import ClasssPage from './ClasssPage'


import * as actions from '../../Actions'
import {getHeaderInset, getStatusBarHeight} from '../../Utils/Helpers'

import PlaceHolderFastImage from '../../Utils/PlaceHolderFastImage'

import Image from 'react-native-remote-svg'

// import SvgUri from 'react-native-svg-uri'

const _header = props => (
    <View style={{flex:1, alignItems:'flex-end', flexDirection:'row'}}>
        <View style={{flex:1}}>
            <TouchableOpacity
                style={{marginBottom:10}}
                onPress={() => {
                    props.navigation.openDrawer()
                }}>
                <Image
                    style={{ width: 25, height: 25}}
                    source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36.494" height="34.04" viewBox="0 0 36.494 34.04">
                    <g id="_3" data-name="3" transform="translate(0 0)">
                      <g id="Group_12" data-name="Group 12">
                        <rect id="Rectangle_2" data-name="Rectangle 2" width="36.494" height="5.872" fill="#8fb3c1"/>
                        <rect id="Rectangle_3" data-name="Rectangle 3" width="36.494" height="5.872" transform="translate(0 14.084)" fill="#8fb3c1"/>
                        <rect id="Rectangle_4" data-name="Rectangle 4" width="36.494" height="5.872" transform="translate(0 28.168)" fill="#8fb3c1"/>
                      </g>
                    </g>
                  </svg>
                  `}}
                />

            
            </TouchableOpacity>
        </View>
        {/* 
        <View style={{height:Header.HEIGHT, backgroundColor:'green'}}>
            <Text>Title Header</Text>
        </View> 
        */}
        <View style={{flex:1, flexDirection:'row', marginBottom:10, justifyContent: 'flex-end'}}>
            <TouchableOpacity
                style={{height: 25,
                        width: 30,
                        alignItems:'center',
                        marginRight:5,}}
                onPress={() => {
                    // const { params = {} } = props.navigation.state
                    let {params = {}} = props.navigation.state.routes[0]

                    params.handleHeaderRightContactsSearch()
                }}>
                {/* <Image
                    style={{ width: 25, height: 25}}
                    source={require('../../Images/icon-search.svg')}
                /> */}
                <Image
                    style={{ width: 25, height: 25}}
                    source={{uri:`data:image/svg+xml;utf8,<svg id="Group_449" data-name="Group 449" xmlns="http://www.w3.org/2000/svg" width="17.479" height="19.332" viewBox="0 0 17.479 19.332">
                    <line id="Line_9" data-name="Line 9" x2="4.685" y2="5.972" transform="translate(12.007 12.743)" fill="none" stroke="#b5cdd1" stroke-miterlimit="10" stroke-width="2"/>
                    <g id="Ellipse_39" data-name="Ellipse 39" transform="translate(0 0)" fill="none" stroke="#b5cdd1" stroke-width="2">
                      <ellipse cx="7.464" cy="7.464" rx="7.464" ry="7.464" stroke="none"/>
                      <ellipse cx="7.464" cy="7.464" rx="6.464" ry="6.464" fill="none"/>
                    </g>
                    <path id="Path_320" data-name="Path 320" d="M1278.858,275.317a1.814,1.814,0,1,1-1.814-1.814A1.814,1.814,0,0,1,1278.858,275.317Z" transform="translate(-1271.202 -268.788)" fill="#adc8cd" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                    <path id="Path_321" data-name="Path 321" d="M1325.429,275.317a1.814,1.814,0,1,1-1.814-1.814A1.814,1.814,0,0,1,1325.429,275.317Z" transform="translate(-1314.422 -268.788)" fill="#adc8cd" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                    <path id="Path_322" data-name="Path 322" d="M1275.559,302.806a3.676,3.676,0,0,0,1.217,2.259,13.9,13.9,0,0,0,2.226,1.723,13.766,13.766,0,0,0,2.109-1.562,4.181,4.181,0,0,0,1.377-2.419" transform="translate(-1271.506 -295.983)" fill="#adc8cd" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                  </svg>
                  
                  `}} />
                
            </TouchableOpacity>
            <TouchableOpacity
                style={{height: 25,
                        width: 30,
                        alignItems:'center',
                        marginRight:5}}
                onPress={() => {
                    // const { params = {} } = navigation.state
                    let {params = {}} = props.navigation.state.routes[0]
                    params.handleHeaderRight()
                } }>
                {/* <Image
                    style={{ width: 25, height: 25}}
                    source={require('../../Images/icon-plus.svg')}
                /> */}
                <Image
                    style={{ width: 25, height: 25}}
                    source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18.628" height="18.715" viewBox="0 0 18.628 18.715">
                    <g id="Group_451" data-name="Group 451" transform="translate(-348.867 -60.276)">
                      <line id="Line_105" data-name="Line 105" x2="18.628" transform="translate(348.867 69.633)" fill="none" stroke="#b5cdd1" stroke-width="2"/>
                      <line id="Line_106" data-name="Line 106" x2="18.715" transform="translate(358.181 60.276) rotate(90)" fill="none" stroke="#b5cdd1" stroke-width="2"/>
                    </g>
                  </svg>
                  `}} />
            </TouchableOpacity>
            <TouchableOpacity
                style={{height: 25,
                        width: 30,
                        alignItems:'center',
                        marginRight:5}}
                onPress={() => {
                    // const { params = {} } = navigation.state
                    let {params = {}} = props.navigation.state.routes[0]
                    params.handleHeaderRightContactsMenu()
                } }>
                {/* <Image
                    style={{ width: 25, height: 25}}
                    source={require('../../Images/icon-menu-down.svg')}
                /> */}

                <Image
                    style={{ width: 25, height: 25}}
                    source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="23.551" height="7.517" viewBox="0 0 23.551 7.517">
                    <path id="Path_438" data-name="Path 438" d="M926.373,54.318h3.918l7.857,5,7.825-5h3.951l-11.775,7.517Z" transform="translate(-926.373 -54.318)" fill="#adc8cd"/>
                  </svg>                  
                  `}} />
            </TouchableOpacity>
        </View>
    
    </View>
  );

const ImageHeader = (props) => {
    let bg_url = '';
    if(props.navigation.state.routes[0].params !== undefined){
        if(props.navigation.state.routes[0].params.hasOwnProperty('bg_url')){
            bg_url = props.navigation.state.routes[0].params.bg_url;
        }
    }

    /**
     source={require('../Images/boxpink.png')}
     */
    return(<View style={{ backgroundColor: '#eee', height: getHeaderInset(true) }}>
        <FastImage
            style={StyleSheet.absoluteFill}
            source={require('../../Images/boxpink.png')}
            // source={{
            //     uri: bg_url,
            //     headers:{ Authorization: 'someAuthToken' },
            //     priority: FastImage.priority.normal,
            // }}
            resizeMode={FastImage.resizeMode.cover}
        />
      <_header {...props} style={{ backgroundColor: 'transparent' }}/>
    </View>)
}

const formatData = (data, numColumns) => {
    // เป้นการ ลบ item ที่มี ​field ออกทั้งหมด เพราะว่าเรารองรับการ orientation srceen ด้วย
    data = data.filter(function(item){
      return !('empty' in item);
    }).map((item)=>{
      return item;
    });
  
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ name: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  
    return data;
};

class ContactsHome extends Component {

    static navigationOptions = ({ navigation }) => {
        // const { bg_url } = navigation.params
        // const { bg_url } =navigation.state.params;

        if(navigation.state.params !== undefined){
            // console.log(navigation.state.params)
            const { bg_url } =navigation.state.params;
            // console.log(bg_url)
        }

        // if(!this.props.hasOwnProperty('auth') 
        
        return {
            title: "Contacts",
            tabBarVisible: false,
            header: (props) => <ImageHeader {...props} />,
            headerLeft: (
                <TouchableOpacity
                    style={Styles.headerButton}
                    onPress={() => navigation.openDrawer()}>
                    <Icon name="bars" size={25} />
                </TouchableOpacity>
            ),
            headerRight: (
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity
                        style={{height: 20,
                                width: 30,
                                alignItems:'center'}}
                        onPress={() => {
                            const { params = {} } = navigation.state
                            params.handleHeaderRightContactsSearch()

                            // navigation.navigate('Search')
                        } }>
                        <Icon name="search" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{height: 20,
                                width: 30,
                                alignItems:'center'}}
                        onPress={() => {
                            const { params = {} } = navigation.state
                            params.handleHeaderRight()
                        } }>
                        <Icon name="plus" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{height: 20,
                                width: 30,
                                alignItems:'center'}}
                        onPress={() => {
                            const { params = {} } = navigation.state
                            params.handleHeaderRightContactsMenu()
                        } }>
                        
                        {/* <Image
                            style={{width: 35, height: 20}}
                            source={require('../../Images/collapse_down_menu.png')}
                            // resizeMode={FastImage.resizeMode.contain}
                        />  */}
                    </TouchableOpacity>
                </View>
            ),
        }
    }
    
    constructor(props){
        super(props)

        this.state= {
            positionSelect:0,
            renderContent: false,
            isOpenMenu:false,
            orientation:'PORTRAIT',
            numMenuColumns:4,
        }
    }

    componentDidMount () {
        setTimeout(() => {this.setState({renderContent: true})}, 0);
        this.props.navigation.setParams({ handleHeaderRight: this.handleHeaderRight })
        this.props.navigation.setParams({ handleHeaderRightContactsSearch: this.handleHeaderRightContactsSearch })
        this.props.navigation.setParams({ handleHeaderRightContactsMenu: this.handleHeaderRightContactsMenu })
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.auth.users);
        if(nextProps.auth.users === null){
            return;
        }
        // console.log(nextProps.auth.users.profiles.bg_url);
        // console.log(this.props.navigation.getParam('bg_url', 'NO-ID'));
        if (nextProps.auth.users.profiles.bg_url !== this.props.navigation.getParam('bg_url', 'NO-ID')) {
            // console.log('----- 09')
            this.props.navigation.setParams({ bg_url: nextProps.auth.users.profiles.bg_url });
        }
    }

    onLayout(e) {
        const {width, height} = Dimensions.get('window')
        // console.log(width, height)
    
        if(width<height){
          this.setState({orientation:'PORTRAIT', numMenuColumns:4})
        }else{
          this.setState({orientation:'LANDSCAPE', numMenuColumns:6})
        }
    }

    handleHeaderRight = () => {
        // alert(this.state.positionSelect)
        switch(this.state.positionSelect){
            case 0:{
                this.props.navigation.navigate("AddFriendsPage")
            }
            break
            case 1:{
                this.props.navigation.navigate("AddGroupsPage")
            }
            break
            case 2:{
                this.props.navigation.navigate("AddClasssPage")
            }
            break

        }
    }

    handleHeaderRightContactsSearch= () => {
        this.props.navigation.navigate("ContactsSearch")
    }

    handleHeaderRightContactsMenu= () => {
        this.setState({
            isOpenMenu:!this.state.isOpenMenu
        })
    }

    handleChangeTab({i, ref, from, }) {
        // this.children[i].onEnter();
        // this.children[from].onLeave();

        console.log("handleChangeTab : i =" + i)

        this.setState({
            positionSelect:i
        })
    }

    renderListItem = ({ item }) => {
        if ('empty' in item) {
          return <View style={{height: 80, 
            width: 80, 
            flex:1,
            // borderColor: "green", 
            // borderWidth: 1, 
            justifyContent:'center', 
            alignItems:'center',
            backgroundColor: 'transparent',
            borderWidth:.5, 
            borderColor:'#C9C4C4',}} />;
        }
    
        return (
          <View style={{height: 80, 
                        width: 80, 
                        flex:1,
                        // borderColor: "green", 
                        // borderWidth: 1, 
                        // backgroundColor:'red',
                        justifyContent:'center', 
                        alignItems:'center',
                        borderWidth:.5, 
                        borderColor:'#C9C4C4',}}>

            <TouchableOpacity 
                onPress={()=>{
                //   this.props.params.navigation.navigate("ApplicationDetailPage")
                    alert("Click Menu")
                }}>
                {/* <FastImage
                    style={{width: 40, height: 40, borderRadius: 10}}
                    source={{
                        uri: 'https://unsplash.it/400/400?image=1',
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                /> */}
                {/* <PlaceHolderFastImage 
                    source={{uri: 'https://unsplash.it/400/400?image=1', priority: FastImage.priority.normal}}
                    style={{width: 40, height: 40, borderRadius: 10}}/> */}

                {/* <Image 
                    source={require('../../Images/icon-error.png')}
                    style={{width: 40, height: 40, borderRadius: 10}}/> */}
            </TouchableOpacity>
            <View style={{justifyContent:'center', paddingTop:5}}>
              <Text >{item.name}</Text>
            </View>
          </View>
        )
      }

    renderViewMenu(){
        return(
            <View style={{position:'absolute', backgroundColor:'#F7F6F6', zIndex:100, left:0, right:0}}>
            <FlatList
            key = {this.state.orientation}
            // data={item.list}
            /*  เราต้องมีการคำนวณ item ให้เต็มแต่ละแถว  */
            data = {formatData([
                {
                  name: "menu 1",
                  color: "Yellow",
                },
                {
                  name: "menu 2",
                  color: "Red",
                },
                {
                  name: "menu 3",
                  color: "Blue",
                },
                {
                  name: "menu 4",
                  color: "Blue",
                },
                {
                  name: "menu 5",
                  color: "Blue",
                },{
                  name: "menu 6",
                  color: "Green",
                },{
                  name: "menu 7",
                  color: "Green",
                }
      
              ], this.state.numMenuColumns)}
            numColumns={this.state.numMenuColumns}
            renderItem={this.renderListItem}
            keyExtractor={this.keyExtractor}
            extraData={this.state}
            contentContainerStyle={{flexGrow: 2, justifyContent: 'center'}}
            // style={{flex:1, backgroundColor:'red'}}
        />
        </View>
        )
    }

    handleScroll = (event) => {
        console.log(event)
        console.log('handleScroll') 
    }

    render() {
        let {renderContent, isOpenMenu} = this.state;

        let menuView
        if (isOpenMenu) {
            menuView = this.renderViewMenu()
        }

        return (
            <View style={[style.container, {backgroundColor:'white'}]} onLayout={this.onLayout.bind(this)} >
                
                {menuView}

                { renderContent &&
                <ScrollableTabView
                    // style={{height:500}}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar />}
                    locked={true}
                    tabBarPosition='top'
                    //  contentProps={...props}
                    tabBarTextStyle={{fontSize:15}}
                    onChangeTab={this.handleChangeTab.bind(this)}>
                    <FriendsPage tabLabel='Friends' index={0} amount={4} params={this.props} handleScroll={this.handleScroll}/>
                    <GroupsPage tabLabel='Groups' index={1} amount={5} params={this.props} handleScroll={this.handleScroll}/>
                    <ClasssPage tabLabel='Classs' index={2} amount={6} params={this.props} handleScroll={this.handleScroll}/>
                </ScrollableTabView>
                }
            </View>
        );
    }
}

let style = StyleSheet.create({
    container: {
        flex: 1
    },
});

const mapStateToProps = (state) => {
    // console.log(state)
    if(!state._persist.rehydrated){
        return {}
    }
    
    return{
    auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ContactsHome);