import React from 'react'
import {View, 
        Text, 
        SafeAreaView, 
        TouchableOpacity} from 'react-native'
    
import { connect } from 'react-redux';

import MyIcon from '../../config/icon-font.js';
import * as actions from '../../Actions'

class MyApplicationAddPost extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Add post",
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',

            // ios navigationoptions underline hide
            borderBottomWidth: 0,

            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
        headerRight: (
            <TouchableOpacity
                style={{marginRight:10}}
                onPress={() => {
                    const { params = {} } = navigation.state
                        params.handleCancel()
                }}>
                <MyIcon
                    name={'cancel'}
                    size={25}
                    color={'#C7D8DD'} />
            </TouchableOpacity>
          ),
    })

    constructor(props){
      super(props)
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    render(){
        return( <SafeAreaView style={{flex:1}}>
                    <View style={{flex:1}}>
                        <Text>
                        MyApplicationAddPost
                        </Text>
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

export default connect(mapStateToProps, actions)(MyApplicationAddPost);