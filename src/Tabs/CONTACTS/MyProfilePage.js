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
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Share, {ShareSheet, Button} from 'react-native-share';

import {getStatusBarHeight} from '../../Utils/Helpers'
import * as actions from '../../Actions'
import Image from 'react-native-remote-svg'
import TestSVG from '../../test/TestSVG'

let shareOptions = {
    title: "React Native",
    message: "Hola mundo",
    url: "http://facebook.github.io/react-native/",
    subject: "Share Link" //  for email
};

class MyProfilePage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        headerTransparent: true,
        headerTitleStyle:{color:'white'},
        headerTintColor: 'white',
        headerRight: (
            <View style={{flexDirection:'row', flex:1}}>
                <TouchableOpacity style={{paddingRight:10}}
                    onPress={()=>{
                        const { params = {} } = navigation.state
                        params.handleEdit()
                    }}>
                    <Image
                        style={{ width: 25, height: 25}}
                        source={{uri:`data:image/svg+xml;utf8,<svg id="edit" xmlns="http://www.w3.org/2000/svg" width="17.112" height="18.375" viewBox="0 0 17.112 18.375">
                        <path id="Path_1826" data-name="Path 1826" d="M1615.187,647.961h-5.3a2.918,2.918,0,0,1-.8-.094,1.639,1.639,0,0,1-1.214-1.442,3.852,3.852,0,0,1-.021-.406q0-4.9,0-9.8a2.453,2.453,0,0,1,.084-.714,1.61,1.61,0,0,1,1.214-1.151,2.773,2.773,0,0,1,.715-.078h4.881c.219,0,.437,0,.656,0a.51.51,0,0,1,.5.321.54.54,0,0,1-.1.586.906.906,0,0,1-.786.352c-1.714-.013-3.429-.006-5.143-.006a1.846,1.846,0,0,0-.378.031.4.4,0,0,0-.37.381,1.2,1.2,0,0,0-.018.222q0,4.954,0,9.906a1.135,1.135,0,0,0,.045.336.342.342,0,0,0,.216.23,1.36,1.36,0,0,0,.4.072c.039,0,.079,0,.118,0h10.628a1.873,1.873,0,0,0,.416-.045.393.393,0,0,0,.329-.359,1.732,1.732,0,0,0,.02-.248q0-3.733,0-7.466a.629.629,0,0,1,.239-.515,2.208,2.208,0,0,1,.189-.142.528.528,0,0,1,.817.4c.006.083.009.166.009.249q0,3.713,0,7.426a2.592,2.592,0,0,1-.049.587,1.623,1.623,0,0,1-1.282,1.29,2.941,2.941,0,0,1-.716.068Z" transform="translate(-1607.846 -629.586)" fill="#c7d8dd" fill-rule="evenodd"/>
                        <path id="Path_1827" data-name="Path 1827" d="M1649.507,623.621a.988.988,0,0,1,.144-.5,4.127,4.127,0,0,1,.5-.692q1.122-1.31,2.246-2.618,1.67-1.945,3.339-3.892a.37.37,0,0,1,.5-.1,1.938,1.938,0,0,1,.34.222,15.684,15.684,0,0,1,1.922,1.682.827.827,0,0,1,.149.2.341.341,0,0,1-.044.412c-.262.3-.519.6-.778.905q-2.38,2.771-4.761,5.542a5.23,5.23,0,0,1-.626.634,1.237,1.237,0,0,1-.367.225.581.581,0,0,1-.613-.1l-1.732-1.486A.553.553,0,0,1,1649.507,623.621Z" transform="translate(-1643.138 -613.905)" fill="#c7d8dd" fill-rule="evenodd"/>
                        <path id="Path_1828" data-name="Path 1828" d="M1699.115,605.779a.762.762,0,0,1-.152.466c-.177.263-.4.488-.595.731a.522.522,0,0,1-.094.09.318.318,0,0,1-.47-.018c-.226-.205-.448-.416-.668-.629a12.737,12.737,0,0,0-1.155-.967c-.146-.111-.289-.226-.433-.34a.323.323,0,0,1-.062-.515,5,5,0,0,1,.623-.707.374.374,0,0,0,.04-.034.791.791,0,0,1,.7-.253,1.7,1.7,0,0,1,.426.069,2.577,2.577,0,0,1,1.111.617,2.611,2.611,0,0,1,.683,1.132A1.189,1.189,0,0,1,1699.115,605.779Z" transform="translate(-1682.003 -603.602)" fill="#c7d8dd" fill-rule="evenodd"/>
                        <path id="Path_1829" data-name="Path 1829" d="M1647.4,677.429c-.092,0-.183,0-.275,0a.3.3,0,0,1-.291-.236,5.463,5.463,0,0,1-.086-.622.7.7,0,0,1,.086-.376.273.273,0,0,1,.321-.14.6.6,0,0,1,.208.107,6.231,6.231,0,0,1,.675.58.764.764,0,0,1,.124.152.286.286,0,0,1-.1.4.715.715,0,0,1-.417.129h-.249Z" transform="translate(-1640.798 -664.97)" fill="#c7d8dd" fill-rule="evenodd"/>
                      </svg>`}} />
                </TouchableOpacity>

                <TouchableOpacity style={{paddingRight:10}}
                    onPress={()=>{
                        const { params = {} } = navigation.state
                        params.handleShare()
                    }}>
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
  
        //   console.log("HEADER_HEIGHT : " , HEADER_HEIGHT)
        return HEADER_HEIGHT
    }

    componentDidMount() {
        setTimeout(() => {this.setState({renderContent: true})}, 0);
    
        this.props.navigation.setParams({handleEdit: this.handleEdit})
        this.props.navigation.setParams({handleShare: this.handleShare})
    }

    handleShare = () => {
        Share.open(shareOptions);
    }

    handleEdit = () =>{
        this.props.navigation.navigate("EditMyProfilePage")
    }

    render() {
        let {name, image_url} = this.props.auth.users.profiles
        // let{name, image_url} = this.props.auth.users.profiles;
        return (<ScrollView style={{ flex: 1,}}>
                <View style={{flex:1, backgroundColor:'gray'}}>
                    {/* <BackgroundImage style={{paddingTop:this.getHeaderInset()}} auth={this.props.auth} /> */}
                    <View style={{flex:1, paddingTop: this.getHeaderInset(), flexDirection:'row'}}>
                        <FastImage
                            style={StyleSheet.absoluteFill}
                            source={require('../../Images/boxpink.png')}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={{flexDirection:'row', margin:20}}>
                        <TouchableOpacity>
                            <TestSVG 
                                width={100}
                                height={100}
                                strokeWidth={3}
                                image_uri={image_url}/> 
                        </TouchableOpacity>
                        <View style = {{
                            justifyContent: 'center',
                            alignItems: 'center'}}>
                            <Text style={{alignSelf:'center',
                                        fontSize:22,
                                        color:'white',
                                        justifyContent:'center',
                                        alignItems:'center', 
                                        marginRight:100,
                                        marginLeft:10}}>
                                {name}
                            </Text>
                        </View>
                        </View>
                    </View>
                    <View style={{ flex:1}}>
                        <TableView >
                        <Section
                            sectionPaddingTop={5}
                            sectionPaddingBottom={0}
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Subtitle"
                                titleTextColor="#007AFF"
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Text
                                        style={{flex:1, fontSize: 18,  }}>
                                        Basic Info
                                        </Text>
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
                                        </View>
                                    </View>
                                }
                                onPress={()=>{
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
                            separatorInsetLeft={0}>
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ }} 
                                hideSeparator={false}
                                cellContentView={
                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Text
                                        style={{flex:1, fontSize: 18,  }}>
                                        Contact Info
                                        </Text>
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{  }} 
                                hideSeparator={true}
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
                                    </View>
                                }
                            />
                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ }} 
                                hideSeparator={true}
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
                                    </View>
                                }
                            />

                            <Cell
                                cellStyle="Basic"
                                contentContainerStyle={{ }} 
                                hideSeparator={true}
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
                                contentContainerStyle={{ }} 
                                hideSeparator={true}
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
                    </TableView>
                    </View>
                </View>
            </ScrollView> 
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
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(MyProfilePage);