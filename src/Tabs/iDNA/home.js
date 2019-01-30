import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';

import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';

import ListMyAppPage from './ListMyAppPage'
import ListCenterPage from './ListCenterPage'
import ListFollowingPage from './ListFollowingPage'

import Image from 'react-native-remote-svg'

export default class home extends Component {

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
                                alignItems:'center', marginRight:10}}
                        onPress={() => {
                            const { params = {} } = navigation.state
                            params.handleHeaderRight()
                        } }>
                        {/* <Icon color={'white'} name="plus" size={20} /> */}
                        <Image
                            style={{ width: 25, height: 25,}}
                            source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18.628" height="18.715" viewBox="0 0 18.628 18.715">
                            <g id="Group_451" data-name="Group 451" transform="translate(-348.867 -60.276)">
                            <line id="Line_105" data-name="Line 105" x2="18.628" transform="translate(348.867 69.633)" fill="none" stroke="#b5cdd1" stroke-width="2"/>
                            <line id="Line_106" data-name="Line 106" x2="18.715" transform="translate(358.181 60.276) rotate(90)" fill="none" stroke="#b5cdd1" stroke-width="2"/>
                            </g>
                        </svg>
                        `}} />
                    </TouchableOpacity>
                </View>
            }
            break
            case 1:{
                __headerRight = <TouchableOpacity
                        style={{height: 20,
                            width: 30,
                            alignItems:'center'}}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleHeaderRightCenterSearch()
                    } }>
                    <Icon name="search" size={20} />
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
                    {/* <Icon name="bars" size={25} /> */}

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
            positionSelect:0,
            renderContent: false,
        }
    }

    componentDidMount () {
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        this.props.navigation.setParams({ 
            handleHeaderRight: this.handleHeaderRight,
            positionSelect: this.state.positionSelect,
            handleHeaderRightCenterSearch: this.handleHeaderRightCenterSearch
        })

        // this.props.navigation.setParams({ handleHeaderRightContactsSearch: this.handleHeaderRightContactsSearch })
    }

    handleHeaderRight = () => {
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

        console.log("handleChangeTab : i =" + i)

        this.setState({
            positionSelect:i
        })

        this.props.navigation.setParams({positionSelect: i});
    }
      
    render() {
        let {
            renderContent
          } = this.state;

        return (
            <View style={[style.container, {backgroundColor:'white'}]}>
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

let style = StyleSheet.create({
    container: {
        flex: 1
    },
});