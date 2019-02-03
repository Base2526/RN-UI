import React from 'react'
import {Modal, 
        Alert,
        View, 
        Text, 
        Button, 
        ScrollView, 
        StyleSheet, 
        TouchableOpacity, 
        Image,
        Dimensions,
        FlatList} from 'react-native'
import {DrawerItems, 
        NavigationActions, DrawerActions} from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux';

import * as actions from '../Actions'
import TestSVG from '../test/TestSVG'

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

const calculatorWidthHeightItem=(margin)=>{
    let {width, height} = Dimensions.get('window')

    let w = 0
    if(width<height){
        w = width
    }else{
        w = height
    }

    return ( w/2 + ((w/2) / 2) - (margin * 8) ) / 4
}

const data = [
    {
      name: "Strawberry",
      color: "Red",
    },
    {
      name: "Blueberry",
      color: "Blue",
    },{
      name: "Apple",
      color: "Green",
    },
    {
      name: "Blueberry",
      color: "Blue",
    },
    {
      name: "Banana",
      color: "Yellow",
    },
    {
      name: "Blueberry",
      color: "Blue",
    },
    {
      name: "Blueberry",
      color: "Blue",
    },
  ]

class DrawerMenu extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            renderContent: false,
            x:100,
            modalVisible: false,
            
            data_my_application: []
        }

        this.onPressLearnMore = this.onPressLearnMore.bind(this)
        // this._calculatorWidthHeightItem = this._calculatorWidthHeightItem.bind(this)
    }

    componentDidMount(){
        setTimeout(() => {this.setState({renderContent: true})}, 0);
        
        let {my_applications} = this.props.auth.users
        this.onLoadDataMyApplication(my_applications)

        console.log(this.props)

        this.navigateToScreen = this.navigateToScreen.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.auth)

        let {my_applications} = nextProps.auth.users
        this.onLoadDataMyApplication(my_applications)
    }

    navigateToScreen = (route) => {
        // alert('navigateToScreen')
        
        const navigateAction = NavigationActions.navigate({
          routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        this.props.navigation.dispatch(DrawerActions.closeDrawer())
    }

    onLoadDataMyApplication = (my_applications) =>{
        let data_my_application = []
        Object.entries(my_applications).forEach(([key, value]) => {

            if(value.status){
                data_my_application.push({key, item_id: key, ...value})
            }else{
            //   unPublishedMember.push({key, item_id: key, ...value})
            }
        })
        console.log(data_my_application)
        this.setState({data_my_application})
    }

    onPressLearnMore(){
        if(this.state.x === 100){
            this.setState ({
                x:101
            })
        }else{
            this.setState ({
                x:100
            })
        }
    }

    renderManageAccountsView=()=>{
        return( <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{marginTop: 40}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:1, alignItems:'center'}}>
                                <Text style={{fontSize:22, fontWeight:'600'}}>Accounts</Text>
                            </View>
                            <TouchableOpacity
                                style={{position:'absolute', right:10, top:10}}
                                onPress={() => {
                                    // this.setModalVisible(!this.state.modalVisible);
                                    this.setState({modalVisible: false});
                                }}>
                                <Text>DONE</Text>
                            </TouchableOpacity>
                        </View>
                
                        <View>
                            <View style={{padding:5}}>
                                <TouchableOpacity style={{flexDirection:'row'}}>
                                    <View style={{justifyContent:'center', padding:10}}>
                                        <FastImage
                                            style={{width: 30, height: 30, borderRadius: 20}}
                                            source={{
                                                uri: 'https://unsplash.it/400/400?image=1',
                                                headers:{ Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    </View>
                                    <View style={{height:60, justifyContent:'center', padding:5}}>
                                        <Text>ms.android@gmail.com</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{padding:5}}>
                                <TouchableOpacity style={{flexDirection:'row'}}>
                                    <View style={{justifyContent:'center', padding:10}}>
                                        <FastImage
                                            style={{width: 30, height: 30, borderRadius: 20}}
                                            source={{
                                                uri: 'https://unsplash.it/400/400?image=1',
                                                headers:{ Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    </View>
                                    <View style={{height:60, justifyContent:'center', padding:5}}>
                                        <Text>android.somkid@gmail.com</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{padding:5}}>
                                <TouchableOpacity style={{flexDirection:'row'}}>
                                    <View style={{justifyContent:'center', padding:10}}>
                                        <Icon name="plus-circle" size={30} />
                                    </View>
                                    <View style={{height:60, justifyContent:'center', padding:5}}>
                                        <Text>Add account</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>)
    }

    renderManageAccounts=()=>{
        return( <View>
                <View style={{padding:5}}>
                    <TouchableOpacity style={{flexDirection:'row'}}>
                        <View style={{justifyContent:'center', padding:10}}>
                            <FastImage
                                style={{width: 30, height: 30, borderRadius: 20}}
                                source={{
                                    uri: 'https://unsplash.it/400/400?image=1',
                                    headers:{ Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        </View>
                        <View style={{height:60, justifyContent:'center', padding:5}}>
                            <Text>ms.android@gmail.com</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{padding:5}}>
                <TouchableOpacity 
                    style={{flexDirection:'row'}}
                    onPress={()=>{
                        this.setState({modalVisible: true});
                    }}>
                    <View style={{justifyContent:'center', padding:10}}>
                        <Icon name="cog" size={30} />
                    </View>
                    <View style={{height:60, justifyContent:'center', padding:5}}>
                        <Text>Manage accounts</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>)
    }

    renderItemAccounts({ item, index }) {
        // console.log(this)
        return <TouchableOpacity>
                <View style={{
                    margin: 5,
                    height: calculatorWidthHeightItem(5),
                    width: calculatorWidthHeightItem(5),
                    // backgroundColor: '#CCC',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <TestSVG 
                      width={calculatorWidthHeightItem(5)}
                      height={calculatorWidthHeightItem(5)}
                      strokeWidth={3}
                      image_uri={''}/>
                </View>
                </TouchableOpacity>
    }

    renderItemMyApplicaton({ item, index }) {
        // console.log(item)
        if ('empty' in item) {
            return <View style={{
                height: calculatorWidthHeightItem(5), 
                width: calculatorWidthHeightItem(5), 
                flex:1,
                // borderColor: "green", 
                // borderWidth: 1, 
                justifyContent:'center', 
                alignItems:'center',
                backgroundColor: 'transparent',}} />;
        }
      
        let _this = this
        // image_url
        return <TouchableOpacity
                    style={{margin: 5}}
                    onPress={()=>{
                        // this.props.params.navigation.navigate
                        console.log(_this)
                        // this.navigateToScreen()
                    }}>
                    <FastImage
                        style={{width: calculatorWidthHeightItem(5), 
                                height: calculatorWidthHeightItem(5),
                                }}
                        source={{
                            uri: item.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
    }
    
    renderItemFollowing({ item, index }) {
        return <TouchableOpacity>
                <View style={{
                    margin: 5,
                    height: calculatorWidthHeightItem(5),
                    width: calculatorWidthHeightItem(5),
                    backgroundColor: '#CCC',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <Text>{index}</Text>
                </View>
                </TouchableOpacity>
    }

    render(){
        let {renderContent, data_my_application} = this.state;
        let props = this.props

        if(this.state.x === 100){
            menu = <DrawerItems {...props} />
            collapse = require('../Images/collapse_down.png')
            other_user =<View style={{ position:'absolute', right: 0}}>
                            <TouchableOpacity style={ styles.imageContainer2 }>
                                <Image style={ styles.image2 } source={{ uri: 'http://www.free-avatars.com/data/media/37/cat_avatar_0597.jpg' }} />
                            </TouchableOpacity> 
                            <Text style={{ color: 'black', fontSize: 10, justifyContent:'flex-end', paddingTop:10, paddingLeft:10 }}>
                                Somkid Sim 2,
                            </Text> 
                        </View>
        }else{
            menu = this.renderManageAccounts()
            collapse = require('../Images/collapse_up.png')
        }

        if(!this.props.hasOwnProperty('auth') || !this.props.auth.isLogin){
            return <View style={{flex: 1}}></View>
        }
        
        let {users} = this.props.auth
        return(
            <View style={{flex:1}}>
            { renderContent &&
                 <View style={{flex:1}}>
                    <View
                        style={{
                            backgroundColor: 'gray',
                            ...ifIphoneX({
                                height: 160,
                            }, {
                                height: 140,
                            }),
                            ...ifIphoneX({
                                paddingTop: 50
                            }, {
                                paddingTop: 30
                            })
                        }}>
                        <FastImage
                            style={StyleSheet.absoluteFill}
                            source={require('../Images/boxpink.png')}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={{flexDirection:'row', 
                                    // backgroundColor:'gray',
                                    marginLeft:10,
                                    alignItems:'center'}}>
                            <TouchableOpacity style={{}}>
                                <TestSVG 
                                    width={80}
                                    height={80}
                                    strokeWidth={3}
                                    image_uri={users.profiles.image_url}/> 
                            </TouchableOpacity> 
                            <View style={{marginRight: 90,}}>
                            <Text style={{paddingLeft:10, 
                                        fontSize:25,
                                        color:'white',}}>{users.profiles.name}</Text>
                            </View>
                        </View>
                        
                    </View>

                    <ScrollView>
                        <View>
                            <Text>Accounts</Text>
                            <FlatList
                                contentContainerStyle={styles.list}
                                data={formatData(data, 4)}
                                numColumns={4}
                                scrollEnabled={false}
                                renderItem={this.renderItemAccounts}
                                contentContainerStyle={{flexGrow: 2, justifyContent: 'center'}}
                                key = {this.state.orientation}/>
                        </View>
                        <View>
                            <Text>My Application</Text>
                            <FlatList
                                contentContainerStyle={styles.list}
                                data={formatData(data_my_application, 4)}
                                numColumns={4}
                                scrollEnabled={false}
                                renderItem={this.renderItemMyApplicaton}
                                // contentContainerStyle={{flexGrow: 2, justifyContent: 'center'}}
                                key = {this.state.orientation}
                                extraData={data_my_application}/>
                        </View>
                        <View>
                        <Text>Following</Text>
                        <FlatList
                            contentContainerStyle={styles.list}
                            data={formatData(data, 4)}
                            numColumns={4}
                            scrollEnabled={false}
                            renderItem={this.renderItemFollowing}
                            contentContainerStyle={{flexGrow: 2, justifyContent: 'center'}}
                            key = {this.state.orientation}/>
                    </View>
                    </ScrollView>
                </View>  
            }
             
            { /*this.renderManageAccountsView() */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageContainer: {
        height: null,
        width: null,
        // borderRadius: 64
        paddingTop: 25,
        paddingLeft: 20,
    },
    image: {
        height:80,
        width:80,
        borderRadius: 40
    },

    imageContainer2: {
        height:40,
        width: 40,
        // borderRadius: 64
        padding: 30,
    },
    image2: {
        height:40,
        width:40,
        borderRadius: 20
    },
  });

const mapStateToProps = (state) => {
    console.log(state)

    if(!state._persist.rehydrated){
        return {}
    }
    
    return{
        auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(DrawerMenu);