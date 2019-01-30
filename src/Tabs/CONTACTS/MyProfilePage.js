import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        Platform, 
        TouchableOpacity,
        ScrollView,
        SafeAreaView,} from 'react-native'

import { Header } from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Share, {ShareSheet, Button} from 'react-native-share';

import {getStatusBarHeight} from '../../Utils/Helpers'
import BackgroundImage from '../../test/image-with-text'
import ImageWithDefault from '../../Utils/ImageWithDefault'
import * as actions from '../../Actions'

import Image from 'react-native-remote-svg'



let shareOptions = {
    title: "React Native",
    message: "Hola mundo",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link" //  for email
};

class MyProfilePage extends React.Component{

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

                <TouchableOpacity style={{paddingRight:10}}
                onPress={()=>{
                    const { params = {} } = navigation.state
                    params.handleEdit()
                }}>
                    {/* <Text style={{color:'white', fontSize:16, borderWidth: 1, borderColor: 'gray', borderRadius: 12, padding: 8, overflow:"hidden",}}>SHARE</Text> */}

                    {/* <Image
                    style={{ width: 25, height: 25}}
                    // require('../Images/icon-tab-contacts.svg')
                    source={require('../../Images/icon-edit.svg')}
                    /> */}

                    <Image
                        style={{ width: 25, height: 25}}
                        source={{uri:`data:image/svg+xml;utf8,<svg id="edit" xmlns="http://www.w3.org/2000/svg" width="17.112" height="18.375" viewBox="0 0 17.112 18.375">
                        <path id="Path_1826" data-name="Path 1826" d="M1615.187,647.961h-5.3a2.918,2.918,0,0,1-.8-.094,1.639,1.639,0,0,1-1.214-1.442,3.852,3.852,0,0,1-.021-.406q0-4.9,0-9.8a2.453,2.453,0,0,1,.084-.714,1.61,1.61,0,0,1,1.214-1.151,2.773,2.773,0,0,1,.715-.078h4.881c.219,0,.437,0,.656,0a.51.51,0,0,1,.5.321.54.54,0,0,1-.1.586.906.906,0,0,1-.786.352c-1.714-.013-3.429-.006-5.143-.006a1.846,1.846,0,0,0-.378.031.4.4,0,0,0-.37.381,1.2,1.2,0,0,0-.018.222q0,4.954,0,9.906a1.135,1.135,0,0,0,.045.336.342.342,0,0,0,.216.23,1.36,1.36,0,0,0,.4.072c.039,0,.079,0,.118,0h10.628a1.873,1.873,0,0,0,.416-.045.393.393,0,0,0,.329-.359,1.732,1.732,0,0,0,.02-.248q0-3.733,0-7.466a.629.629,0,0,1,.239-.515,2.208,2.208,0,0,1,.189-.142.528.528,0,0,1,.817.4c.006.083.009.166.009.249q0,3.713,0,7.426a2.592,2.592,0,0,1-.049.587,1.623,1.623,0,0,1-1.282,1.29,2.941,2.941,0,0,1-.716.068Z" transform="translate(-1607.846 -629.586)" fill="#c7d8dd" fill-rule="evenodd"/>
                        <path id="Path_1827" data-name="Path 1827" d="M1649.507,623.621a.988.988,0,0,1,.144-.5,4.127,4.127,0,0,1,.5-.692q1.122-1.31,2.246-2.618,1.67-1.945,3.339-3.892a.37.37,0,0,1,.5-.1,1.938,1.938,0,0,1,.34.222,15.684,15.684,0,0,1,1.922,1.682.827.827,0,0,1,.149.2.341.341,0,0,1-.044.412c-.262.3-.519.6-.778.905q-2.38,2.771-4.761,5.542a5.23,5.23,0,0,1-.626.634,1.237,1.237,0,0,1-.367.225.581.581,0,0,1-.613-.1l-1.732-1.486A.553.553,0,0,1,1649.507,623.621Z" transform="translate(-1643.138 -613.905)" fill="#c7d8dd" fill-rule="evenodd"/>
                        <path id="Path_1828" data-name="Path 1828" d="M1699.115,605.779a.762.762,0,0,1-.152.466c-.177.263-.4.488-.595.731a.522.522,0,0,1-.094.09.318.318,0,0,1-.47-.018c-.226-.205-.448-.416-.668-.629a12.737,12.737,0,0,0-1.155-.967c-.146-.111-.289-.226-.433-.34a.323.323,0,0,1-.062-.515,5,5,0,0,1,.623-.707.374.374,0,0,0,.04-.034.791.791,0,0,1,.7-.253,1.7,1.7,0,0,1,.426.069,2.577,2.577,0,0,1,1.111.617,2.611,2.611,0,0,1,.683,1.132A1.189,1.189,0,0,1,1699.115,605.779Z" transform="translate(-1682.003 -603.602)" fill="#c7d8dd" fill-rule="evenodd"/>
                        <path id="Path_1829" data-name="Path 1829" d="M1647.4,677.429c-.092,0-.183,0-.275,0a.3.3,0,0,1-.291-.236,5.463,5.463,0,0,1-.086-.622.7.7,0,0,1,.086-.376.273.273,0,0,1,.321-.14.6.6,0,0,1,.208.107,6.231,6.231,0,0,1,.675.58.764.764,0,0,1,.124.152.286.286,0,0,1-.1.4.715.715,0,0,1-.417.129h-.249Z" transform="translate(-1640.798 -664.97)" fill="#c7d8dd" fill-rule="evenodd"/>
                      </svg>                                                    
                        `}} />
                </TouchableOpacity>

