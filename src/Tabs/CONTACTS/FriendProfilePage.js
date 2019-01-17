import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        Platform, 
        TouchableOpacity,
        ScrollView,
        SafeAreaView,
        Image} from 'react-native'

import { Header } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

var _ = require('lodash');

import {getStatusBarHeight} from '../../Utils/Helpers'
import FriendBackgroundImage from '../../test/friend-image-with-text'
import ImageWithDefault from '../../Utils/ImageWithDefault'
import * as actions from '../../Actions'

class FriendProfilePage extends React.Component{

    /*
    static navigationOptions = { headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 } };
     */
    
    static navigationOptions = ({ navigation }) => ({
        // title: "Contacts",
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        headerTintColor: 'white',
        // header:{ style:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 } },
        // headerStyle: {style:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 }},
    
        headerRight: (
            // <TouchableOpacity
            //     // style={Styles.headerButton}
            //     style={{marginRight:5}}
            //     onPress={() => {
            //         // const { params = {} } = navigation.state
            //         // params.handleHeaderRight()

            //         alert('share')
            //     } }>
            //     <Icon name="share-alt-square" size={25} />
            // </TouchableOpacity>
            <View style={{flexDirection:'row', flex:1}}>
                {/* <TouchableOpacity style={{paddingRight:10}}>
                    <Text style={{color:'gray', fontSize:16, borderWidth: 1, borderColor: '#000', borderRadius: 12, padding: 8, overflow:"hidden",}}>EDIT</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={{paddingRight:10}}>
                    <Text style={{color:'white', fontSize:16, borderWidth: 1, borderColor: 'gray', borderRadius: 12, padding: 8, overflow:"hidden",}}>SHARE</Text>
                </TouchableOpacity>
            </View>
        ),
    });

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
        }
    }


    // https://github.com/react-navigation/react-navigation/blob/master/examples/NavigationPlayground/js/StackWithTranslucentHeader.js
    // Inset to compensate for navigation bar being transparent.
    // And improved abstraction for this will be built in to react-navigation
    // at some point.
    getHeaderInset() {
        const NOTCH_HEIGHT = isIphoneX() ? 25 : 0;
  
        // $FlowIgnore: we will remove the HEIGHT static soon enough
        const BASE_HEADER_HEIGHT = Header.HEIGHT;
  
        const HEADER_HEIGHT =
        Platform.OS === 'ios'
          ? BASE_HEADER_HEIGHT + NOTCH_HEIGHT
          : BASE_HEADER_HEIGHT + getStatusBarHeight();
  
          console.log("HEADER_HEIGHT : " , HEADER_HEIGHT)
        return HEADER_HEIGHT
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
                        <Text>Name : Somkid</Text>
                        <Text>Subname : Simajarn</Text>
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
        console.log(item)

        switch(item.key){
            case '1':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>My ID: XUYDDE</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
            case '2':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>Messages: xx-xxx</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
            case '3':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>Address: test test</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
            case '4':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>Email: Not email</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
            case '5':
            {
                return( <View style={{flex:1, height:60, padding:10, backgroundColor:'white', justifyContent:'center'}}>
                    <Text style={{fontSize:18}}>Phones: Not phone</Text>
                    <FastImage
                        style={{width: 20, height: 20, position:'absolute', right:0}}
                        source={require('../../Images/disclosure_indicator.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>)
            }
            break
        }
    }

    render() {

        const { navigation } = this.props;
        const friend_id = navigation.getParam('friend_id', null);

        let {renderContent} = this.state;

        let friends = this.props.auth.users.friends;

        let friend = null
        _.each(friends, function(_v, _k) { 
            // console.log(_v," | ",_k)
            if(friend_id === _k){
                friend = _v
            }
        });

        console.log(friend)

        const resizeMode = 'center';
        return (
            // <SafeAreaView style={{flex:1}}>
                <ScrollView style={{ flex: 1,}}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    {/* <ImageBackground source={require('../../Images/__bg.png')}  style={{width: '100%', height: '100%'}}> */}
                    <FriendBackgroundImage style={{paddingTop:this.getHeaderInset()}} auth={this.props.auth} friend={friend}>
                        {/* <View style={{height:1200}}> */}
                        { 
                            // renderContent &&
                        // <FlatList
                        //     data={ this.state.FlatListItems }
                        //     ItemSeparatorComponent = {this.FlatListItemSeparator}
                        //     renderItem={this.renderListItem}
                        //     ListHeaderComponent={this.render_FlatList_header}
                        //     // ListFooterComponent={this.render_FlatList_footer}
                        //     />
                        // <Text>Text</Text>
                        }
                        {/* </View> */}
                    </FriendBackgroundImage>
                    {/* <FlatList
                            data={ this.state.FlatListItems }
                            ItemSeparatorComponent = {this.FlatListItemSeparator}
                            renderItem={this.renderListItem}
                            ListHeaderComponent={this.render_FlatList_header}
                            // ListFooterComponent={this.render_FlatList_footer}
                            /> */}
                    <View style={{ flex:1}}>
                    <TableView >

                        {/* 
                        
                        <View style={{position:'absolute', right:0, bottom:0, flexDirection:'row'}}>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                        </View>
                        
                        */}

                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                // title="Help / FAQ"
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                onPress={() => console.log("open Help/FAQ")}
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                                        <TouchableOpacity
                                            style={{height:60,
                                                    width:60,
                                                    borderRadius: 30,
                                                    margin:5,
                                                    backgroundColor:'blue'
                                                    }}        
                                            >
                                            <ImageWithDefault 
                                                source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                style={{width: 60, height: 60, borderRadius: 30, }}
                                            />      
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{height:60,
                                                    width:60,
                                                    borderRadius: 30,
                                                    margin:5,
                                                    backgroundColor:'blue'
                                                    }}        
                                            >
                                            <ImageWithDefault 
                                                source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                style={{width: 60, height: 60, borderRadius: 30, }}
                                            />      
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{height:60,
                                                    width:60,
                                                    borderRadius: 30,
                                                    margin:5,
                                                    backgroundColor:'blue'
                                                    }}        
                                            >
                                            <ImageWithDefault 
                                                source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                style={{width: 60, height: 60, borderRadius: 30, }}
                                            />      
                                        </TouchableOpacity>
                                    </View>
                                }
                            />
                        </Section>
                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                // title="Help / FAQ"
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                onPress={() => console.log("open Help/FAQ")}
                                cellContentView={
                                <View style={{flex:1, flexDirection:'row'}}>
                                    <Text
                                    // allowFontScaling
                                    // numberOfLines={1}
                                    style={{flex:1, fontSize: 18,  }}>
                                    Basic Info
                                    </Text>
                                    {/* <View style={{flex:1, alignItems: 'flex-end', justifyContent:'center'}}>
                                        <TouchableOpacity
                                        onPress={()=>alert('edit')}>
                                            <Text
                                                // allowFontScaling
                                                // numberOfLines={1}
                                                style={{ fontSize: 14, }}>
                                                EDIT
                                            </Text>
                                        </TouchableOpacity>
                                    </View> */}
                                </View>
                            }
                            />
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                            Name Subname
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                {friend.profile.name}
                                            </Text>
                                        </View>
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Status message
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                The most valuable lessons in life cannot be taught, they must be experienced.
                                            </Text>
                                        </View>
                                        
