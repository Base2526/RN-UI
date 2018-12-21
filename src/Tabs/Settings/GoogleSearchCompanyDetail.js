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
import {search_google} from '../../Utils/Services'

export default class GoogleSearchCompanyDetail extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            loading: false,
        }
    }

    render(){
        const item =  this.props.navigation.getParam('item', 'NO-ID');

        // console.log(item)
        return( <SafeAreaView style={{flex:1}}>
                <ScrollView style={{flex:1}}>
                <View style={{margin:5, flexDirection:'row'}}>
                    <Text>{JSON.stringify(item)}</Text>
                </View>
                </ScrollView>
            </SafeAreaView>)
    }
}