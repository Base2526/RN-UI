import React from 'react'
import {View, 
        Text, 
        SafeAreaView, 
        TouchableOpacity,
        TextInput} from 'react-native'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import MyIcon from '../../config/icon-font.js';
import * as actions from '../../Actions'

import {isEmpty} from '../../Utils/Helpers'

import {makeUidState, } from '../../Reselect'

class MyApplicationReport extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Report",
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

        this.state = {
            loading: false,
            renderContent: false,
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
        
        const { navigation } = this.props
        const app_id  = navigation.getParam('app_id', null)
        const post_id = navigation.getParam('post_id', null)
    }

    componentWillReceiveProps(nextProps) {
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    render(){
        return( <SafeAreaView style={{flex:1}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}/>
                    <Text>MyApplicationReport</Text>
                </SafeAreaView>)
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state)
    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
        uid:makeUidState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(MyApplicationReport);