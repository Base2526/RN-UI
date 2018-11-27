import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        Platform, 
        TouchableOpacity,
        ActivityIndicator,
        Modal,
        SafeAreaView} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'

import ImageViewer from 'react-native-image-zoom-viewer';

// const images = [
//     {
//       // Simplest usage.
//       url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
//       // url:
//       // "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527660246058&di=6f0f1b19cf05a64317cbc5d2b3713d64&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0112a85874bd24a801219c7729e77d.jpg",
//       // You can pass props to <Image />.
//       // props: {
//       //   // headers: ...
//       //   source: require('./img.png')
//       // },
//       source: {
//         headers: {
//             Authorization: `Bearer`
//         }
//       },
//       freeHeight: true
//     },
//     {
//       // Simplest usage.
//       // url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
//       url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527660246058&di=6f0f1b19cf05a64317cbc5d2b3713d64&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0112a85874bd24a801219c7729e77d.jpg",
//       // You can pass props to <Image />.
//       // props: {
//       //   // headers: ...
//       //   source: require('./img.png')
//       // },
  
//       source: {
//         headers: {
//             Authorization: `Bearer`
//         }
//       },
//       freeHeight: true
//     },
//     {
//       // Simplest usage.
//       // url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
//       url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527660246058&di=6f0f1b19cf05a64317cbc5d2b3713d64&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0112a85874bd24a801219c7729e77d.jpg",
//       // You can pass props to <Image />.
//       // props: {
//       //   // headers: ...
//       //   source: require('./img.png')
//       // },
  
//       source: {
//         headers: {
//             Authorization: `Bearer`
//         }
//       },
//       freeHeight: true
//     },
//     {
//       // Simplest usage.
//       // url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
//       url:"https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/body-image/public/mclaren-720s_0.jpg?itok=wZbSZ3FZ",
//       // You can pass props to <Image />.
//       // props: {
//       //   // headers: ...
//       //   source: require('./img.png')
//       // },
  
//       source: {
//         headers: {
//             Authorization: `Bearer`
//         }
//       },
//       freeHeight: true
//     }
  
//   ];

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
  
export default class ApplicationDetailPage extends React.Component{

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
            modalVisible: false,
            index: 0,
            FlatListItems: [
                {key: 'Apple'},
                {key: 'Apricot'},
                {key: 'Avocado'},
                {key: 'Banana'},
                {key: 'Blackberry'},
                {key: 'Blackcurrant'},
                {key: 'Blueberry'},
                {key: 'Boysenberry'},
                {key: 'Cherry'}
            ]
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);
    }

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#607D8B",
            }}
          />
        );
    }

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
                        onPress={()=>{
                            
                        }}>
                        <FastImage
                            style={{width: 60, height: 60, borderRadius: 10}}
                            source={{
                            uri: 'https://unsplash.it/400/400?image=1',
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableOpacity>
                    <View style={{paddingLeft:10}}>
                        <Text>App Name : name application</Text>
                        <Text>Followers</Text>
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
                                onPress={()=>alert('menu')}>
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

    // renderModel = () =>{
    //     console.log("renderModel" + this.state.modalVisible)
    //     return(
    //     )
    // }

    _itemClick(index){
        alert("_itemClick : " + index)
    }

    render() {
        console.log("renderModel" + this.state.modalVisible)
        let {
            renderContent
          } = this.state;

        if(!renderContent){
            return (
                <View style={styles.MainContainer}>
                    <ActivityIndicator size="large"/>
                </View>)
        }
        
        return (
          <View style={styles.MainContainer}>
          { renderContent &&
            <FlatList
                data={ this.state.FlatListItems }
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={this.renderListItem}
                ListHeaderComponent={this.render_FlatList_header}
                // ListFooterComponent={this.render_FlatList_footer}
                />
          }
            
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
                                <View style={{position:'absolute', bottom:0, padding: 30}}>
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
                                                    // this.setState({ modalVisible: false }) 
                                                }}>
                                                <Icon name="thumbs-up" size={25} color='white' />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{padding:5}}>
                                            <TouchableOpacity
                                                style={{width:25, height:25}}
                                                onPress={()=>{
                                                    // this.setState({ modalVisible: false })
                                                }}>
                                                <Icon name="comment" size={25} color='white' />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{padding:5}}>
                                            <TouchableOpacity
                                                style={{width:25, height:25}}
                                                onPress={()=>{
                                                    // this.setState({ modalVisible: false })
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
            {/* <View
                style={{
                padding: 10,
                
                }}>
                <Modal
                visible={this.state.modalVisible}
                // transparent={true}
                onRequestClose={() => this.setState({ modalVisible: false })}
                >
                <ImageViewer
                    imageUrls={images}
                    index={this.state.index}
                    onSwipeDown={() => {
                        console.log('onSwipeDown');
                        this.setState({ modalVisible: false })
                    }}
                    onCancel={() => {
                        console.log('onCancel');
                        return true
                    }}
                    enableSwipeDown={true}
                    enablePreload={true}
                    // backgroundColor="red"
                    // renderHeader={(currentIndex)=>
                    // {
                    // return(<View style={{backgroundColor:'transparent', marginTop:50}}>
                    //         <Text style={{color:"red"}}>Picture index = {currentIndex}</Text>
                    //         </View>)
                    // }
                // }
                    renderFooter={(currentIndex)=>
                        {
                        return(<View style={{paddingBottom: 100}}>
                                    <Icon onPress={this._itemClick.bind(this, currentIndex)} name="heart" size={30} />
                                </View>)
                        }
                    }
                    onClick={(e, currentShowIndex)=>{
                        console.log(e)
                        console.log(currentShowIndex)
                    }}
                    onLongPress={()=>{alert('onLongPress')}}
                />
                </Modal>
            </View> */}
          </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer :{
        justifyContent: 'center',
        flex:1,
        // paddingTop: (Platform.OS === 'iOS') ? 20 : 0
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