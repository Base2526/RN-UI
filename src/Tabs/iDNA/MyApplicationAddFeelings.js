import React from 'react'
import {View, 
        Text, 
        SafeAreaView, 
        TouchableOpacity,
        FlatList} from 'react-native'
    
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');

import MyIcon from '../../config/icon-font.js';
import * as actions from '../../Actions'

import {isEmpty} from '../../Utils/Helpers'

class MyApplicationAddFeelings extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        // title: "Add post",
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',

            // ios navigationoptions underline hide
            borderBottomWidth: 0,

            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
    })

    constructor(props){
        super(props)

        this.state = {
            loading: false,
            renderContent: false,
            my_app_id:0,

            feelings:[]
        }
    }

    componentDidMount(){    
       let {post_feelings} = this.props.auth

       if(!post_feelings){
            this.setState({loading:true})
            this.props.actionGetPostFeelingsAndPrivacy().then((result) => {
                this.setState({loading:false})
                
                // console.log('result', result.data)
                if(!result.status){
                    this.props.navigation.goBack(null)
                }else{
                    // console.log('result.data.post_feelings', result.data.post_feelings)
                    let feelings =  _.sortBy(result.data.post_feelings, 'weight').map((v)=>{
                                        return v
                                    })
                
                    this.setState({feelings})
                }
            })
       }else{
            let feelings =  _.sortBy(post_feelings, 'weight').map((v)=>{
                                return v
                            })

            this.setState({feelings})
       }
    }

    ItemSeparatorComponent = () => {
        return (
          <View
            style={{
              height: .5,
              width: "100%",
              backgroundColor: "#CED0CE",
            //   marginLeft: "14%"
            }}
          />
        )
    }

    renderItem = ({ item, index }) => {
        return( <TouchableOpacity
                    onPress={()=>{
                        // alert(item.name)

                        this.props.navigation.goBack(null)
                        this.props.navigation.state.params.handleSelectFeelings(item)
                    }}>
                    <View
                        style={{
                            alignItems: 'center', 
                            padding: 10,
                            flexDirection: 'row'
                        }}>
                        <Text>{item.name}</Text>
                    </View>
                </TouchableOpacity>)
    }

    render(){
        let {feelings} = this.state
        console.log(feelings)

        return( <SafeAreaView style={{flex:1}}>
                    <View style={{flex:1}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={'Wait...'}
                            textStyle={{color: '#FFF'}}
                            overlayColor={'rgba(0,0,0,0.5)'}/>
                        <FlatList
                            data={feelings}
                            renderItem={this.renderItem}
                            keyExtractor = { (item, index) => index.toString() } 
                            ItemSeparatorComponent = {this.ItemSeparatorComponent}
                            // ListFooterComponent={this.renderFooter}
                            onEndReachedThreshold={50}
                            extraData={this.state}
                        />
                    </View>
                </SafeAreaView>)
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(MyApplicationAddFeelings);