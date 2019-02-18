import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';

import { connect } from 'react-redux';


import Styles from '../../styles';
import ListMyAppPage from './ListMyAppPage'
import ListCenterPage from './ListCenterPage'
import ListFollowingPage from './ListFollowingPage'

import * as actions from '../../Actions'
import MyIcon from '../../config/icon-font.js';
import OfflineNotice from '../../Utils/OfflineNotice'

class home extends Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}, positionSelect} = navigation.state;

        let __headerRight
        switch(params.positionSelect){
            case 0:{
                __headerRight = 
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity
                        style={{height: 25,
                                width: 25,
                                alignItems:'center', 
                                marginRight:10}}
                        onPress={() => {
                            const { params = {} } = navigation.state
                            params.handleAddNewApplication()
                        }}>
                        <MyIcon
                            name={'plus'}
                            size={25}
                            color={'#C7D8DD'}
                            />
                    </TouchableOpacity>
                </View>
            }
            break
            case 1:{
                __headerRight = <TouchableOpacity
                        style={{height: 25,
                                width: 25,
                                alignItems:'center', 
                                marginRight:10}}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleHeaderRightCenterSearch()
                    }}>
                    <MyIcon
                        name={'search'}
                        size={25}
                        color={'#C7D8DD'}
                        />
                        
                </TouchableOpacity>
            }
            break
        }

        return {
            // title: "iDNA",
            headerTintColor: 'white',
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
                    style={Styles.headerButton}
                    onPress={() => navigation.openDrawer()}>
                    <MyIcon
                        name={'menu'}
                        size={30}
                        color={'#C7D8DD'}
                        />
                </TouchableOpacity>
            ),
            headerRight: (
                /*
                params.positionSelect == 0 &&

                <TouchableOpacity
                    style={Styles.headerButton}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleHeaderRight()
                    } }>
                    <Icon name="plus" size={20} />
                </TouchableOpacity>
                */
               __headerRight
              ),
        }
    };

    constructor(props){
        super(props)

        this.state= {
            // isConnected: true,
            positionSelect: 0,
            renderContent: false,
        }
    }

    componentDidMount () {
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        this.props.navigation.setParams({ 
            handleAddNewApplication: this.handleAddNewApplication,
            positionSelect: this.state.positionSelect,
            handleHeaderRightCenterSearch: this.handleHeaderRightCenterSearch
        })

        // this.props.navigation.setParams({ handleHeaderRightContactsSearch: this.handleHeaderRightContactsSearch })
    }

    handleAddNewApplication = () => {
        switch(this.state.positionSelect){
            case 0:{
                this.props.navigation.navigate("CreateApplicationPage")
            }
        }
    }

    handleHeaderRightCenterSearch= () => {
        this.props.navigation.navigate("CenterSearch")
    }

    handleChangeTab({i, ref, from, }) {
        // this.children[i].onEnter();
        // this.children[from].onLeave();

        // console.log("handleChangeTab : i =" + i)

        this.setState({
            positionSelect:i
        })

        this.props.navigation.setParams({positionSelect: i});
    }
      
    render() {
        let {renderContent} = this.state;
        let {isConnected} = this.props

        // console.log(isConnected)
        return (
            <View style={{backgroundColor:'white', flex:1}}>
                {!isConnected ?<OfflineNotice />:<View />}
                { renderContent &&
                <ScrollableTabView
                    // style={{height:500}}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar />}
                    locked={true}
                    tabBarPosition='top'
                    //  contentProps={...props}
                    onChangeTab={this.handleChangeTab.bind(this)}>
                    <ListMyAppPage tabLabel='My App' index={0} amount={4} params={this.props} />
                    <ListCenterPage tabLabel='Center' index={1} amount={5} params={this.props} />
                    <ListFollowingPage tabLabel='Following' index={2} amount={6} params={this.props} />
                </ScrollableTabView>
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    if(!state._persist.rehydrated){
        return {}
    }
    console.log(state.offline)
    return{
        isConnected:state.offline.online
    }
}

export default connect(mapStateToProps, actions)(home);