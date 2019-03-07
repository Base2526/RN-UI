import React, { Component } from 'react';
import { View, 
        Text, 
        Button, 
        TouchableOpacity, 
        StyleSheet,
        FlatList, 
        Dimensions,
        Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
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

import FriendsPage from './FriendsPage'
import GroupsPage from './GroupsPage'
import ClasssPage from './ClasssPage'

import * as actions from '../../Actions'
import {getHeaderInset} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';
import OfflineNotice from '../../Utils/OfflineNotice'

import {makeIsConnectedState} from '../../Reselect'

// const _header = props => (
//     <View style={{flex:1, alignItems:'flex-end', flexDirection:'row'}}>
//         <View style={{flex:1}}>
//             <TouchableOpacity
//                 style={{marginBottom:10}}
//                 onPress={() => {
//                     props.navigation.openDrawer()
//                 }}>
//                 <MyIcon
//                     name={'menu'}
//                     size={30}
//                     color={'#C7D8DD'}
//                      />
//             </TouchableOpacity>
//         </View>
//         {/* 
//         <View style={{height:Header.HEIGHT, backgroundColor:'green'}}>
//             <Text>Title Header</Text>
//         </View> 
//         */}
//         <View style={{flex:1, flexDirection:'row', marginBottom:10, justifyContent: 'flex-end'}}>
//             <TouchableOpacity
//                 style={{height: 25,
//                         width: 30,
//                         alignItems:'center',
//                         marginRight:5,}}
//                 onPress={() => {
//                     // const { params = {} } = props.navigation.state
//                     let {params = {}} = props.navigation.state.routes[0]

//                     params.handleHeaderRightContactsSearch()
//                 }}>
//                 <MyIcon
//                     name={'search'}
//                     size={25}
//                     color={'#C7D8DD'} />
//             </TouchableOpacity>
//             {/* <TouchableOpacity
//                 style={{height: 25,
//                         width: 30,
//                         alignItems:'center',
//                         marginRight:5}}
//                 onPress={() => {
//                     // const { params = {} } = navigation.state
//                     let {params = {}} = props.navigation.state.routes[0]
//                     params.handleHeaderRight()
//                 } }>
//                  <MyIcon
//                     name={'plus'}
//                     size={25}
//                     color={'#C7D8DD'} />
//             </TouchableOpacity> */}
//             <TouchableOpacity
//                 style={{height: 25,
//                         width: 30,
//                         alignItems:'center',
//                         marginRight:5,
//                         justifyContent:'center',}}
//                 onPress={() => {
//                     // const { params = {} } = navigation.state
//                     let {params = {}} = props.navigation.state.routes[0]
//                     params.handleHeaderRightContactsMenu()
//                 } }>
//                 {/* <MyIcon
//                     name={'collapse-down'}
//                     size={15}
//                     color={'#C7D8DD'} /> */}

                    
//             </TouchableOpacity>
//         </View>
    
//     </View>
//   );

// const ImageHeader = (props, navigation) => {
//     let bg_url = '';
//     if(props.navigation.state.routes[0].params !== undefined){
//         if(props.navigation.state.routes[0].params.hasOwnProperty('bg_url')){
//             bg_url = props.navigation.state.routes[0].params.bg_url;
//         }
//     }

//     return(<View style={{ backgroundColor: '#eee', height: getHeaderInset(true) }}>
//         <FastImage
//             style={StyleSheet.absoluteFill}
//             // source={require('../../Images/boxpink.png')}
//             source={{
//                 uri: bg_url,
//                 headers:{ Authorization: 'someAuthToken' },
//                 priority: FastImage.priority.normal,
//             }}
//             resizeMode={FastImage.resizeMode.cover}
//         />
//       <_header {...props} style={{ backgroundColor: 'transparent' }}/>
//     </View>)
// }

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

class home extends Component {

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
            // title: "Contacts",
            // tabBarVisible: false,
            // headerBackground: (
            //     <Image
            //       style={StyleSheet.absoluteFill}
            //       source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg' }}
            //     />
            //   ),

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
                    style={{marginBottom:10}}
                    onPress={() => {
                        navigation.openDrawer()
                    }}>
                    <MyIcon
                        name={'menu'}
                        size={30}
                        color={'#C7D8DD'}
                        />
                </TouchableOpacity>
            ),
            headerRight: (
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity
                        style={{height: 25,
                                width: 25,
                                alignItems:'center',
                                marginRight:10,}}
                        onPress={() => {
                            const { params = {} } = navigation.state
                            params.handleHeaderRightContactsSearch()
                        }}>
                        <MyIcon
                            name={'contacts-search'}
                            size={25}
                            color={'#C7D8DD'} />
                    </TouchableOpacity>
                    <Menu style={{ zIndex: 10 }}>
                        <MenuTrigger>
                            <MyIcon
                                style={{marginRight:10}}
                                name={'dot-vertical'}
                                size={25}
                                color={'#C7D8DD'} />
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{ }}>
                            <MenuOption onSelect={() => {}}>
                                <Text style={{padding:10, fontSize:18}}>Menu 1</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => {}}>
                                <Text style={{padding:10, fontSize:18}}>Menu 2</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => {}}>
                                <Text style={{padding:10, fontSize:18}}>Menu 3</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            ),
        }
    }

    
    constructor(props){
        super(props)

        this.state= {
            // isConnected: true,
            positionSelect:0,
            renderContent: false,
            isOpenMenu:false,
            orientation:'PORTRAIT',
            numMenuColumns:4,
            menuItem:[  {
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
                        }]
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);
        this.props.navigation.setParams({ handleHeaderRight: this.handleHeaderRight })
        this.props.navigation.setParams({ handleHeaderRightContactsSearch: this.handleHeaderRightContactsSearch })
        this.props.navigation.setParams({ handleHeaderRightContactsMenu: this.handleHeaderRightContactsMenu })
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.auth.users);
        // console.log('componentWillReceiveProps')
        // if(nextProps.auth.users === null){
        //     return;
        // }
        // // console.log(nextProps.auth.users.profiles.bg_url);
        // // console.log(this.props.navigation.getParam('bg_url', 'NO-ID'));
        // if (nextProps.auth.users.profiles.bg_url !== this.props.navigation.getParam('bg_url', 'NO-ID')) {
        //     // console.log('----- 09')
        //     this.props.navigation.setParams({ bg_url: nextProps.auth.users.profiles.bg_url });
        // }
    }

    onLayout(e) {
        const {width, height} = Dimensions.get('window')
        console.log(width, height)
    
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
        // this.setState({
        //     isOpenMenu:!this.state.isOpenMenu
        // })
    }

    handleChangeTab({i, ref, from, }) {
        this.setState({
            positionSelect:i
        })
    }

    renderListItem = ({ item }) => {
        if ('empty' in item) {
            return <View style={{ height: 80, 
                                width: 80, 
                                flex:1,
                                justifyContent:'center', 
                                alignItems:'center',
                                backgroundColor: 'transparent',
                                borderColor:'#C9C4C4',}} />;
        }

        return (
            <TouchableOpacity 
                style={{flex:1,
                    justifyContent:'center', 
                    alignItems:'center',
                    padding:10
                    }}
                onPress={()=>{
                // this.props.params.navigation.navigate("ApplicationDetailPage")
                }}>
                <FastImage
                    style={{width: 50, 
                            height: 50, 
                            borderRadius: 25,
                            }}
                    source={{
                    uri: 'https://unsplash.it/400/400?image=1',
                    headers:{ Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={{justifyContent:'center', paddingTop:5}}>
                    <Text >{item.name}</Text>
                </View>
            </TouchableOpacity>
          )
    
        return (
            <TouchableOpacity 
                onPress={()=>{
                    this.props.navigation.navigate("testPushNotifications")
                }}>
                <View style={{
                            height: 80, 
                            width: 80, 
                            flex:1,
                            justifyContent:'center', 
                            alignItems:'center',
                            borderWidth:.5, 
                            borderColor:'#C9C4C4',}}>
                    <View style={{justifyContent:'center', paddingTop:5}}>
                        <Text >{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
      }

    renderViewMenu(){
        return(
            <View style={{position:'absolute', 
                        backgroundColor:'gray', 
                        zIndex:100, 
                        left:0, 
                        right:0,
                        flex:1}}>
                <FlatList
                    // style={{flex:1, backgroundColor:'red'}}
                    key = {this.state.orientation}
                    // data={item.list}
                    /*  เราต้องมีการคำนวณ item ให้เต็มแต่ละแถว  */
                    data = {formatData(this.state.menuItem, this.state.numMenuColumns)}
                    numColumns={this.state.numMenuColumns}
                    renderItem={this.renderListItem}
                    keyExtractor={this.keyExtractor}
                    extraData={this.state}
                    contentContainerStyle={{flexGrow: 2, justifyContent: 'center'}}/>
            </View>
        )
    }

    handleScroll = (event) => {
        console.log(event)
        console.log('handleScroll') 
    }

    render() {
        let {renderContent} = this.state;
        let {isConnected} = this.props

        if(!renderContent){
            return(<View style={{flex:1}}></View>)
        }

        console.log("home > render()")
        return (
            <View style={{backgroundColor:'white', flex:1}} onLayout={this.onLayout.bind(this)} >
                {/* {menuView} */}
                {!isConnected ?<OfflineNotice />:<View />}
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
        // auth:state.auth,
        // isConnected:state.offline.online,


        isConnected: makeIsConnectedState(state, ownProps),
    }
}



export default connect(mapStateToProps, actions)(home);