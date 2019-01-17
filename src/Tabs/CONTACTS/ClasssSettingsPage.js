import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Image,
        TextInput,
        ScrollView,
        KeyboardAvoidingView
        } from 'react-native'
import { connect } from 'react-redux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {getStatusBarHeight} from '../../Utils/Helpers'

import * as actions from '../../Actions'

import ImageWithDefault from '../../Utils/ImageWithDefault'

class ClasssSettingsPage extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){
        return(
        <KeyboardAwareScrollView>
        <View style={{flex:1}}>
            <View style={{ height:40, 
                        marginTop:getStatusBarHeight(), 
                        justifyContent:'center', 
                        paddingLeft:10}}>
                <Text style={{fontSize:22}}>Settings</Text>
                <TouchableOpacity 
                    style={{
                            borderWidth: 1, 
                            borderColor: 'red',
                            borderRadius: 15,
                            height:30, 
                            width:30,
                            justifyContent: 'center', 
                            alignItems: 'center',
                            position:'absolute',
                            right:0,
                            margin:10,
                            zIndex: 10,
                                }}
                    onPress={()=>{
                        this.props.navigation.goBack()
                    }}>
                    <Text style={{color:'red', fontSize:16}}>X</Text>
                </TouchableOpacity> 
              </View>
            <View style={{flex: 1,}}>
          
            <TableView >
                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Classs Profile Picture
                                </Text>
                            </View>
                        }
                    />
                    
                    <Cell
                        cellStyle="Basic"
                        titleTextColor="#007AFF"
                        hideSeparator={true}
                        cellContentView={
                            <View style={{
                                        flexDirection:'row', 
                                        height: 150,
                                        width: 150}}>
                                <TouchableOpacity
                                onPress={()=>{
                                    alert('#1')
                                }}>
                                    <ImageWithDefault 
                                        source={{uri: 'http://www.cndajin.com/data/wls/195/17865217.png'}}
                                        style={{width: 150, height: 150}}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{position:'absolute', 
                                                            right:0, 
                                                            bottom:0, 
                                                            borderRadius:10, 
                                                            borderColor:'gray', 
                                                            borderWidth:1,
                                                            padding:5,
                                                            margin:5}}
                                                            onPress={()=>{
                                                                alert('#2')
                                                            }}>
                                    <Text style={{color:'gray'}}>EDIT</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </Section>
                <Section
                    sectionPaddingTop={5}
                    sectionPaddingBottom={0}
                    separatorInsetLeft={0}>
                    <Cell
                        cellStyle="Subtitle"
                        titleTextColor="#007AFF"
                        hideSeparator={true} 
                        cellContentView={
                            <View style={{flex:1, flexDirection:'row'}}>
                                <Text style={{flex:1, fontSize: 16,  }}>
                                Class name
                                </Text>
                            </View>
                        }
                    />
                    <Cell
                        cellContentView={
                            <TextInput
                            style={{ fontSize: 22, flex: 1 }}
                            placeholder="input class name"
                            />
                        }
                        />
                </Section>
            </TableView>
          </View>
        </View>
        </KeyboardAwareScrollView>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ClasssSettingsPage);