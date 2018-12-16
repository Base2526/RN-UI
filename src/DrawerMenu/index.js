import React from 'react'
import {Modal, Alert ,View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, Image} from 'react-native'

import {DrawerNavigator, DrawerItems, createDrawerNavigator, SafeAreaView} from 'react-navigation'

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'


class Menu extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            renderContent: false,
            x:100,
            modalVisible: false,
        }

        this.onPressLearnMore = this.onPressLearnMore.bind(this)
    }

    componentDidMount(){
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        // console.log('cd-componentDidMount : ' + this.state.x)
    }

    componentDidUpdate(){
        // console.log('cd-componentDidUpdate : ' + this.state.x)
    }

    onPressLearnMore(){
        // alert('onPressLearnMore')

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

    render(){

        let {
            renderContent
        } = this.state;
  
          
        let props = this.props

        let menu, collapse, other_user

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

        return(
            <View style={{flex:1}}>
            { renderContent &&
            <ScrollView>
                <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                <View style={{flex:1}}>
                    <View
                    style={{
                        backgroundColor: '#3399ff',
                        height: 180,
                    }}
                    >
                        <View style={{position:'absolute'}}>
                            {/* <Text style={{ color: 'black', fontSize: 30, justifyContent:'flex-end' }}>
                                Header
                            </Text>    */}
                            
                            <TouchableOpacity style={ styles.imageContainer }>
                                <Image style={ styles.image } source={{ uri: 'http://www.free-avatars.com/data/media/37/cat_avatar_0597.jpg' }} />
                            </TouchableOpacity> 
                                
                        </View>
                        
                        {other_user}
                        
                        <View style={{width:null, position:'absolute', bottom:0, padding:10}}>
                            <Text
                            onPress={this.onPressLearnMore.bind(this)}
                            title="Menu"
                            // color="#841584"
                            accessibilityLabel="Learn more about this purple button"

                            style={{fontSize:18}}
                            >Somkid Simajarn</Text>
                            <Text
                            onPress={this.onPressLearnMore.bind(this)}
                            title="Menu"
                            // color="#841584"
                            accessibilityLabel="Learn more about this purple button"

                            style={{fontSize:14}}
                            >android.somkid@gmail.com</Text>
                        </View>
                        
                        <View style={{width:null, position:'absolute', bottom:0, right:0}}>
                            {/* <Text
                            onPress={this.onPressLearnMore.bind(this)}
                            title="Menu"
                            // color="#841584"
                            accessibilityLabel="Learn more about this purple button"

                            style={{ textAlign:'right', padding:10}}
                            >Menu--</Text> */}
                            {/* {collapse} */}
                            <TouchableOpacity
                                style={{padding:5}}
                                onPress={()=>{
                                    this.onPressLearnMore()
                                }}>
                                <FastImage
                                    style={{width: 20, height: 20}}
                                    source={collapse}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {menu}
                    {/* <DrawerItems {...menu} /> */}
                </View>
                </SafeAreaView>
            </ScrollView>
            }

            
            {this.renderManageAccountsView()}
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

export default Menu

/*
import React from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'

import { DrawerItems, SafeAreaView } from 'react-navigation';

let CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomDrawerContentComponent
*/