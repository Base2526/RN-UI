import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native'

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var _ = require('lodash');

import * as actions from '../../actions'
import {isEmpty} from '../../utils/Helpers'

import {makeUidState, 
        makeMyAppicationsState, } from '../../reselect'

class EditMyApplicationAddressPage extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'My Application Address',
            headerTintColor: '#C7D8DD',
            headerStyle: {
                backgroundColor: 'rgba(186, 53, 100, 1.0)',
                // ios navigationoptions underline hide
                borderBottomWidth: 0,
    
                // android navigationoptions underline hide
                elevation: 0,
                shadowOpacity: 0
            },
            headerRight: (
                <View style={{marginRight:10}}>
                <TouchableOpacity
                    style={{padding:5}}
                    onPress={() => {
                        const { params = {} } = navigation.state
                        params.handleSave()
                    }}>
                    <Text style={{fontSize:18, color:'#C7D8DD', fontWeight:'bold'}}>Save</Text>
                </TouchableOpacity>
                </View>
            ),
        }
    }

    constructor(props) {
      super(props);
      this.state = {
            application_id:0,
            text:'',
            loading:false
      }
    }
  
    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const application_id = navigation.getParam('application_id', null);

        this.setState({application_id}, ()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {application_id} = this.state
        let {my_applications} = props

        let my_application =_.find(my_applications, (v, k)=>{
                               return k == application_id
                           })

        if(!isEmpty(my_application.address)){
            this.setState({text:my_application.address});
        }
    }

    handleSave = () => {
        let {application_id, text} = this.state
        this.setState({loading:true})
        this.props.actionMyApplicationAddress(this.props.uid, application_id, text, (result) => {
            console.log(result)

            this.setState({loading:false})

            const { navigation } = this.props;
            navigation.goBack();
        })
    }

    render() {
        let {loading, text} = this.state

        return (<KeyboardAwareScrollView><View style={{margin:10}}>
                    <Spinner
                        visible={loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{alignItems:'flex-end', padding:5}}>
                        <Text>{text.length}/500</Text>
                    </View>
                    <View>
                        <TextInput
                            style={{fontSize: 22, 
                                    padding:10, 
                                    borderColor:'gray', 
                                    borderWidth:.5,
                                    minHeight:150,
                                    textAlignVertical: 'top'}}
                            onChangeText={(text) => this.setState({text})}
                            value={text}
                            clearButtonMode='while-editing'
                            maxLength={500}
                            multiline = {true}
                            placeholder= {text}
                        />
                    </View>
                </View>
                </KeyboardAwareScrollView>)
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state)

    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }

    return{
        uid: makeUidState(state, ownProps),
        // profile: makeProfileState(state, ownProps),

        my_applications: makeMyAppicationsState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(EditMyApplicationAddressPage);