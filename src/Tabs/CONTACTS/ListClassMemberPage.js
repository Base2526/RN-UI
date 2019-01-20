import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        Platform, 
        TouchableOpacity,
        TouchableHighlight} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5';
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';

var _ = require('lodash');

import ImageWithDefault from '../../Utils/ImageWithDefault'
import * as actions from '../../Actions'

class ListClassMemberPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Members",
        headerRight: (
            <View style={{flexDirection:'row', flex:1}}>
                <TouchableOpacity 
                    style={{paddingRight:10}}
                    onPress={()=>{
                        // GroupMemberInvite
                        const { params = {} } = navigation.state
                        params.handleAddFriend()

                    }}>
                    <Text style={{color:'black', fontSize:16}}>Add friend</Text>
                </TouchableOpacity> 
            </View>
        ),
    });

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
            class_id :0,
            data: []
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

    handleAddFriend = () => {
        this.props.navigation.navigate("ClasssMemberAddFriend",{'class_id':this.state.class_id})

        // console.log(this.state.data)
    }

    componentDidMount() {
        this.props.navigation.setParams({handleAddFriend: this.handleAddFriend })
        setTimeout(() => {this.setState({renderContent: true})}, 0);

        const { navigation } = this.props;
        const data = navigation.getParam('data', null);

        this.setState({class_id:data.class_id})

        _this = this

        let newData = []
        if(data.members !== undefined){
            _.each(data.members, function(_v, _k) { 
                if(_v.status){
                    
                    var friend = _this.getArrFriends().find(function(element) { 
                        return element.friend_id == _v.friend_id; 
                    }); 
                    // console.log(friend)

                    newData.push(friend)
                } 
            })
        }

        this.setState({data:newData})
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)

        let classs = nextProps.auth.users.classs
        let arr_classs = Object.keys(classs).map((key, index) => {
            return {...{class_id:key}, ...classs[key]};
        })

        let {class_id} = this.state
        var v = arr_classs.find(function(element) { 
            return element.class_id == class_id; 
        }); 

        _this = this

        let newData = []
        if(v.members !== undefined){
            _.each(v.members, function(_v, _k) { 
                if(_v.status){
                    
                    var friend = _this.getArrFriends().find(function(element) { 
                        return element.friend_id == _v.friend_id; 
                    }); 
                    // console.log(friend)

                    newData.push(friend)
                } 
            })
        }

        this.setState({data:newData})
    }

    FlatListItemSeparator = () => {
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

    GetFlatListItem (item) {
        Alert.alert(item);   
    }

    render_FlatList_header = () => {
        var header_View = (
            <View>
                <TouchableOpacity 
                        onPress={()=>{
                            this.props.navigation.navigate('MyApplicationProfilePage')
                        }}>
                <View style={{  backgroundColor:'white', 
                                flexDirection:'row', 
                                paddingTop:10, 
                                paddingBottom:10,
                                paddingLeft:5,
                                paddingRight:5}}
                    onPress={{}}>
                    <TouchableOpacity 
                        style={{height:60,
                                width: 60,
                                borderRadius: 10}}
                                onPress={
                                    ()=>this.props.navigation.navigate("FriendProfilePage")
                                  }>
                        {/* <FastImage
                            style={{width: 60, height: 60, borderRadius: 10}}
                            source={{
                            uri: 'https://unsplash.it/400/400?image=1',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        /> */}
                        <ImageWithDefault 
                            source={{uri: 'https://unsplash.it/400/400?image=1'}}
                            style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                        />
                    </TouchableOpacity>
                    <View style={{paddingLeft:10, justifyContent:'center'}}>
                        <Text>Name Group : Somkid</Text>
                    </View>
            
                </View>
                </TouchableOpacity>
                {this.FlatListItemSeparator()}

            </View>
        );
        return header_View ; 
    };

    render_FlatList_footer = () => {
        var footer_View = (
            <View style={styles.header_footer_style}>
            <Text style={styles.textStyle}> FlatList Footer </Text>
            </View>
        );
        return footer_View; 
    };

    renderListItem = ({ item }) => {
        // console.log(item)
        let swipeoutRight = [
            {
                component: <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}><Text style={{color:'white'}}>Delete</Text></View>,
                backgroundColor: 'red',
                onPress: () => { 
                    alert('Delete')
                }
            }
        ]

        return( 
            <Swipeout 
                style={{backgroundColor:'white'}} 
                right={swipeoutRight}>
                <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                    <TouchableOpacity 
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}   
                              onPress={
                                ()=>this.props.navigation.navigate("FriendProfilePage")
                              } 
                      >
                      {/* <FastImage
                          style={{width: 60, height: 60, borderRadius: 10}}
                          source={{
                            uri: 'https://unsplash.it/400/400?image=1',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      /> */}

                        <ImageWithDefault 
                            source={{uri: item.profile.image_url}}
                            style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                        />
                  </TouchableOpacity>
                  <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                    <Text style={{fontSize:18}}>{item.profile.name}</Text>
                 </View>
                </View>
            </Swipeout>)
    }

    render() {

        let {renderContent, data} = this.state;
        return (
            <View style={styles.MainContainer}>
            { renderContent &&
            <FlatList
                data={ data }
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={this.renderListItem}
                // ListHeaderComponent={this.render_FlatList_header}
                // ListFooterComponent={this.render_FlatList_footer}
                />
            }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer :{
        justifyContent: 'center',
        flex:1,
    },
        
    FlatList_Item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
        
    header_footer_style:{
        width: '100%', 
        height: 44, 
        backgroundColor: '#4CAF50', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    
    textStyle:{
        textAlign: 'center', 
        color: '#fff', 
        fontSize: 21
    }
});

const mapStateToProps = (state) => {
    console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(ListClassMemberPage);