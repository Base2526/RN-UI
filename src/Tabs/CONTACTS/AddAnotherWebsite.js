import React from 'react'

import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../Actions'
import {getUid, validateURL} from '../../Utils/Helpers'

class AddAnotherWebsite extends React.Component{

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
            text: ''
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

            this.setState({mode, key, text:value.url})
        }
    }

    handleSave = () => {
        /**
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onAddAnotherEmail(newData);
        */

        if(!validateURL(this.state.text)){
            // this.setState({text:''})
            alert('Not a valid url')
        }else{
            // console.log('validate phone')

            /**
             * เช็ดว่ามีอยู่ในระบบแล้วหรือไหม
             **/
            // const { navigation } = this.props;
            // navigation.goBack();
            // navigation.state.params.onAddAnotherWebsite({value: {name: this.state.text, isVerify:false}, mode:this.state.mode, key:this.state.key });


            if(this.state.mode === 'add'){
                
                this.setState({loading: true})
                this.props.actionAddWebsiteProfile(this.props.uid, this.state.text, (result) => {
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
            }else if(this.state.mode === 'edit'){
                this.setState({loading: true})
                this.props.actionEditWebsiteProfile(this.props.uid, this.state.key, this.state.text, (result) => {
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
                            style={{fontSize: 22, 
                                    padding:10, 
                                    borderColor:'gray', 
                                    borderWidth:.5,
                                    minHeight:150,
                                    // borderRadius:5, 
                                    textAlignVertical: "top"
                                }}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            clearButtonMode='while-editing'
                            keyboardType="url"
                            multiline={true}
                            placeholder="input url"
                            autoCapitalize = 'none'
                            maxLength={500} 
                        />
                        <View style={{position:'absolute', bottom:0}}>
                            <Text style={{color:'red'}}>{this.state.error?this.state.error_message:''}</Text>
                        </View>
                        <View style={{alignItems:'flex-end'}}>
                            <Text style={{color:'gray'}}>{this.state.text.length}/500</Text>
                        </View>
                    </View>
                </View>)
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return({
        uid:getUid(state)
    })
}
  
export default connect(mapStateToProps, actions)(AddAnotherWebsite);