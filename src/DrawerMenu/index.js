import React from 'react'
import {View, Text, Button, ScrollView, StyleSheet, TouchableHighlight, Image} from 'react-native'

import {DrawerNavigator, DrawerItems, createDrawerNavigator, SafeAreaView} from 'react-navigation'

class Menu extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            x:100
        }
    }

    componentDidMount(){
        console.log('cd-componentDidMount : ' + this.state.x)
    }

    componentDidUpdate(){
        console.log('cd-componentDidUpdate : ' + this.state.x)
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

    render(){
        let props = this.props

        let menu

        if(this.state.x === 100){
            menu = <DrawerItems {...props} />
        }else{
            menu = <Text>9000</Text>
        }

        return(
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
                            
                            <TouchableHighlight style={ styles.imageContainer }>
                                <Image style={ styles.image } source={{ uri: 'http://www.free-avatars.com/data/media/37/cat_avatar_0597.jpg' }} />
                            </TouchableHighlight> 
                                
                        </View>
                        
                        <View style={{ position:'absolute', right: 0}}>
                                <TouchableHighlight style={ styles.imageContainer2 }>
                                    <Image style={ styles.image2 } source={{ uri: 'http://www.free-avatars.com/data/media/37/cat_avatar_0597.jpg' }} />
                                </TouchableHighlight> 
                                <Text style={{ color: 'black', fontSize: 10, justifyContent:'flex-end', paddingTop:10, paddingLeft:10 }}>
                                    Somkid Sim 2,
                                </Text> 
                            </View>
                        
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
                        
                        <View style={{width:null, backgroundColor:'blue', position:'absolute', bottom:0, right:0}}>
                            <Text
                            onPress={this.onPressLearnMore.bind(this)}
                            title="Menu"
                            // color="#841584"
                            accessibilityLabel="Learn more about this purple button"

                            style={{ textAlign:'right', padding:10}}
                            >Menu</Text>
                        </View>
                    </View>
                    {menu}
                    {/* <DrawerItems {...menu} /> */}
                </View>
                </SafeAreaView>
            </ScrollView>
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