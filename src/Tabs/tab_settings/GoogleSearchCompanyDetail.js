import React from 'react'
import {SafeAreaView, 
        View, 
        Text, 
        TextInput, 
        TouchableOpacity,
        FlatList,
        Linking,
        ScrollView} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'
import { ListItem } from 'react-native-elements'
import {search_google} from '../../utils/Services'
import {validURL} from '../../utils/Helpers'

export default class GoogleSearchCompanyDetail extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            loading: false,
            data:[]
        }
    }

    componentDidMount(){
        const item =  this.props.navigation.getParam('item', 'NO-ID');
        console.log(item)
        let data = []
        Object.keys(item.item).forEach(key => {
            let value = item.item[key];
            //use key and value here

            if (typeof value === 'object' || value === 'customsearch#result') {
                
            }else{
                // console.log(key)
                // console.log(value)
                data.push({key, value})
            }
            console.log(data)
        });
        console.log(data)
        this.setState({data})
    }

    renderItem = ({ item }) => {
    //    <ListItem
    //       title={item.key +" : "+item.value}
    //     //   subtitle={item.subtitle}
    //     //   leftAvatar={{ source: { uri: item.avatar_url } }}
    //         chevronColor="white"
        // />
    
        if(validURL(item.value)){
            return(<TouchableOpacity
                    onPress={()=>{
                        // Linking.openURL(item.value);

                        let url = item.value

                        if (!/^(f|ht)tps?:\/\//i.test(url)) {
                            url = "http://" + url;
                        }

                        Linking.canOpenURL(url).then(supported => {
                            if (supported) {
                                Linking.openURL(url);
                            //  }
                            } else {
                              console.log('Don\'t know how to open URI: ' + item.value);
                            }
                          });
                    }}>
                        <ListItem
                        title={item.key +" : "+item.value}
                        //   subtitle={item.subtitle}
                        //   leftAvatar={{ source: { uri: item.avatar_url } }}
                        chevronColor="white"
                        />
                    </TouchableOpacity>)
        }else{
            return(<TouchableOpacity
                    onPress={()=>{
                        

                        Linking.canOpenURL(item.value).then(supported => {
                            if (supported) {
                                console.log('supported')
                            }else{
                                console.log('not supported')
                            }
                        })
                    }}
                    >
                        <ListItem
                        title={item.key +" : "+item.value}
                        //   subtitle={item.subtitle}
                        //   leftAvatar={{ source: { uri: item.avatar_url } }}
                        chevronColor="white"
                        />
                    </TouchableOpacity>)
        }
    }

    render(){
        const item =  this.props.navigation.getParam('item', 'NO-ID');

        // console.log(item.item.pagemap)
        // console.log(item.item)

        console.log(this.state.data)

        return( <SafeAreaView style={{flex:1}}>
                {/* <ScrollView style={{flex:1}}>
                <View style={{margin:5, flexDirection:'row'}}>
                    <Text>{JSON.stringify(item)}</Text>
                </View>
                </ScrollView> */}

                <FlatList
                        data={this.state.data}
                        renderItem={this.renderItem}
                    />
            </SafeAreaView>)
    }
}