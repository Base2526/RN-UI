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

import * as actions from '../../Actions'


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
                <Text style={{fontSize:18, fontWeight:'600', color:'white'}}>Add post</Text>
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
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleAddpost: this.handleAddpost })

        setTimeout(() => {this.setState({renderContent: true})}, 0);

        this.setState({
            data: [],
            error: null,
            loading: false,
            refreshing: false
        });

      // category_select
      const { navigation } = this.props;
      const category_select = navigation.getParam('category_select', null);
      
      // กรณีสร้าง application ใหม่
      let {application_category} = this.props.auth
      if(application_category != null){

        let newData = []
        Object.entries(application_category).forEach(([key, value]) => {
          newData.push(value)
        })

        this.setState({
          data: newData,
          category_select
        })
      }else{
        this.props.actionApplicationCategory().then((result) => {
  
          let newData = []
          Object.entries(result.data).forEach(([key, value]) => {
            newData.push(value)
          })
  
          this.setState({
            data: newData,
            category_select
          })
        })
      }
    }

    handleAddpost = () =>{
        this.props.navigation.navigate("MyApplicationAddPost")
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
        return( <View style={{flex:1, padding:10, backgroundColor:'white'}}>
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
    let {data} = this.state;
    return (
      <View style={{flex:1, backgroundColor: 'white'}}>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          onEndReachedThreshold={50}
          extraData={this.state}
        />

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
      </View>
    );
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
    // uid:getUid(state),
    auth:state.auth
  }
}

export default connect(mapStateToProps, actions)(MyApplicationMyPost)

