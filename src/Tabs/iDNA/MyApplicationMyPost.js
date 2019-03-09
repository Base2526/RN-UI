import React, { Component } from 'react';
import { View, 
        Text, 
        StyleSheet, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        TouchableHighlight,
        BackHandler,
        Modal,
        SafeAreaView,
     } from 'react-native';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modalbox from 'react-native-modalbox';
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');

import * as actions from '../../Actions'
import {makeUidState, 
        makeMyAppicationsState,} from '../../Reselect'


const images = [{
    url: 'https://hips.hearstapps.com/amv-prod-cad-assets.s3.amazonaws.com/images/13q1/494258/2013-lamborghini-aventador-lp700-4-roadster-first-drive-review-car-and-driver-photo-500213-s-original.jpg',
    source: {
        headers: {
            Authorization: `Bearer`
        }
    }
}, {
    url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527660246058&di=6f0f1b19cf05a64317cbc5d2b3713d64&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0112a85874bd24a801219c7729e77d.jpg'
}, {
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
    url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527660246058&di=6f0f1b19cf05a64317cbc5d2b3713d64&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0112a85874bd24a801219c7729e77d.jpg'
}]

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
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            category_select: null,

            modalVisible: false,
            index: 0,
            modalAction:false,
            sliderValue: 0.3,


            my_app_id:0,
            posts:[]
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleAddpost: this.handleAddpost })

        // setTimeout(() => {this.setState({renderContent: true})}, 0);

        this.setState({
            data: [],
            error: null,
            loading: false,
            refreshing: false
        });

        const { navigation } = this.props;
        const my_app_id = navigation.getParam('my_app_id', null);
      
        this.setState({my_app_id}, ()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData(props){
        let {my_app_id} = this.state

        let my_app  = _.find(props.my_applications, (v, k)=>{
                        return k == my_app_id
                      })

        console.log('my_app', my_app)

        if(!my_app){
            this.props.navigation.goBack(null)
        }
        let {posts} = my_app

        let arrayPost = _.map(posts, (v, k)=>{
                            return v
                        })

        // console.log('my_app', my_app, posts, arrayPost)

        this.setState({posts:arrayPost, renderContent: true})
    }

    handleAddpost = () =>{
        this.props.navigation.navigate("MyApplicationAddPost", {'app_id': this.state.my_app_id})
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
      );
    };
  
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
      );
    };

    renderItem = ({ item, index }) => {
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
            <View style={{position:'absolute', top:0, right:0}}>
                <TouchableOpacity
                    style={{padding:10}}
                    onPress={()=>{
                        // alert('ellipsis-n') // modalAction

                        // this.setState({modalAction:true})

                        this.refs.modalBox.open()
                    }}>
                    <Icon name="ellipsis-h" size={15} />
                </TouchableOpacity>
            </View>
        </View>
        <View style={{paddingBottom:10}}>
            <Text>I feel so relaxing to watch this video 🍉🔪☺
Credit: Yeshwanth's Kitchen (bit.ly/2R9Mw3Y)</Text>
        </View>
        <View style={{flex:1, height: 200, paddingBottom:10, }}>
            <View style={{flex:1, height: 200, paddingBottom:10, flexDirection:'row'}}>
                <View style={{flex:1, height: 100, paddingBottom:10}}>
                    <TouchableOpacity
                        style={{flex:1}}
                        onPress={()=>this.setState({ modalVisible: true })}>
                        <FastImage
                            style={{flex:1}}
                            source={{
                            uri: 'https://unsplash.it/400/400?image=1',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, height: 100, paddingBottom:10}}>
                    <TouchableOpacity
                        style={{flex:1}}
                        onPress={()=>this.setState({ modalVisible: true })}>
                        <FastImage
                            style={{flex:1}}
                            source={{
                            uri: 'https://unsplash.it/400/400?image=1',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex:1, height: 200, paddingBottom:10, flexDirection:'row'}}>
                <View style={{flex:1, height: 100, paddingBottom:10}}>
                    <TouchableOpacity
                        style={{flex:1}}
                        onPress={()=>this.setState({ modalVisible: true })}>
                        <FastImage
                            style={{flex:1}}
                            source={{
                            uri: 'https://unsplash.it/400/400?image=1',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, height: 100, paddingBottom:10}}>
                    <TouchableOpacity
                        style={{flex:1}}
                        onPress={()=>this.setState({ modalVisible: true })}>
                        <FastImage
                            style={{flex:1}}
                            source={{
                            uri: 'https://unsplash.it/400/400?image=1',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
            <View style={{padding:5}}>
                <TouchableOpacity
                    style={{width:25, height:25}}
                    onPress={()=>alert("like")}>
                    <Icon name="thumbs-up" size={25} />
                </TouchableOpacity>
            </View>
            <View style={{padding:5}}>
                <TouchableOpacity
                    style={{width:25, height:25}}
                    onPress={()=>{
                        this.props.navigation.navigate("Comment")

                    }}>
                    <Icon name="comment" size={25} />
                </TouchableOpacity>
            </View>
            <View style={{padding:5}}>
                <TouchableOpacity
                    style={{width:25, height:25}}
                    onPress={()=>alert("share")}>
                    <Icon name="share" size={25} />
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

        return (<View style={{flex:1, backgroundColor: 'white'}}>
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
                        <Modal visible={this.state.modalVisible} transparent={true}>
                                <ImageViewer 
                                    imageUrls={images}
                                    enableSwipeDown={true}
                                    enablePreload={true}
                                    // onClose={this.closeViewer.bind(this)}
                                    index={0}
                        
                                    onClick={(e, currentShowIndex)=>{
                                        console.log(e)
                                        console.log(currentShowIndex)
                                        // alert(currentShowIndex)

                                    }}
                                    onSwipeDown={() => {
                                        // console.log('onSwipeDown');
                                        this.setState({ modalVisible: false })
                                    }}
                                    renderHeader={(currentIndex)=>
                                        {
                                        return(<View style={{padding: 30, position:'absolute', top:0, right:0, zIndex: 50}}>
                                                    <TouchableOpacity
                                                        onPress={()=>this.setState({ modalVisible: false })} >
                                                        <Icon 
                                                            
                                                            name="times" 
                                                            color='white' 
                                                            size={30} />
                                                    </TouchableOpacity>
                                                </View>)
                                        }
                                    }
                                    renderFooter={(currentIndex)=>
                                        {
                                        return(
                                                <View style={{paddingBottom:30}}>
                                                    <View>
                                                        <Text style={{color:'white', fontSize:16}}>No mixing bowl necessary. Just a jar, a spoon, and a can-do attitude.

                Make Tastemade UK's Nutella Cookies 👉 https://bit.ly/2DPZWiS</Text>
                                                    </View>
                                                    <View >
                                                
                                                    <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                                                        <View style={{padding:5}}>
                                                            <TouchableOpacity
                                                                style={{width:25, height:25}}
                                                                onPress={()=> {
                                                                    alert('Like')
                                                                }}>
                                                                <Icon name="thumbs-up" size={25} color='white' />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{padding:5}}>
                                                            <TouchableOpacity
                                                                style={{width:25, height:25}}
                                                                onPress={()=>{
                                                                    alert('Comment')
                                                                }}>
                                                                <Icon name="comment" size={25} color='white' />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{padding:5}}>
                                                            <TouchableOpacity
                                                                style={{width:25, height:25}}
                                                                onPress={()=>{
                                                                    alert('Share')
                                                                }}>
                                                                <Icon name="share" size={25} color='white' />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                                </View>
                                                )
                                                
                                        }
                                    }
                                />
                            </Modal>
                            <SafeAreaView style={{flex:1}}>
                            <Modalbox style={{height:240, bottom:0, backgroundColor:'rgba(52,52,52,alpha)'}} position={"bottom"} ref={"modalBox"} coverScreen={true} onLayout={(event) => {
                                var {x, y, width, height} = event.nativeEvent.layout;
                                console.log("------> Modalbox")
                            }}>
                                {/* <View style={{alignItems:'center', height: 10}}>
                                    <Image
                                        style={{width: 150, borderRadius:5, backgroundColor:'white'}}
                                        source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                                        />
                                </View> */}
                                <View style={{height:60, backgroundColor:'white', justifyContent:'center'}}>
                                    <TouchableOpacity
                                        style={{padding:5}}>
                                        <Text style={{color: "black", fontSize: 22}}>test 1</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height:60, backgroundColor:'white', justifyContent:'center'}}>
                                    <TouchableOpacity
                                        style={{padding:5}}>
                                        <Text style={{color: "black", fontSize: 22}}>test 2</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height:60, backgroundColor:'white', justifyContent:'center'}}>
                                    <TouchableOpacity>
                                        <Text style={{color: "black", fontSize: 22}}>test 3</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height:60, backgroundColor:'white', justifyContent:'center'}}>
                                    <TouchableOpacity>
                                        <Text style={{color: "black", fontSize: 22}}>test 4</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modalbox>
                            </SafeAreaView>
                    
                </View>);
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
    my_applications:makeMyAppicationsState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(MyApplicationMyPost)

