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
import ImageWithDefault from '../../Utils/ImageWithDefault'
import * as actions from '../../Actions'

import Constant from '../../Utils/Constant'
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
        // headerLeft: (
        //     <View style={{paddingLeft:10}}>
        //         <TouchableOpacity 
        //             onPress={()=>{
        //                 // GroupMemberInvite
        //                 const { params = {} } = navigation.state
        //                 params.handleInvite()
        //             }}>
        //             <Text style={{color:'#C7D8DD', fontSize:18, fontWeight:'bold'}}>Invite</Text>
        //         </TouchableOpacity> 
        //     </View>
        // ),
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
        this.props.navigation.setParams({ handleInvite: this.handleInvite })

        const { navigation } = this.props;
        const group_id = navigation.getParam('group_id', null);

        this.setState({group_id}, ()=>{
            this.loadData(this.props)
        })

        
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
    }

    handleInvite = () => {
        this.props.navigation.navigate("GroupMemberInvite", {'group_id':this.state.group_id})
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    handleChangeTab({i, ref, from, }) {
        // this.children[i].onEnter();
        // this.children[from].onLeave();

        console.log("handleChangeTab : i =" + i)

        // this.setState({
        //     positionSelect:i
        // })
    }

    handlerGoToPage = (index) =>{
        this.scrollableTabView.goToPage(index)
    }
      
    // 
    render() {
        let {group_id} = this.state

        if(group_id == 0){
            return (<View />)
        }

        return(
                <ScrollableTabView
                    ref={(ref) => { this.scrollableTabView = ref; }}
                    // style={{height:500}}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar />}
                    locked={true}
                    tabBarPosition='top'
                    //  contentProps={...props}
                    tabBarTextStyle={{fontSize:15}}
                    onChangeTab={this.handleChangeTab.bind(this)}
                    >
                    <ListGroupMember_TabMembersPage tabLabel='Members' index={0} amount={4} params={this.state} props={this.props}/>
                    <ListGroupMember_TabAdminPage tabLabel='Admins' index={1} amount={5} params={this.state} props={this.props} handlerGoToPage={this.handlerGoToPage}/>
                
                </ScrollableTabView>
            // </MenuContext>
            )
    }
}

const mapStateToProps = (state) => {
    console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:getUid(state),
        groups:state.auth.users.groups
    }
}

export default connect(mapStateToProps, actions)(ListGroupMemberPage);