                <TouchableOpacity style={{paddingRight:10}}
                onPress={()=>{
                    const { params = {} } = navigation.state
                    params.handleShare()
                }}>
                    {/* <Text style={{color:'white', fontSize:16, borderWidth: 1, borderColor: 'gray', borderRadius: 12, padding: 8, overflow:"hidden",}}>SHARE</Text> */}

                    {/* <Image
                    style={{ width: 25, height: 25}}
                    // require('../Images/icon-tab-contacts.svg')
                    source={require('../../Images/icon-share.svg')}
                    /> */}

                    <Image
                        style={{ width: 25, height: 25}}
                        source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16.114" height="16.523" viewBox="0 0 16.114 16.523">
                        <path id="share" d="M2038.028,630.27a.314.314,0,0,0,.1.06l5.086,2.455c.1.05.084.06.165-.031a2.927,2.927,0,0,1,5.127,2.054,2.927,2.927,0,1,1-5.723-.982c0-.014.008-.027.012-.041.024-.083.025-.084-.057-.124l-5.172-2.5c-.107-.052-.086-.046-.16.028a2.843,2.843,0,0,1-1.607.832,2.928,2.928,0,0,1-1.942-5.423,2.855,2.855,0,0,1,1.77-.378,2.885,2.885,0,0,1,1.88.96c.081.089.081.089.189.033l4.5-2.346a.24.24,0,0,1,.028-.015c.051-.019.067-.047.05-.105a2.591,2.591,0,0,1-.1-.79,2.928,2.928,0,0,1,2.646-2.861,2.927,2.927,0,0,1,2.162,5.156,2.841,2.841,0,0,1-2.072.677,2.871,2.871,0,0,1-2.13-1.136c-.068-.086-.048-.086-.151-.032l-4.461,2.326a.369.369,0,0,1-.038.02c-.047.016-.055.045-.038.091a2.424,2.424,0,0,1,.1.369,2.926,2.926,0,0,1-.146,1.631Zm-2.692.98a2.164,2.164,0,1,0-2.162-2.158A2.159,2.159,0,0,0,2035.335,631.25Z" transform="translate(-2032.398 -621.085)" fill="#c7d8dd" fill-rule="evenodd"/>
                      </svg>                                                                          
                        `}} />
                </TouchableOpacity>
            </View>
        ),
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
  
        //   console.log("HEADER_HEIGHT : " , HEADER_HEIGHT)
        return HEADER_HEIGHT
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);
    
        this.props.navigation.setParams({handleEdit: this.handleEdit})
        this.props.navigation.setParams({handleShare: this.handleShare})
    }

    handleShare = () => {
        // alert('handleShare')
        Share.open(shareOptions);
    }

    handleEdit = () =>{
        this.props.navigation.navigate("EditMyProfilePage")
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

        let {renderContent} = this.state;
        console.log(this.props.auth.users.profiles);

        let {name} = this.props.auth.users.profiles

        const resizeMode = 'center';
        return (
            // <SafeAreaView style={{flex:1}}>
                <ScrollView style={{ flex: 1,}}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    {/* <ImageBackground source={require('../../Images/__bg.png')}  style={{width: '100%', height: '100%'}}> */}
                    <BackgroundImage style={{paddingTop:this.getHeaderInset()}} auth={this.props.auth}>
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
                                // onPress={() => console.log("open Help/FAQ")}
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
                                        style={{borderColor:'gray', borderRadius:5, borderWidth:.2}}
                                        onPress={()=>{
                                            this.props.navigation.navigate("BasicInfoNavigator")
                                        }}>
                                            <Text
                                                // allowFontScaling
                                                // numberOfLines={1}
                                                style={{ fontSize: 14, margin:5}}>
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
                                                {name}
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
                                cellStyle="Basic"
                                accessory="DisclosureIndicator"
                                contentContainerStyle={{ padding:10 }} 
                                hideSeparator={true} 
                                cellContentView={
                                    <View style={{flex:1}}>
                                        <View >
                                            <Text style={{ fontSize:18 }}>
                                                My QR code
                                            </Text>
                                            {/* <Text style={{ fontSize:18 }}>
                                                Male
                                            </Text> */}
                                        </View>
                                        
                                    </View>
                                }
                                onPress={()=>{
                                    // MyQRcode
                                    this.props.navigation.navigate("MyQRcode")
                                }}
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
                                            style={{borderColor:'gray', borderRadius:5, borderWidth:.2}}
                                            onPress={()=>{
                                                this.props.navigation.navigate("ContactInfoNavigator")
                                            }}>
                                                <Text
                                                    // allowFontScaling
                                                    // numberOfLines={1}
                                                    style={{ fontSize: 14, margin:5}}>
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
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(MyProfilePage);