import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput,
        FlatList,
        Keyboard,
        SafeAreaView,
        Alert} from 'react-native'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');
import { ifIphoneX } from 'react-native-iphone-x-helper'

import * as actions from '../../Actions'
import {getUid, randomKey} from '../../Utils/Helpers'

import MyIcon from '../../config/icon-font.js';

class EditMyIDPage extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            title: "My ID",
            headerTintColor: '#C7D8DD',
            headerStyle: {
                backgroundColor: 'rgba(186, 53, 100, 1.0)',
                // ios navigationoptions underline hide
                borderBottomWidth: 0,
    
                // android navigationoptions underline hide
                elevation: 0,
                shadowOpacity: 0
            },
            // headerRight: (
            //     <View style={{marginRight:10}}>
            //     <TouchableOpacity
            //         style={{padding:5}}
            //         onPress={() => {
            //             const { params = {} } = navigation.state
            //             params.handleSave()
            //         }}>
            //         <Text style={{fontSize:18, color:'#C7D8DD'}}>Save</Text>
            //     </TouchableOpacity>
            //     </View>
            // ),
        }
    }

    constructor(props) {
      super(props);

      this.state = {
          text:'',
          loading:false,
          data:[]
      }
    }
  
    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })
        let {my_ids} = this.props

        // console.log(my_ids)
        // let data = []
        // _.each(my_ids, function(_v, _k) { 
        //     data.push({key:_k, id:_v.id, enable:_v.enable})
        // });

        // let find = data.find(k => k.enable==true)

        // let newData = [...[{key: '0'}], ...data]
        // console.log(newData)
        // this.setState({data:newData})

        let newMyIds = _.map(my_ids, (value, key) => {
            return {...value, key}
        })

        newMyIds.splice(0, 0, {key: '0'});
        // console.log(newMyIds)
        this.setState({data:newMyIds})
    }

    handleSave = () => {
        let text = this.state.text.trim()
        // str;
        // console.log(text.indexOf(' '))
        if (text.indexOf(' ') !== -1) {
            // string is not empty and not just whitespace
            alert('String is not empty and not just whitespace')
        }else if(text.length == 0){
            alert('My ID is empty?')
        }else{
            // alert()
            this.setState({loading:true})
            this.props.actionAddMyIDProfile(this.props.uid, text).then((result) => {
                console.log(result)
                this.setState({loading: false})
                if(result.status){
                    // this.props.navigation.goBack()

                    this.setState({text:''})
                }else{
                    setTimeout(() => {
                        Alert.alert(result.message);
                    }, 100);
                }

                // Hide that keyboard!
                Keyboard.dismiss()
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        let {my_ids} = nextProps
        let newMyIds = _.map(my_ids, (value, key) => {
            return {...value, key}
        })

        newMyIds.splice(0, 0, {key: '0'});
        // console.log(newMyIds)
        this.setState({data:newMyIds})
    }

    onSeleted = (key) =>{
        this.setState({loading:true})
        this.props.actionSelectMyIDProfile(this.props.uid, key, (result) => {
            this.setState({loading:false})
        })
    }

    onDeleted = (key) =>{
        // console.log(key)
        this.setState({loading:true})
        this.props.actionRemoveMyIDProfile(this.props.uid, key, (result) => {
            

            console.log(result)
            this.setState({loading:false})
        })
    }

    renderHeader = () => {
        return(<View><Text style={{margin:10, fontSize:18, fontWeight:'bold'}}>Select My ID ({this.state.data.length -1}/10)</Text></View>)
    };

    renderSeparator = () => {
        return (
          <View
            style={{
              height: .5,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
    };

    renderItem = ({ item, index }) => {
        if(index ==0){
            let find = this.state.data.find(k => k.enable==true)
            return(<TouchableOpacity 
                onPress={()=>{
                    if(!item.enable){
                        this.onSeleted(item.key)
                    }
                }}>
                <View style={{flex:1, 
                    height:60, 
                    padding:10, 
                    marginRight:10,
                    backgroundColor:'white', 
                    flexDirection:'row',
                    alignItems:'center',
                    paddingLeft:5, 
                    paddingRight:10}}>
                    <TouchableOpacity 
                        style={{paddingLeft:5, 
                                paddingRight:10}}
                        onPress={()=>{
                            if(!item.enable){
                                this.onSeleted(item.key)
                            }
                        }}>
                        <MyIcon
                            name={'dot-circled'}
                            size={30}
                            color={find === undefined ? '#DF2D6C' : '#E9E9E9'} />
                    </TouchableOpacity>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>Not set</Text>
                    </View>
                </View>
                </TouchableOpacity>)
        }

        return( <View style={{flex:1, 
                    height:60, 
                    padding:10, 
                    marginRight:10,
                    backgroundColor:'white', 
                    flexDirection:'row',
                    alignItems:'center',
                    paddingLeft:5, 
                    paddingRight:10}}>
                    
                    <TouchableOpacity 
                        style={{paddingLeft:5, 
                                paddingRight:10}}
                        onPress={()=>{
                            if(!item.enable){
                                this.onSeleted(item.key)
                            }
                        }}>
                        <MyIcon
                            name={'dot-circled'}
                            size={30}
                            color={item.enable ? '#DF2D6C' : '#E9E9E9'} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                        if(!item.enable){
                            this.onSeleted(item.key)
                        }
                    }}>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.id}</Text>
                    </View>
                    </TouchableOpacity>

                    { /*
                    <View style={{flex:1, 
                                position:'absolute', 
                                right:0,
                                padding:5}}>
                        <TouchableOpacity 
                            style={{justifyContent: 'center', 
                                    alignItems: 'center',
                                    zIndex: 10,
                                    marginRight:10}}
                            onPress={()=>{
                                Alert.alert(
                                    'Delete',
                                    'Are sure delete ' + item.id + ' ?',
                                    [
                                    //   {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                      {text: 'Cancel', onPress: () => {

                                      }, style: 'cancel'},
                                      {text: 'Delete', onPress: () => {
                                        // this.setState({loading:true})
                                        // this.props.actionRemovePhoneProfile(this.props.uid, key, (result) => {
                                        //     console.log(result)

                                        //     this.setState({loading:false})
                                        // })
                                        this.onDeleted(item.key)
                                      }},
                                    ],
                                    { cancelable: false }
                                  )
                            }}>
                            <Text style={{color:'red', fontSize:16}}>Delete</Text>
                        </TouchableOpacity> 
                    </View>
                    */ }
                </View>
            )
    }
      
    render() {
        return (<SafeAreaView style={{flex:1, ...ifIphoneX({
                                                // marginBottom: 50
                                            }, {
                                                // marginBottom: 30
                                            })}}>
                <View style={{ flex:1}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{flexDirection:'row', margin:10}}>
                        <TextInput
                            style={{ flex:1,fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            clearButtonMode='while-editing'
                            maxLength={30}
                            placeholder= {this.state.text}
                            editable={this.state.data.length -1 == 10?false:true} 
                        />
                        <TouchableOpacity 
                            style={{paddingLeft:10, 
                                    paddingRight:10,
                                    marginLeft:10,
                                    backgroundColor:this.state.data.length -1 == 10?'gray':'red',
                                    justifyContent:'center'}}
                            onPress={()=>{
                                this.handleSave()
                            }}
                            disabled={this.state.data.length -1 == 10? true:false}
                            >
                            <Text style={{color:'#C7D8DD', fontWeight:'bold'}}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        <FlatList
                            style={{marginTop:10}}
                            data={this.state.data}
                            renderItem={this.renderItem}
                            extraData={this.state.data}
                            ListHeaderComponent={this.renderHeader}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                    </View>
                </View>
            </SafeAreaView>)
    }
}

const mapStateToProps = (state) => {
  // console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    uid:getUid(state),
    my_ids:state.auth.users.profiles.my_ids
  }
}

export default connect(mapStateToProps, actions)(EditMyIDPage);