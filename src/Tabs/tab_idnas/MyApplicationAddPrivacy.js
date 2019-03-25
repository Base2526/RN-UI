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
import * as actions from '../../actions'

class MyApplicationAddPrivacy extends React.Component{

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
            privacys:[]
        }
    }

    componentDidMount(){
        // const { navigation } = this.props;
        // const my_app_id = navigation.getParam('my_app_id', null);
      
        // this.setState({my_app_id}, ()=>{
        //     this.loadData(this.props)
        // })

        let {post_privacys} = this.props.auth
        if(!post_privacys){
            this.setState({loading:true})
            this.props.actionGetPostFeelingsAndPrivacy().then((result) => {
                this.setState({loading:false})
                if(!result.status){
                    this.props.navigation.goBack(null)
                }else{
                    let privacys =  _.sortBy(result.data.post_privacys, 'weight').map((v)=>{
                                        return v
                                    })

                    this.setState({privacys})
                }
            })
        }else{
            let privacys =  _.sortBy(post_privacys, 'weight').map((v)=>{
                                return v
                            })
            this.setState({privacys})
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
                        this.props.navigation.goBack(null)
                        this.props.navigation.state.params.handleSelectPrivacy(item);
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
        let {privacys} = this.state
        console.log(privacys)

        return( <SafeAreaView style={{flex:1}}>
                    <View style={{flex:1}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={'Wait...'}
                            textStyle={{color: '#FFF'}}
                            overlayColor={'rgba(0,0,0,0.5)'}/>
                        <FlatList
                            data={privacys}
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

export default connect(mapStateToProps, actions)(MyApplicationAddPrivacy);