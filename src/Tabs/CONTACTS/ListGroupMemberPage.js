import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        TouchableOpacity,
        TouchableHighlight,
        Image} from 'react-native'

import ExpandableList from 'react-native-expandable-section-flatlist'
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';
import Swipeout from 'react-native-swipeout'

import ActionButton from 'react-native-action-button';
import Menu, {
    MenuContext,
    MenuOptions,
    MenuOption,
    MenuTrigger
  } from 'react-native-popup-menu';

var _ = require('lodash');
import * as actions from '../../Actions'
import MyIcon from '../../config/icon-font.js';

import {getUid, getHeaderInset} from '../../Utils/Helpers'

import ListGroupMember_TabMembersPage from './ListGroupMember_TabMembersPage'
import ListGroupMember_TabAdminPage from './ListGroupMember_TabAdminPage'

class ListGroupMemberPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "List members",
        headerTintColor: '#C7D8DD',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
  
            // ios navigationoptions underline hide
            borderBottomWidth: 0,
  
            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
          },
        headerRight: (
            <View style={{marginRight:10}}>
                <TouchableOpacity
                    style={{padding:5}}
                    // disabled={isModify ? false: true}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleCancel()
                    }}>
                    <MyIcon
                        name={'cancel'}
                        size={25}
                        color={'#C7D8DD'} />
                </TouchableOpacity>
            </View>
        ),
    });

    constructor(){
        super();
        this.state = { 
            renderContent: false,
            group_id:0,
        }
    }

    componentWillMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })

        const { navigation } = this.props;
        const group_id = navigation.getParam('group_id', null);

        this.setState({group_id, renderContent:true})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    handleChangeTab({i, ref, from, }) {
        console.log("handleChangeTab : i =" + i)
    }

    handlerGoToPage = (index) =>{
        this.scrollableTabView.goToPage(index)
    }
      
    // 
    render() {
        let {renderContent} = this.state

        if(!renderContent){
            return (<View />)
        }

        return(<ScrollableTabView
                    ref={(ref) => { this.scrollableTabView = ref; }}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar />}
                    locked={true}
                    tabBarPosition='top'
                    tabBarTextStyle={{fontSize:15}}
                    onChangeTab={this.handleChangeTab.bind(this)}>
                    <ListGroupMember_TabMembersPage tabLabel='Members' index={0} amount={4} params={this.state} props={this.props}/>
                    <ListGroupMember_TabAdminPage tabLabel='Admins' index={1} amount={5} params={this.state} props={this.props} handlerGoToPage={this.handlerGoToPage}/>  
                </ScrollableTabView>)
    }
}

export default connect(null, actions)(ListGroupMemberPage);