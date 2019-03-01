import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        ActivityIndicator, 
        TextInput,
        ScrollView,
        FlatList} from 'react-native';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
// import Image from 'react-native-remote-svg'
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from 'react-redux';
import * as actions from '../../Actions'
import {getUid, isEquivalent2Object} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

class ManagePhonesPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: 'List phone',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
            // ios navigationoptions underline hide
            borderBottomWidth: 0,

            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
    })

    constructor(props) {
        super(props);
        this.state = {
            item_id: 0,
            data: []
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const item_id = navigation.getParam('item_id', null);

        this.setState({item_id}, ()=>{
            this.loadData(this.props)
        })
    }  

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        // let {phones, my_applications} = props
        // let data =_.map(phones, (v, k)=>{
        //             return {...v, phone_key:k}
        //         })

        // // let my_application 

        // console.log(data)
        // this.setState({data})

        let {phones, my_applications} = props
        let {item_id} = this.state

        let my_application =_.find(my_applications, (v, k)=>{
                                return k == item_id
                            })

        console.log(my_application, phones)

        let data =  _.map(phones, (v, k)=>{
                        if(my_application.phones !== undefined){
                            let __ = _.find(my_application.phones, (ev, ek)=>{
                                        return k == ev
                                      })

                            console.log(__)
                            if(__ !== undefined){
                                return {...v, phone_key:k, select:true}
                            }
                        }

                        return {...v, phone_key:k, select:false}
                    })
        
        console.log(data)

        // _.each(item,  function(_v, _k) { 
        //     console.log(_v, _k)
        //     console.group(item)
        //     // if()
        // })

        // console.log(data)
        this.setState({data})
    }

    select = (item) =>{
        console.log(item)

        let {phones, my_applications} = this.props
        let {item_id} = this.state

        let my_application =_.find(my_applications, (v, k)=>{
                                return k == item_id
                            })

        let __em = my_application.phones

        if(__em === undefined){
            __em = [item.phone_key]
            
            this.props.actionMyApplicationPhone(this.props.uid, this.state.item_id, __em, (result) => {
                console.log(result)
            })
        }else{
            let _find = __em.find(v=>{
                return v == item.phone_key;
            })

            let newValue = null
            if(_find === undefined){
                newValue = [...__em, item.phone_key]
            }else{
                newValue = __em.filter(function(v) { 
                    return v != item.phone_key
                })
            }


            this.props.actionMyApplicationPhone(this.props.uid, this.state.item_id, newValue, (result) => {
                console.log(result)
            })

        }

        console.log(my_application)
    }

    renderItem = ({item, index}) => { 
        return(<TouchableOpacity
                onPress={()=>{
                    this.select(item)
                }}>
                <View style={{flex:1, 
                              padding:20, 
                              backgroundColor:'white', 
                              flexDirection:'row', 
                              alignItems:'center',}}>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.phone_number}</Text>
                    </View>
                    <View style={{position:'absolute', right:0, padding:10}}>
                        <MyIcon
                            name={'check-ok'}
                            size={20}
                            color={item.select ? '#CE3B6E' : '#C7D8DD'} />
                    </View>
                </View>
                </TouchableOpacity>)
    }

    ItemSeparatorComponent = () => {
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
    }

    render() {

        let {data} = this.state

        return(<View style={{ flex:1}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}/>
                    <FlatList
                        data={data}
                        ItemSeparatorComponent = {this.ItemSeparatorComponent}
                        renderItem={this.renderItem}
                        extraData={data}/>
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
      phones:state.auth.users.profiles.phones,
      my_applications:state.auth.users.my_applications
    }
}
  
export default connect(mapStateToProps, actions)(ManagePhonesPage)