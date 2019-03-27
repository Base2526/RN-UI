import React from 'react'

import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../actions'
import {validateMobile, getUid} from '../../utils/Helpers'

import {makeUidState} from '../../reselect'

class AddAnotherPhone extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        // title: "Add another phone",
        title: `${navigation.state.params.title}`,
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
                <Text style={{fontSize:18, color:'#C7D8DD', fontWeight:'bold'}}>{navigation.state.params.mode == 'add' ? 'Add' : 'Update'}</Text>
            </TouchableOpacity>
            </View>
        ),
    })

    constructor(props){
        super(props)
        this.state ={
            mode: 'add',
            key: '',
            value: '',
            text: '',
            loading: false,

            error: false,
            error_message : ''
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const mode = navigation.getParam('mode', null);
        // console.log(mode)
        if(mode === 'edit'){
            const key = navigation.getParam('key', null);
            const value = navigation.getParam('value', null);

            this.setState({mode, key, text:value.phone_number, value})
        }
    }

    handleSave = () => {
        this.setState({error: false})

        if(!validateMobile(this.state.text)){
            // this.setState({text:''})
            alert('Not a valid Phone Number')
        }else{
            // console.log('validate phone')

            /**
             * เช็ดว่ามีอยู่ในระบบแล้วหรือไหม
             **/

            /*
            const { navigation } = this.props;
            navigation.goBack();
            navigation.state.params.onAddAnotherPhone({value: {phone_number: this.state.text, isVerify:false}, mode:this.state.mode, key:this.state.key });
            */

            let {mode, text} = this.state

            if(mode === 'add'){
                this.setState({loading: true})
                this.props.actionAddPhoneProfile(this.props.uid, text, (result) => {
                    console.log(result)
                    
                    this.setState({loading:false})
                    if(result.status){
                        const { navigation } = this.props;
                        navigation.goBack();
                    }else{
                        // this.setState({loading:false}, ()=>{
                        //     alert(result.message)
                        // })

                        this.setState({
                            error: true,
                            error_message: result.message
                        })
                    }
                })
           }else if(mode === 'edit'){
                this.setState({loading: true})

                let newValue = {...this.state.value, phone_number:text}

                this.props.actionEditPhoneProfile(this.props.uid, this.state.key, newValue, (result) => {
                    this.setState({loading:false})
                    if(result.status){
                        const { navigation } = this.props;
                        navigation.goBack();
                    }else{
                        this.setState({
                            error: true,
                            error_message: result.message
                        })
                    }
                })
           }
        }
    }

    render(){
        return( <View style={{flex:1}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{margin:20}}>
                        <TextInput
                            style={{ fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            clearButtonMode='while-editing'
                            keyboardType="numeric"
                            placeholder= 'input phone number'
                            maxLength={10} />
                        <View style={{position:'absolute', bottom:0}}>
                            <Text style={{color:'red'}}>{this.state.error?this.state.error_message:''}</Text>
                        </View>
                        <View style={{alignItems:'flex-end'}}>
                            <Text style={{color:'gray'}}>{this.state.text.length}/10</Text>
                        </View>
                    </View>
                </View>)
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state)

    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }
      
    return({
        // uid:getUid(state),
        // auth:state.auth

        uid: makeUidState(state, ownProps),
    })
}
  
export default connect(mapStateToProps, actions)(AddAnotherPhone);