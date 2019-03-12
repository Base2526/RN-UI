import React, { Component } from 'react';
import { View, 
        Text, 
        StyleSheet, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        TouchableHighlight,
        Linking,
        Alert,
        SafeAreaView,
     } from 'react-native';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';

import Share, {ShareSheet, Button} from 'react-native-share';

var _ = require('lodash');
import {
    MenuProvider,
    Menu,
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
  } from 'react-native-popup-menu';

import * as actions from '../../Actions'
import {makeUidState, 
        makeMyAppicationsPostsState,} from '../../Reselect'

import {getHeaderInset, isEmpty} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

let shareOptions = {
    title: "React Native",
    message: "Hola mundo",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link" //  for email
};

class MyApplicationMyPost extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "All post",
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
            // ios navigationoptions underline hide
            borderBottomWidth: 0,

            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
        headerRight: (
            <TouchableOpacity
                style={{marginRight:10}}
                onPress={() => {
                    const { params = {} } = navigation.state
                    params.handleAddpost()
                }}>
                <Text style={{fontSize:18, fontWeight:'600', color:'white'}}>Add new post</Text>
            </TouchableOpacity>
          ),
    })

    constructor(props) {
        super(props);
    
        this.state = {
            renderContent: false,
            loading: false,

            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            category_select: null,

            modalVisible: false,
            index: 0,
            modalAction:false,
            sliderValue: 0.3,

            app_id:0,
            posts:[]
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleAddpost: this.handleAddpost })
        const { navigation } = this.props;
        const app_id = navigation.getParam('app_id', null);
      
        this.setState({app_id}, ()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData(props){
        let {app_id} = this.state

        let posts  = _.find(props.my_applications_posts, (v, k)=>{
                        return k == app_id
                      })

        // console.log('posts', posts)
        let arrayPost = _.map(posts, (v, k)=>{
                            return {...v, post_id:k}
                        }).reverse();

        console.log('arrayPost', arrayPost)
        this.setState({posts:arrayPost, renderContent: true})
    }

    handleAddpost = () =>{
        this.props.navigation.navigate("MyApplicationAddPost", {'app_id': this.state.app_id, 'mode':'add'})
    }

    renderSeparator = () => {
      return (
        <View
          style={{
            height: .5,
            width: "100%",
            backgroundColor: "#CED0CE",
            // marginLeft: "14%"
          }}
        />
      )
    }
  
    renderFooter = () => {
      if (!this.state.loading) return null;
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}>
          <ActivityIndicator animating size="large" />
        </View>
      )
    }

    showMenu = (item)=>{
        return( <View style={{flex:1,
                              position:'absolute', 
                              top:0,
                              right:0, }}>
                  <Menu>
                    <MenuTrigger>
                        <MyIcon 
                            style={{padding:10}}
                            name={'dot-horizontal'}
                            size={15}
                            color={'gray'} />  
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: - getHeaderInset()}}>
                        <MenuOption onSelect={() => {
                            this.props.navigation.navigate("MyApplicationAddPost", {'app_id': this.state.app_id, 'mode':'edit', 'data':item})
                        }}>
                            <Text style={{padding:10, fontSize:18}}>Edit</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => {

                            // let {uid}    = this.props
                            let {app_id} = this.state            
                            let {post_id, creator} = item

                            // console.log('actionDeletePost', creator, app_id, post_id)

                            Alert.alert(
                                'Delete post',
                                'Are you sure delete?',
                                [
                                  // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                  {text: 'Cancel', 
                                    onPress: () => {
                                        console.log("cancel")
                                        }, style: 'cancel'},
                                  {text: 'OK', 
                                  onPress: () => {
                                      // export const actionDeletePost = (uid, app_id, post_id, callback)
                                        this.setState({loading:true})
                                        this.props.actionDeletePost(creator, app_id, post_id, (result)=>{
                                            // console.log(result)
                                            this.setState({loading:false})
                                        })
                                    }, 
                                  },
                                ],
                                { cancelable: false }
                            )

                        }}>
                            <Text style={{padding:10, fontSize:18}}>Delete</Text>
                        </MenuOption>

                        <MenuOption onSelect={() => {
                             this.props.navigation.navigate("MyApplicationReport")
                        }}>
                            <Text style={{padding:10, fontSize:18}}>Report</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
              </View>)
    }

    listImages = (images) =>{
        if(isEmpty(images) ){
            return;
        }

        return  _.map(images, (v, k)=>{
                    console.log('cccv', v)
                    return(<FastImage
                            key={k}
                            style={{width:40, height:40}}
                            source={{
                                uri: v ? v.image_url :'',
                                headers:{ Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            />)
                })
    }

    isLikeAndCount = (item) =>{
        let {uid}   = this.props
        let {likes} = item

        let is_like =   _.find(likes, (v, k)=>{
                            return k = uid && v.status
                        })
        
        let count   =   _.filter(likes, (v, k)=>{
                            return v.status
                        })

        if(is_like){
            return( <View>
                        <Icon name="thumbs-up" size={25} color={'red'} />
                        <Text>{count.length}</Text>
                    </View>)
        }else{
            return( <View>
                        <Icon name="thumbs-up" size={25} color={'gray'} />
                        <Text>{count.length}</Text>
                    </View>)
        }
    }

    renderItem = ({ item, index }) => {
        // console.log('item>', item)
        return( <View style={{flex:1, padding:10, backgroundColor:'white'}} key={index}>
                    <View style={{flexDirection:'row', paddingBottom:5}}>
                        <TouchableOpacity
                            style={{width:40, height:40, borderRadius:20}}
                            onPress={()=>{
                                this.props.navigation.navigate("MyProfilePage")
                            }}>
                            <FastImage
                                style={{width:40, height:40, borderRadius:20}}
                                source={{
                                    uri: 'https://unsplash.it/400/400?image=1',
                                    headers:{ Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        </TouchableOpacity>
                        <View style={{paddingLeft:10}}>
                            <Text style={{fontSize:14}}>mr.somkid simajarn</Text>
                            <Text style={{fontSize:10, color:'gray'}}>2009-11-06 07:03:41</Text>
                        </View>
                        {this.showMenu(item)}
                    </View>
                    <View style={{paddingBottom:10}}>
                        <Text>{item.text}</Text>
                    </View>
                    <View style={{flex:1, paddingBottom:10, }}>
                        {this.listImages(item.images ? item.images : {})}
                    </View>
                    <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                        <View style={{padding:10}}>
                            <TouchableOpacity
                                style={{width:25, height:25}}
                                onPress={()=>{
                                    // console.log('actionLikePost', item)

                                    let {app_id} = this.state
                                    let {uid}    = this.props
                                    // item.post_id

                                    let {post_id, creator, likes} = item
                                    
                                    if(!isEmpty(likes)){
                                        let like =  _.find(likes, (v, k)=>{
                                                        return k == uid
                                                    })

                                        this.props.actionLikePost(creator, uid, app_id, post_id, !like.status, (result) => {
                                            console.log(result)
                                        })
                                    }else{
                                        this.props.actionLikePost(creator, uid, app_id, post_id, true, (result) => {
                                            console.log(result)
                                        })
                                    }
                                }}>
                               
                                {this.isLikeAndCount(item)}
                            </TouchableOpacity>
                        </View>
                        <View style={{padding:10}}>
                            <TouchableOpacity
                                style={{width:25, height:25}}
                                onPress={()=>{
                                    Share.open(shareOptions);
                                }}>
                                <Icon name="share" size={25} />
                                {/* <Text>100</Text> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>)
    }
    
    render() {
        let {renderContent, posts} = this.state

        if(!renderContent){
            return( <View style={{flex:1}}>
                     <Spinner
                        visible={true}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                        />
                    </View>)
        }

        if(posts.length == 0){
            return( <View style={{flex:1}}>
                        <Text>Empty post</Text>
                    </View>)
        }

        return (<MenuContext>
                    <View style={{flex:1, backgroundColor: 'white'}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={'Wait...'}
                            textStyle={{color: '#FFF'}}
                            overlayColor={'rgba(0,0,0,0.5)'}/>
                            <FlatList
                                data={posts}
                                renderItem={this.renderItem}
                                // keyExtractor={item => item.name}
                                keyExtractor = { (item, index) => index.toString() } 
                                ItemSeparatorComponent={this.renderSeparator}
                                ListFooterComponent={this.renderFooter}
                                onEndReachedThreshold={50}
                                extraData={this.state}/>
                    </View>
                </MenuContext>);
    }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    // uid:getUid(state),
    auth:state.auth,

    uid:makeUidState(state, ownProps),
    my_applications_posts:makeMyAppicationsPostsState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(MyApplicationMyPost)