                                    </View>
                                }
                            />
                             <Cell
                                // title="Help / FAQ"
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                hideSeparator={true} 
                                onPress={() => {
                                    alert
                                }}
                                cellContentView={
                                <View style={{flex:1, flexDirection:'row'}}>
                                    <Text
                                    // allowFontScaling
                                    // numberOfLines={1}
                                    style={{flex:1, fontSize: 18,  }}>
                                    Classs
                                    </Text>
                                    <View style={{flex:1, alignItems: 'flex-end', justifyContent:'center'}}>
                                        <TouchableOpacity
                                        onPress={()=>alert('edit')}>
                                            <Text
                                                // allowFontScaling
                                                // numberOfLines={1}
                                                style={{ fontSize: 14, }}>
                                                Friend
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                            />
                            
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                My ID
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                XUASDFOPMNBSSS
                                            </Text>
                                        </View>
                                        
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Gender
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                Male
                                            </Text>
                                        </View>
                                        
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Birthday
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                January 4, 1983
                                            </Text>
                                        </View>
                                        
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Interested In
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                Women
                                            </Text>
                                        </View>
                                        
                                    </View>
                                }
                            />
                        </Section>

                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}
                            // contentContainerStyle={{ paddingVertical: 4 }} 
                            >
                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{ }} 
                                hideSeparator={false}
                                cellContentView={
                                    // <Text style={{ flex: 1, fontSize: 18, }}>
                                    //   Contact Info
                                    // </Text>
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Text
                                        // allowFontScaling
                                        // numberOfLines={1}
                                        style={{flex:1, fontSize: 18,  }}>
                                        Contact Info
                                        </Text>
                                        {/* <View style={{flex:1, alignItems: 'flex-end', justifyContent:'center'}}>
                                            <TouchableOpacity
                                            onPress={()=>alert('edit')}>
                                                <Text
                                                    // allowFontScaling
                                                    // numberOfLines={1}
                                                    style={{ fontSize: 14, }}>
                                                    EDIT
                                                </Text>
                                            </TouchableOpacity>
                                        </View> */}
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{  }} 
                                hideSeparator={true}
                                // contentContainerStyle={{ paddingVertical: 10 }} 
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Mobile
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                0988264820
                                            </Text>
                                        </View>
                                        { /*
                                        <View style={{position:'absolute', right:0, bottom:0, flexDirection:'row'}}>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                        </View>
                                        */ }
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{ }} 
                                hideSeparator={true}
                                // contentContainerStyle={{ paddingVertical: 10 }} 
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Home
                                            </Text>
                                            <Text style={{ fontSize:18}}>
                                                0988264820
                                            </Text>
                                        </View>
                                        {/*
                                        <View style={{position:'absolute', right:0, bottom:0, flexDirection:'row'}}>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{height:25,
                                                        width: 25,
                                                        borderRadius: 30,
                                                        margin:5,
                                                        backgroundColor:'blue'
                                                        }}        
                                                >
                                                <ImageWithDefault 
                                                    source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                                    style={{width: 25, height: 25, borderRadius: 30, }}
                                                />      
                                            </TouchableOpacity>
                                        </View>
                                        */ }
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{ }} 
                                hideSeparator={true}
                                // contentContainerStyle={{ paddingVertical: 10 }} 
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Address
                                            </Text>
                                            <Text style={{ fontSize:18}}>
                                            ซอยสุขสวัสดิ์ 26 บางปะกอก
                                            </Text>
                                        </View>
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                // title="MY INFO"
                                contentContainerStyle={{ }} 
                                hideSeparator={true}
                                // contentContainerStyle={{ paddingVertical: 10 }} 
                                cellContentView={
                                    <View style={{flex:1, marginBottom:10}}>
                                        <View >
                                            <Text style={{ }}>
                                            Website
                                            </Text>
                                            <Text style={{ fontSize:18}}>
                                            www.klovers.org
                                            </Text>
                                        </View>
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ }}>
                                                Email
                                            </Text>
                                            <Text style={{ fontSize:18 }}>
                                                android.somkid@gmail.com
                                            </Text>
                                        </View>
                                        
                                    </View>
                                }
                            />
                        </Section>
                        { /*
                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={5}
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Basic"
                                // title="EMAIL"
                                contentContainerStyle={{ }} 
                                cellContentView={
                                    <Text style={{fontSize:18}}>EMAIL</Text>
                                }/>
                            <Cell
                                cellStyle="Basic"
                                // title="Website"
                                contentContainerStyle={{ }}
                                cellContentView={
                                    <Text style={{fontSize:18}}>Website</Text>
                                } />
                            <Cell
                                cellStyle="Basic"
                                // title="Address"
                                contentContainerStyle={{ }} 
                                cellContentView={
                                    <Text style={{fontSize:18}}>Address</Text>
                                } />
                            <Cell
                                cellStyle="Basic"
                                // title="Social"
                                contentContainerStyle={{ }} 
                                cellContentView={
                                    <Text style={{fontSize:18}}>Social</Text>
                                } />
                        </Section>
                        */ }
                        
                        {/*
                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={5}
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Basic"
                                // title="EMAIL"
                                contentContainerStyle={{ }} 
                                cellContentView={
                                    <Text style={{fontSize:18}}>EMAIL</Text>
                                }/>
                            <Cell
                                cellStyle="Basic"
                                // title="Website"
                                contentContainerStyle={{ }}
                                cellContentView={
                                    <Text style={{fontSize:18}}>Website</Text>
                                } />
                            <Cell
                                cellStyle="Basic"
                                // title="Address"
                                contentContainerStyle={{ }} 
                                cellContentView={
                                    <Text style={{fontSize:18}}>Address</Text>
                                } />
                            <Cell
                                cellStyle="Basic"
                                // title="Social"
                                contentContainerStyle={{ }} 
                                cellContentView={
                                    <Text style={{fontSize:18}}>Social</Text>
                                } />
                        </Section>
                        */ }
                    </TableView>
                    </View>
                </View>
                </ScrollView> 
            // </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    
    MainContainer :{
    
    justifyContent: 'center',
    // flex:1,
    backgroundColor:'red'
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

const mapStateToProps = (state) => {
    console.log(state)
  
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
      return {}
    }

    console.log(this)
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(FriendProfilePage);