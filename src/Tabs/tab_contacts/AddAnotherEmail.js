import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import * as actions from '../../actions'
import {getUid, validateEmail} from '../../utils/Helpers'
import {makeUidState} from '../../reselect'

class AddAnotherEmail extends React.Component{
    static navigationOptions = ({ navigation }) => ({
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
            mode:'add',
            key:'',
            text: '',

            error: false,
            error_message : ''
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const mode = navigation.getParam('mode', null);
  
        if(mode === 'edit'){
            const key = navigation.getParam('key', null);
            const value = navigation.getParam('value', null);

            this.setState({mode, key, text:value.email})
        }
    }

    handleSave = () => {
        if(!validateEmail(this.state.text)){
            // this.setState({text:''})
            alert('Not a valid email')
        }else{
            console.log('validate phone')

            /**
             * เช็ดว่ามีอยู่ในระบบแล้วหรือไหม
             **/
            // const { navigation } = this.props;
            // navigation.goBack();
            // navigation.state.params.onAddAnotherEmail({value: {name: this.state.text, isVerify:false}, mode:this.state.mode, key:this.state.key });

            if(this.state.mode === 'add'){
                this.setState({loading: true})
                this.props.actionAddEmailProfile(this.props.uid, this.state.text, (result) => {
                    // console.log(result)
                    
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
            }else if(this.state.mode === 'edit'){
                this.setState({loading: true})
                this.props.actionEditEmailProfile(this.props.uid, this.state.key, this.state.text, (result) => {
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
                            keyboardType="email-address"
                            placeholder= {this.state.text}
                            multiline={true}
                            autoCapitalize = 'none'
                            maxLength={50}
                        />
                        <View style={{position:'absolute', bottom:0}}>
                            <Text style={{color:'red'}}>{this.state.error?this.state.error_message:''}</Text>
                        </View>
                        <View style={{alignItems:'flex-end'}}>
                            <Text style={{color:'gray'}}>{this.state.text.length}/50</Text>
                        </View>
                    </View>
                </View>)
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log(state)
    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }

    return({
        // uid:getUid(state)
        uid: makeUidState(state, ownProps),
    })
}
  
export default connect(mapStateToProps, actions)(AddAnotherEmail);