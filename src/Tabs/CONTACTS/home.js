import React, { Component } from 'react';
import { View, 
        Text, 
        Button, 
        TouchableOpacity, 
        StyleSheet,
        FlatList, 
        Dimensions,  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';

import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';

import FastImage from 'react-native-fast-image'

import FriendsPage from './FriendsPage'
import GroupsPage from './GroupsPage'
import ClasssPage from './ClasssPage'

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


export default class ContactsHome extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Contacts",
        tabBarVisible: false,

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
                    {/* <Icon name="allergies" size={20} /> */}

                    <FastImage
                        style={{width: 35, height: 20}}
                        source={require('../../Images/collapse_down_menu.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    /> 
                </TouchableOpacity>
            </View>
          ),
    });

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

    componentWillUnmount(){
        console.log('9999 --> componentWillUnmount')
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
                <FastImage
                    style={{width: 40, height: 40, borderRadius: 10}}
                    source={{
                    uri: 'https://unsplash.it/400/400?image=1',
                    headers:{ Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
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
                    onChangeTab={this.handleChangeTab.bind(this)}>
                    <FriendsPage tabLabel='Friends' index={0} amount={4} params={this.props} />
                    <GroupsPage tabLabel='Groups' index={1} amount={5} params={this.props} />
                    <ClasssPage tabLabel='Classs' index={2} amount={6} params={this.props}/>
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