import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput,
        FlatList} from 'react-native'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

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

        let data = []
        _.each(my_ids, function(_v, _k) { 
            data.push({key:_k, id:_v.id, enable:_v.enable})
        });

        let find = data.find(k => k.enable==true)

        let newData = [...[{key: '0'}], ...data]
        console.log(newData)
        this.setState({data:newData})
    }

    handleSave = () => {
        if(this.state.text.length == 0){
            alert('My ID is empty?')
        }else{

            this.setState({loading:true})
            this.props.actionAddMyIDProfile(this.props.uid, this.state.text, (result) => {
                console.log(result)

                this.setState({loading:false})

                // const { navigation } = this.props;
                // navigation.goBack();
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)

        let {my_ids} = nextProps

        let newData = this.state.data.map((value, key) => {
            // console.log(value, key)
            let find = _.find(my_ids,  function(v, k) { 
                return k == value.key
            })
            
            if(value.key != 0){
                if(find.enable !== value.enable){
                    return {...value, enable:find.enable}
                }
            }
            return value
        });
        // console.log(this.state.data)
        // console.log(newData)

        let find = newData.filter(k => k.enable==true)
        if(find.length == 1){
            // console.log(newData)
            this.setState({data:newData})
        }else{
            if(find.length == 0 ){
                // console.log(newData)
                this.setState({data:newData})
            }
        }
    }

    onSeleted = (key) =>{
        console.log(key)
        this.setState({loading:true})
        this.props.actionSelectMyIDProfile(this.props.uid, key, (result) => {
            console.log(result)

            this.setState({loading:false})
        })
    }

    renderHeader = () => {
        return(<View><Text style={{fontSize:18}}>Select My ID</Text></View>)
    };

    renderItem = ({ item, index }) => {
        console.log(item)
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
                            color={item.enable ? '#DF2D6C' : '#E9E9E9'} />
                    </TouchableOpacity>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.id}</Text>
                    </View>
                </View>
            </TouchableOpacity>)
    }
      
    render() {
        return (<View style={{margin:10, flex:1}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{flexDirection:'row'}}>
                        <TextInput
                            style={{ flex:1,fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            clearButtonMode='while-editing'
                            maxLength={30}
                            placeholder= {this.state.text}
                        />
                        <TouchableOpacity 
                            style={{paddingLeft:10, 
                                    paddingRight:10,
                                    marginLeft:10,
                                    backgroundColor:'red',
                                    justifyContent:'center'}}
                            onPress={()=>{
                                this.handleSave()
                            }}
                            >
                            <Text style={{color:'#C7D8DD', fontWeight:'bold'}}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <FlatList
                            style={{marginTop:10}}
                            data={this.state.data}
                            renderItem={this.renderItem}
                            extraData={this.state.data}
                            ListHeaderComponent={this.renderHeader}
                            // ItemSeparatorComponent={this.renderSeparator}
                        />
                    </View>
                </View>)
    }
}


const mapStateToProps = (state) => {
  console.log(state)

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