import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        Platform, 
        TouchableOpacity,
        ScrollView,
        SafeAreaView,
        Image} from 'react-native'

import { Header } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
var _ = require('lodash');

import {getStatusBarHeight, getHeaderInset} from '../../Utils/Helpers'
import GroupBackgroundImage from '../../test/group-image-with-text'
import ImageWithDefault from '../../Utils/ImageWithDefault'
import * as actions from '../../Actions'

class ManageGroupPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        // title: "Contacts",
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        headerTintColor: 'white',
        // header:{ style:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 } },
        // headerStyle: {style:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 }},
    
        headerRight: (
            // <TouchableOpacity
            //     // style={Styles.headerButton}
            //     style={{marginRight:5}}
            //     onPress={() => {
            //         // const { params = {} } = navigation.state
            //         // params.handleHeaderRight()

            //         alert('share')
            //     } }>
            //     <Icon name="share-alt-square" size={25} />
            // </TouchableOpacity>

            <View style={{flexDirection:'row', flex:1}}>
                <TouchableOpacity 
                    style={{paddingRight:10}}
                    onPress={()=>{
                        Alert.alert(
                            '',
                            'If you leave this group, you\'ll no longer be able to see its member list or chat history Continue?',
                            [
                            //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                              {text: 'OK', onPress: () => console.log('OK Pressed')},
                            ],
                            { cancelable: false }
                          )
                    }}>
                    <Text style={{color:'red', fontSize:16, borderWidth: 1, borderColor: 'red', borderRadius: 12, padding: 8, overflow:"hidden",}}>Leave group</Text>
                </TouchableOpacity> 
            </View>
        ),
    });

//    static navigationOptions = ({navigation}) => { return { headerTitle: <Text style={{color: 'white', fontSize: 18}}>Test</Text>, headerTransparent: true, headerStyle: { borderBottomWidth: 0, } } }

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
            FlatListItems: [
                {key: '1'},
                {key: '2'},
                {key: '3'},
                {key: '4'},
                {key: '5'}
            ]
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);
    }

    render() {
        const { navigation } = this.props;
        const group_id = navigation.getParam('group_id', null);
        // console.log(group_id)

        let groups = this.props.auth.users.groups;

        let group = null
        _.each(groups, function(_v, _k) { 
            if(group_id === _k){
                group = _v
            }
        });

        console.log(group)
        return (
                <ScrollView style={{ flex: 1,}}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    <GroupBackgroundImage style={{paddingTop:getHeaderInset()}} auth={this.props.auth} group={group} />
                    <View style={{ flex:1}}>
                    <TableView >
                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Basic"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={false} 
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Image
                                            style={{width: 25, height: 25}}
                                            source={require('../../Images/chat-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                            Chat
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    // console.log("Chat")
                                    this.props.navigation.navigate("ChatPage")
                                }}
                            />
                            <Cell
                                cellStyle="Basic"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={false} 
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Image
                                            style={{width: 25, height: 25}}
                                            source={require('../../Images/member-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                            Members ({ Object.keys(group.group_profile.members).length })
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    // console.log("Members")
                                    // this.props.navigation.navigate("ListGroupMemberPage",  { transition: 'vertical' })
                                
                                    console.log(this)
                                    this.props.navigation.navigate(
                                        'ListGroupMemberPage'
                                    )

                                    // , { transition: 'collapseExpand' })

                                    // this.props.navigate({
                                    //     routeName: 'SceneTwo',
                                    //     params: {
                                    //         transition: 'myCustomTransition'
                                    //     }
                                    // })
                                /*
                                this.props.navigate({
    routeName: 'SceneTwo',
    params: {
        transition: 'myCustomTransition'
    }
}) */
                                }}
                            />
                            <Cell
                                cellStyle="Basic"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={false} 
                                cellContentView={
                                    
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Image
                                            style={{width: 25, height: 25}}
                                            source={require('../../Images/qrcode-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                            QR code
                                        </Text>
                                    </View>
                                }
                                onPress={() => console.log("QR code")}
                            />
                            <Cell
                                cellStyle="Basic"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={false} 
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Image
                                            style={{width: 25, height: 25}}
                                            source={require('../../Images/settings-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                        Settings
                                        </Text>
                                    </View>
                                }
                                onPress={() => console.log("Settings")}
                            />
                        </Section>
                      </TableView>
                    </View>
                </View>
            </ScrollView> 
        );
    }
}

const styles = StyleSheet.create({
    
    MainContainer :{
    
    justifyContent: 'center',
    // flex:1,
    backgroundColor:'red'
    // paddingTop: (Platform.OS === 'iOS') ? 20 : 0
        
    },
        
    FlatList_Item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        
    },
        
    header_footer_style:{
        
        width: '100%', 
        height: 44, 
        backgroundColor: '#4CAF50', 
        alignItems: 'center', 
        justifyContent: 'center'
        
    },
    
    textStyle:{
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 21
    }
});

const mapStateToProps = (state) => {
    console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ManageGroupPage);