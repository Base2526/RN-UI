import React, { Component } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';

import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';

import ListMyAppPage from './ListMyAppPage'
import ListCenterPage from './ListCenterPage'
import ListFollowingPage from './ListFollowingPage'

export default class home extends Component {

    /*
    static navigationOptions = ({ navigation }) => ({
        title: "iDNA",
        headerLeft: (
            <TouchableOpacity
                style={Styles.headerButton}
                onPress={() => navigation.openDrawer()}>
                <Icon name="bars" size={25} />
            </TouchableOpacity>
        ),
        headerRight: (
            this.state.positionSelect == 0 &&
            <TouchableOpacity
                style={Styles.headerButton}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleHeaderRight()
                } }>
                <Icon name="plus" size={20} />
            </TouchableOpacity>
          ),
    })
    */

    static navigationOptions = ({navigation}) => {
        const {params = {}, positionSelect} = navigation.state;

        let __headerRight
        switch(params.positionSelect){
            case 0:{
                __headerRight = 
                <View style={{flexDirection:'row'}}>
                    
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
            title: "iDNA",
            headerLeft: (
                <TouchableOpacity
                    style={Styles.headerButton}
                    onPress={() => navigation.openDrawer()}>
                    <Icon name="bars" size={25} />
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