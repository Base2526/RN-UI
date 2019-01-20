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
import GroupBackgroundImage from '../../test/class-image-with-text'
import ImageWithDefault from '../../Utils/ImageWithDefault'
import * as actions from '../../Actions'

class ManageClasssPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        headerTintColor: 'white',
        // headerRight: (
        //     <View style={{flexDirection:'row', flex:1}}>
        //         <TouchableOpacity 
        //             style={{paddingRight:10}}
        //             onPress={()=>{
        //                 Alert.alert(
        //                     '',
        //                     'If you leave this group, you\'ll no longer be able to see its member list or chat history Continue?',
        //                     [
        //                     //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        //                       {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //                       {text: 'OK', onPress: () => console.log('OK Pressed')},
        //                     ],
        //                     { cancelable: false }
        //                   )
        //             }}>
        //             <Text style={{color:'red', fontSize:16, borderWidth: 1, borderColor: 'red', borderRadius: 12, padding: 8, overflow:"hidden",}}>Settings</Text>
        //         </TouchableOpacity> 
        //     </View>
        // ),
    });

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
            data: {}
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        const { navigation } = this.props;
        const data = navigation.getParam('data', null);

        this.setState({data})

        console.log(data)
    }

    countMembers = (item) =>{
        let count = 0
        if(item.members !== undefined){
          _.each(item.members, function(_v, _k) { 
              if(_v.status){
                count++
              } 
          })
        }
        return count
    }

    componentWillReceiveProps(nextProps) {
        let classs = nextProps.auth.users.classs
        let arr_classs = Object.keys(classs).map((key, index) => {
            return {...{class_id:key}, ...classs[key]};
        })

        let {class_id} = this.state.data
        var v = arr_classs.find(function(element) { 
            return element.class_id == class_id; 
        }); 

        this.setState({data: v})
    }

    render() {
        
        let {data} = this.state

        // console.log(data)
        return (
                <ScrollView style={{ flex: 1,}}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    <GroupBackgroundImage style={{paddingTop:getHeaderInset()}} auth={this.props.auth} data={data} />
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
                                            source={require('../../Images/member-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                            Members ({this.countMembers(data)})
                                        </Text>
                                    </View>
                                }
                                onPress={() => { 
                                    this.props.navigation.navigate('ListClassMemberPage', {'data': data})
                                    // this.props.navigation.navigate('ListGroupMemberPage', {'group': group})
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
                                            source={require('../../Images/settings-icon.png')}
                                        />
                                        <Text style={{ fontSize:22 , paddingLeft:10}}>
                                        Settings
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    this.props.navigation.navigate('ClasssSettingsPage')
                                }}
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

export default connect(mapStateToProps, actions)(ManageClasssPage);