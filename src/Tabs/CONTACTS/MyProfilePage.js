import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        Platform, 
        TouchableOpacity,
        ScrollView,
        Image} from 'react-native'

import { Header } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'

import { isIphoneX } from 'react-native-iphone-x-helper';

import { Cell, Section, TableView } from 'react-native-tableview-simple';

import {getStatusBarHeight} from '../../Utils/Helpers'

import BackgroundImage from '../../test/image-with-text'

import ImageWithDefault from '../../Utils/ImageWithDefault'

export default class MyProfilePage extends React.Component{

    /*
    static navigationOptions = { headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 } };
     */
    
    static navigationOptions = ({ navigation }) => ({
        title: "Contacts",
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        // header:{ style:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 } },
        // headerStyle: {style:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 }},
        /*
        headerRight: (
            <TouchableOpacity
                // style={Styles.headerButton}
                style={{marginRight:5}}
                onPress={() => {
                    // const { params = {} } = navigation.state
                    // params.handleHeaderRight()

                    alert('share')
                } }>
                <Icon name="share-alt-square" size={25} />
            </TouchableOpacity>
        ),
        */
    });

//    static navigationOptions = ({navigation}) => { return { headerTitle: <Text style={{color: 'white', fontSize: 18}}>Test</Text>, headerTransparent: true, headerStyle: { borderBottomWidth: 0, } } }

    constructor(){
        super();
    
        this.state = { 
            renderContent: false,
            FlatListItems: [
                {key: '1'},
                {key: '2'},
                {key: '3'},
                {key: '4'},
                {key: '5'}
            ]
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
      return Platform.select({
        ios: {
          contentInset: { top: HEADER_HEIGHT },
          contentOffset: { y: -HEADER_HEIGHT },
        },
        android: {
          contentContainerStyle: {
            paddingTop: HEADER_HEIGHT,
          },
        },
      });
    }

    ///

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

        let {
            renderContent
            } = this.state;

        const resizeMode = 'center';

        return (
            <ScrollView style={{ flex: 1,}}>
            <View style={{flex:1, backgroundColor:'gray'}}>
                {/* <ImageBackground source={require('../../Images/__bg.png')}  style={{width: '100%', height: '100%'}}> */}
                <BackgroundImage style={{paddingTop:this.getHeaderInset()}}>
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
                </BackgroundImage>
                {/* <FlatList
                        data={ this.state.FlatListItems }
                        ItemSeparatorComponent = {this.FlatListItemSeparator}
                        renderItem={this.renderListItem}
                        ListHeaderComponent={this.render_FlatList_header}
                        // ListFooterComponent={this.render_FlatList_footer}
                        /> */}
                <View style={{ flex:1}}>
                <TableView >
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
                            <View
                                style={{ alignItems: 'center', justifyContent:'center', flex: 1}}
                            >
                                <Text
                                // allowFontScaling
                                // numberOfLines={1}
                                style={{ fontSize: 20, }}
                                >
                                Kong
                                </Text>
                            </View>
                        }
                        />
                        <Cell
                            cellStyle="Basic"
                            title="Try sharing your profile"
                        />
                    </Section>

                    <Section
                        sectionPaddingTop={5}
                        sectionPaddingBottom={0}
                        separatorInsetLeft={0}>
                        <Cell
                        // title="Help / FAQ" marginTop: 5,
                        cellStyle="Basic"
                        titleTextColor="#007AFF"
                        contentContainerStyle={{ paddingVertical: 4 }} 
                        onPress={() => console.log("open Help/FAQ")}
                        cellContentView={
                            <View
                                style={{ alignItems: 'center', flexDirection:'row', flex: 1, }}>
                                <TouchableOpacity
                                    style={{height:60,
                                            width: 60,
                                            borderRadius: 30,
                                            
                                            backgroundColor:'blue'
                                            }}        
                                    >
                                    <ImageWithDefault 
                                        source={{uri: 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t1.0-9/49682566_926064284253361_1603030473750085632_n.jpg?_nc_cat=107&_nc_ht=scontent.fbkk8-2.fna&oh=393d859cd955afe7d6e8f2053c4f5116&oe=5C906265'}}
                                        style={{width: 60, height: 60, borderRadius: 30, }}
                                    />      
                                </TouchableOpacity>
                                <View style={{paddingLeft:10}}>
                                <Text>
                                    device account
                                </Text>
                                <Text
                                    // allowFontScaling
                                    // numberOfLines={1}
                                    style={{ fontSize: 20, }}
                                    >
                                    Android.somkid@gmail.com
                                </Text>
                                </View>
                            </View>
                        }
                        />
                        {/* <Cell
                            cellStyle="Basic"
                            title="Try sharing your profile"
                        /> */}
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
                            hideSeparator={true}
                            cellContentView={
                                <Text style={{ flex: 1, fontSize: 18, }}>
                                  MY INFO
                                </Text>
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
                                </View>
                              }
                        />
                    </Section>
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
                </TableView>
                </View>
            </View>
            </ScrollView> 
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