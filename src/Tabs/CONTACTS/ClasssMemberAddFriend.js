import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity,} from 'react-native'
import { connect } from 'react-redux';
var _ = require('lodash');

// import SubmitButton from 'react-native-submit-button';

// import ImageWithDefault from '../../Utils/ImageWithDefault'
import {getStatusBarHeight} from '../../Utils/Helpers'
import * as actions from '../../Actions'

import ClasssMemberAddFriendItem from '../../test/GroupMemberInviteItem'

class ClasssMemberAddFriend extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            data: [],
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

        const { navigation, auth } = this.props;
        const class_id = navigation.getParam('class_id', null);
        // console.log(class_id)

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

        // console.log(friend)

        this.setState({data: friend})
    }

    onSubmit = () => {
        console.log('api call')
        setTimeout(() => {
          this.setState({ buttonState: 'success' });
          console.log('api call > onSubmit')
        }, 2000); // if success, else this.setState({ buttonState: 'error' })
    };

    renderItem = ({ item, index }) => {
        // console.log(item)

        return (<ClasssMemberAddFriendItem item={item} index={index} handleCallback={this.handleCallback}/>)
    }

    handleCallback =(item)=> {
        console.log('-- handleCallback', item) 
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
      };

    render(){
        return(<View style={{flex:1}}>
                    <View style={{ height:40, 
                                marginTop:getStatusBarHeight(), 
                                justifyContent:'center', 
                                paddingLeft:10}}>
                        <Text style={{fontSize:22}}>Add friend</Text>
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
                                    margin:10
                                        }}
                            onPress={()=>{
                                this.props.navigation.goBack()
                            }}>
                            <Text style={{color:'red', fontSize:16}}>X</Text>
                        </TouchableOpacity> 
                    </View>
                    <View>
                    <FlatList
                        style={{marginBottom:getStatusBarHeight() + 40}}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        extraData={this.state.data}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                    </View>
                </View>)
    }
}

const mapStateToProps = (state) => {
    // console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ClasssMemberAddFriend);