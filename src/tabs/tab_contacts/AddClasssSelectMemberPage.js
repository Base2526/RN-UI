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
        makeFriendProfilesState} from '../../reselect'

class AddClasssSelectMemberPage extends React.Component{
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
        const members = navigation.getParam('members', null);

        // let friends = auth.users.friends

        let {friends, friend_profiles} = this.props
        let data = []
        _.map(friends, (v, k)=>{
            if(!v.block && !v.hide && v.status == Constant.FRIEND_STATUS_FRIEND){
                
                let member =_.find(members, (mv, mk)=>{
                                return mv.friend_id == k
                            })
                if(member){
                    data.push(member)
                }else{
                    let friend_profile =_.find(friend_profiles, (pv, pk)=>{
                        return pk == k
                    })
                    data.push({...v, friend_profile, friend_id:k})
                }
            }
        })
        this.setState({data})  
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
    
    onSeleted = (index) =>{
        let newData = [...this.state.data];
        if(this.state.data[index].seleted === undefined){
            this.state.data[index].seleted = true
            this.state.data[index].create = new Date()
        }else{
            this.state.data[index].seleted = !this.state.data[index].seleted
        }

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
                    height:80, 
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
                        }}
                        >
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
                            style={{width: 60, 
                                    height: 60, 
                                    borderRadius: 30, 
                                    borderWidth:.5,
                                    borderColor:'gray'
                            }}
                            source={{
                            uri: item.friend_profile.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.friend_profile.name}</Text>
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
              height: 1,
              width: "100%",
              backgroundColor: "#CED0CE",
            }}
          />
        );
    };

    render(){
        return(<View style={{flex:1}}>
                    <FlatList
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
        //   auth:state.auth
        friends:makeFriendsState(state, ownProps),
        friend_profiles:makeFriendProfilesState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(AddClasssSelectMemberPage);