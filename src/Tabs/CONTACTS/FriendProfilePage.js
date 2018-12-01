// import React from 'react'
// import {View, Text, TouchableOpacity} from 'react-native'

// import Styles from '../../styles';
// import Icon from 'react-native-vector-icons/FontAwesome5';

// export default class FriendProfilePage extends React.Component{

//     static navigationOptions = ({ navigation }) => ({
//         title: "Friend Profile",
//         // tabBarVisible: false,
//         // headerLeft: (
//         //     <TouchableOpacity
//         //         style={Styles.headerButton}
//         //         onPress={() => navigation.openDrawer()}>
//         //         <Icon name="bars" size={25} />
//         //     </TouchableOpacity>
//         // ),
//         headerRight: (
//             <TouchableOpacity
//                 style={Styles.headerButton}
//                 onPress={() => {
//                     // const { params = {} } = navigation.state
//                     // params.handleHeaderRight()
//                     navigation.navigate("ChatPage")
//                 } }>
//                 <Icon name="comments" size={20} />
//             </TouchableOpacity>
//           ),
//     });

//     constructor(props){
//         super(props)
//         console.log(props)
//     }

//     render(){
//         return(<View><Text>Friend Profile Page</Text></View>)
//     }
// }

import React from 'react'
import {FlatList, 
        StyleSheet, 
        View, 
        Text, 
        Alert, 
        Platform, 
        TouchableOpacity} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'

import Styles from '../../styles';

export default class FriendProfilePage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Friend Profile",
        headerRight: (
            <TouchableOpacity
                style={Styles.headerButton}
                onPress={() => {
                    // const { params = {} } = navigation.state
                    // params.handleHeaderRight()
                    navigation.navigate("ChatPage")
                } }>
                <Icon name="comments" size={20} />
            </TouchableOpacity>
          ),
    });

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