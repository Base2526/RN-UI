import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import * as actions from '../../actions'
import {isEmpty} from '../../utils/Helpers'

import {makeUidState, 
        makeMyAppicationsState, 
        makeApplicationCategoryState,} from '../../reselect'

class EditNameMyApplicationPage extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Edit my application name",
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
        application_id: 0,
        my_application: {},
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
        // console.log(props)
        let {my_applications} = props
        let {application_id} = this.state

        let my_application =_.find(my_applications, (v, k)=>{
                                return k == application_id
                            })

        if( isEmpty(my_application) ){
            this.props.navigation.goBack(null)
            return;
        }

        this.setState({my_application, text:my_application.name})
    }

    handleSave = () => {

        let {application_id, my_application, text} = this.state
        if(this.state.text.length == 0){
            alert('Name is empty?')
        }else{
            if(my_application.name === text){
                const { navigation } = this.props;
                navigation.goBack();
            }else{
                this.setState({loading:true})
                this.props.actionUpdateNameMyApplication(this.props.uid, application_id, text, (result) => {
                    this.setState({loading:false})

                    const { navigation } = this.props;
                    navigation.goBack();
                })
            }
        }
    }

    render() {
        return (<View style={{margin:10}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{alignItems:'flex-end', padding:5}}>
                        <Text>{this.state.text.length}/30</Text>
                    </View>
                    <View>
                        <TextInput
                            style={{ fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            clearButtonMode='while-editing'
                            maxLength={30}
                            placeholder= {this.state.text}
                        />
                    </View>
                </View>)
    }
}


const mapStateToProps = (state, ownProps) => {
//   console.log(state)

    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }

    return{
        // uid:getUid(state),
        // my_applications:state.auth.users.my_applications

        uid: makeUidState(state, ownProps),
        my_applications: makeMyAppicationsState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(EditNameMyApplicationPage);