import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList,  
        TouchableOpacity,} from 'react-native'
import { connect } from 'react-redux';
var _ = require('lodash');
import FastImage from 'react-native-fast-image'
import * as actions from '../../actions'
import MyIcon from '../../config/icon-font.js';

import Constant from '../../utils/Constant'

import {makeFriendsState, 
        makeFriendProfilesState,} from '../../reselect'

class AddGroupsSelectMemberPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Select member",
        headerTintColor: '#C7D8DD',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
        },
        headerRight: (
            <TouchableOpacity
              style={{paddingRight:10}}
              onPress={() => {
                const { params = {} } = navigation.state
                params.handleAddMember()
              }}>
              <Text style={{fontSize:18, fontWeight:'bold', color:'#C7D8DD'}}>Add</Text>
            </TouchableOpacity>
          ),
    })

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            buttonState: 'normal'
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({ handleAddMember: this.handleAddMember })
    

        const { navigation, auth } = this.props;
        const data = navigation.getParam('members', null);

        // let friends = auth.users.friends

        let {friends, friend_profiles} = this.props

        let key = []
        _.each(data, function(_v, _k) { 
            key.push(_v)
        });

        let newData = []
        _.each(friends, function(_v, _k) { 
            let find = key.find(k => k.friend_id==_k)

            let profile = _.find(friend_profiles, (v, k)=>{
                return k == _k
            })

            if(!find){
                if(_v.status == Constant.FRIEND_STATUS_FRIEND){
                    newData.push({..._v, friend_id:_k, profile})
                }
            }else{
                find = {...find, profile}
                newData.push(find)
            }
        });
        this.setState({data:newData})    
    }

    handleAddMember = () =>{
        // alert('handleAddMember')

        let newData = this.state.data.filter(function(item){
            return item.seleted == true;
        })

        // console.log(newData)
        newData.sort(function(a, b) {
            var dateA = new Date(a.create), dateB = new Date(b.create);
            return dateA - dateB;
        });

        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onSeleted(newData);
    }

    onSubmit = () => {
        console.log('api call')
        setTimeout(() => {
          this.setState({ buttonState: 'success' });
          console.log('api call > onSubmit')
        }, 2000); // if success, else this.setState({ buttonState: 'error' })
    };

    onSeleted = (index) =>{
        let newData = [...this.state.data];
        if(this.state.data[index].seleted === undefined){
            this.state.data[index].seleted = true
            this.state.data[index].create = new Date()
        }else{
            this.state.data[index].seleted = !this.state.data[index].seleted
        }


        // console.log(newData)

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
                        this.onSeleted(index)
                    }}>
                    <MyIcon
                        name={'dot-circled'}
                        size={30}
                        color={seleted ? '#E9E9E9' : '#DF2D6C'} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{
                        this.onSeleted(index)
                    }}>
                    <FastImage
                        style={{width: 50, 
                                height: 50, 
                                borderRadius: 25, 
                                // borderWidth:.5,
                                // borderColor:'gray'
                        }}
                        source={{
                        uri: item.profile.image_url,
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </TouchableOpacity>
                <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                    <Text style={{fontSize:18}}>{item.profile.name}</Text>
                </View>
            </View>
            </TouchableOpacity>)

    }

    handleCallback =(item)=> {
        console.log('-- handleCallback', item) 
    }

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
        )
    };

    render(){
        return(<View style={{flex:1}}>
                    <FlatList
                        // style={{}}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        extraData={this.state.data}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </View>)
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }

    if(!state.auth.isLogin){
        return;
    }
  
    return{
        friends:makeFriendsState(state, ownProps),
        friend_profiles:makeFriendProfilesState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(AddGroupsSelectMemberPage);