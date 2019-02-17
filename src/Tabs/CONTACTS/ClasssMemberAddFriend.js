import React from 'react'
import {View, 
        Text, 
        FlatList,  
        TouchableOpacity,} from 'react-native'
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import * as actions from '../../Actions'
import MyIcon from '../../config/icon-font.js';
import {getUid} from '../../Utils/Helpers'

class ClasssMemberAddFriend extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Add member",
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
            <View style={{flexDirection:'row', flex:1}}>
                <TouchableOpacity
                    style={{padding:5}}
                    // disabled={isModify ? false: true}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleAdd()
                    }}>
                    <Text style={{color:'#C7D8DD',fontSize:18, fontWeight:'bold'}}>Add</Text>
                </TouchableOpacity>
            </View>
        ),
    });

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: [],
            class_id: 0,
            buttonState: 'normal'
        }
    }

    getArrFriends = () =>{
        let friends = this.props.auth.users.friends
        return Object.keys(friends).map((key, index) => {
            // const myItem = friends[key]
            // return friends[key]
            return {...{friend_id:key}, ...friends[key]};
        })
    }

    componentDidMount(){
        this.props.navigation.setParams({ handleAdd: this.handleAdd })

        const { navigation, auth } = this.props;
        const class_id = navigation.getParam('class_id', null);

        this.setState({class_id},()=>{
            this.loadData(this.props)
        })

        /*
        let classs = auth.users.classs

        let arr_classs = Object.keys(classs).map((key, index) => {
            return {...{class_id:key}, ...classs[key]};
        })

        // let {class_id} = this.state
        var v = arr_classs.find(function(element) { 
            return element.class_id == class_id; 
        }); 

        let friend_members = []
        if(v.members !== undefined){
            _.each(v.members, function(_v, _k) { 
                if(_v.status){
                    friend_members.push(_v.friend_id)
                }
            })
        }

        let friend = this.getArrFriends().filter(function(item){
            let find = friend_members.find(key=>key==item.friend_id)
            if(find === undefined){
                return item
            }
            return ;
        })

        this.setState({data: friend})
        */
    }

    loadData = (props) =>{
        console.log(props)

        let {class_id} = this.state
        let {friends, classs} = props

        console.log(friends, classs, class_id)
        let cla = _.find(classs,  function(v, k) { 
            return k == class_id; 
        })

        if(cla === undefined || cla.members === undefined){
            this.props.navigation.goBack(null)
        }

        /*
        let newData = []
        _.each(cla.members, (v, k)=>{
            if(v.status){
                // return {...{friend_id:key}, ...friends[key]};
                friend =_.find(friends, (vv, kk)=>{
                            return v.friend_id == kk
                        })
                
                newData.push( {...{friend_id:v.friend_id}, ...{member_item_id:k}, ...friend} )
            }
        })

        console.log(newData)
        this.setState({data:newData})
        */

        let newData = []
        _.each(friends, (v, k)=>{
            let f = _.find(cla.members, (vv, kk)=>{
                return k == vv.friend_id
            })

            console.log(f)
            if(f === undefined){
                newData.push( {...{friend_id:k}, ...v} )
            }
        })

        console.log(newData)
        this.setState({data:newData})
    }

    handleAdd = () =>{
        // alert('handleAddMember')

        let newData = this.state.data.filter(function(item){
            return item.seleted == true;
        })

        // console.log(newData)
        newData.sort(function(a, b) {
            var dateA = new Date(a.create), dateB = new Date(b.create);
            return dateA - dateB;
        });

        /* 
        let seleteds = []
      let list = this.state.sections[0].data[0].list
      list.map((value) => {
        if(value.friend_id !== undefined){
          seleteds.push(value.friend_id)
        }
      })
        */

        let members = []
        newData.map((value) => {
            if(value.friend_id !== undefined){
                members.push(value.friend_id)
            }
        })

        // console.log(this.props.uid)
        // console.log(this.state.class_id)
        // console.log(members)
        // const { navigation } = this.props;
        // navigation.goBack();
        // navigation.state.params.onSeleted(newData);

        
        // (uid, class_id, members)
        // this.setState({loading:true})
        // this.props.actionClassAddMember(this.props.uid, this.state.class_id, members).then((result) => {
        //     console.log(result)

        //     this.setState({loading:false})
        //     if(result.status){
        //         this.props.navigation.goBack()
        //     }else{
        //         setTimeout(() => {
        //         Alert.alert(result.message);
        //         }, 100);
        //     }
        // })
    }

    onSeleted = (index) =>{
        let newData = [...this.state.data];
        if(this.state.data[index].seleted === undefined){
            this.state.data[index].seleted = true
            this.state.data[index].create = new Date()
        }else{
            this.state.data[index].seleted = !this.state.data[index].seleted
        }
        console.log(newData)
        this.setState({
            data:newData
        })
    }

    renderItem = ({ item, index }) => {
        let seleted = false
        if(this.state.data[index].seleted === undefined){
            seleted = true
        }else{
            seleted = !this.state.data[index].seleted
        }

        return(<TouchableOpacity 
                onPress={()=>{
                    this.onSeleted(index)
                }}>
                <View style={{flex:1, 
                    height:100, 
                    padding:10, 
                    marginRight:10,
                    backgroundColor:'white', 
                    flexDirection:'row',
                    alignItems:'center',}}>
                    <MyIcon
                        style={{paddingLeft:5, paddingRight:10}}
                        name={'dot-circled'}
                        size={30}
                        color={seleted ? '#E9E9E9' : '#DF2D6C'} />
                        <FastImage
                            style={{width: 60, 
                                    height: 60, 
                                    borderRadius: 10, 
                                    backgroundColor: '#FF83AF',
                                    }}
                            source={{
                            uri: item.profile.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.normal}
                        />
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.profile.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>)
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
    };

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        // let data = []
        // for (var key in nextProps.classs) {
        //   let classs =  nextProps.classs[key]
        //   data.push({...{class_id:key}, ...classs});
        // }
        // this.setState({data,});
    }

    render(){
        return(<View style={{flex:1}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}/>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.renderItem}
                        extraData={this.state.data}
                        ItemSeparatorComponent={this.renderSeparator}/>
                </View>)
    }
}

const mapStateToProps = (state) => {
    // console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        auth:state.auth,
        uid:getUid(state),
        friends:state.auth.users.friends,
        classs:state.auth.users.classs,
    }
}

export default connect(mapStateToProps, actions)(ClasssMemberAddFriend);