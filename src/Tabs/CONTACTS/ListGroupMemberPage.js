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
import FastImage from 'react-native-fast-image'

import Styles from '../../styles';

export default class ListGroupMemberPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Manage Group",
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
                                onPress={
                                    ()=>this.props.navigation.navigate("FriendProfilePage")
                                  }>
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
        return( <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
                    
                    <TouchableOpacity 
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}   
                              onPress={
                                ()=>this.props.navigation.navigate("FriendProfilePage")
                              } 
                      >
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
                  <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                    <Text style={{fontSize:18}}>name member</Text>
                 </View>
                </View>)
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