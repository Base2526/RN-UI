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

class MyApplicationAddPost extends React.Component{

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
        headerLeft:(
            <TouchableOpacity
                style={{marginLeft:10}}
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
        headerRight: (
            <TouchableOpacity
                style={{marginRight:10}}
                onPress={() => {
                    const { params = {} } = navigation.state
                        params.handleNewPost()
                }}>
                <Text style={{fontSize:18, color:'white',}}>Post</Text>
            </TouchableOpacity>
          ),
    })

    constructor(props){
        super(props)

        this.state = {
            loading: false,
            renderContent: false,
            app_id:0,
            mode:'',
            data:{},

            text:'',

            images:[],
            select_feelings:{},
            select_privacy:{},
            location:{}
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleCancel: this.handleCancel })
        this.props.navigation.setParams({handleNewPost: this.handleNewPost })
        
        const { navigation } = this.props
        const app_id = navigation.getParam('app_id', null)
        const mode = navigation.getParam('mode', null)

        if(mode == 'add'){
            this.setState({app_id, mode})
        }else if(mode == 'edit'){

            const data = navigation.getParam('data', null)
            console.log('data', data)
            this.setState({app_id, mode, data})
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    handleNewPost = () => {
        // alert('handleNewPost')
        // //export const actionAddNewPost = (uid, app_id, feelings, privacy, images, text, location) 
    
        let {uid} = this.props
        let {app_id, images, text, select_feelings, select_privacy, location} = this.state

        let feelings = 0
        if(!isEmpty(select_feelings)){
            feelings = select_feelings.tid
        }

        let privacy = 0
        if(!isEmpty(select_privacy)){
            privacy = select_privacy.tid
        }

        if(isEmpty(text) && isEmpty(images)){

        }else{
            this.setState({loading:true})
            this.props.actionAddNewPost(uid, app_id, feelings, privacy, images, text, location).then((result) => {
                setTimeout(() => {
                    this.setState({loading:false})
                    this.props.navigation.goBack(null)
                }, 200);
            })
        }
    }

    handleCancel = () => {
        this.props.navigation.goBack(null)
    }

    handleSelectFeelings = (result) => {
        console.log('result', result)
        this.setState({select_feelings:result})
    }

    handleSelectPrivacy = (result) => {
        console.log('result', result)
        this.setState({select_privacy:result})
    }

    addPicture = () => {
        let options =  {
            title: 'Select picture',
            noData: true,
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            quality: 0.7,
            maxWidth: 500,
            maxHeight: 500,
        }

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                console.log('response.uri', response.uri)
                // this.setState({loading:true})
                // this.props.actionUpdateGroupPictureProfile(this.props.uid, this.state.group_id, response.uri).then((result) => {
                //     console.log(result)

                //     this.setState({loading:false})
                // })

                // for() images

                let images = []
                for(let i = 0; i < 5; i++){
                    images.push(response.uri)
                }

                this.setState({images})
            }
        });
    }

    render(){

        let {select_feelings, select_privacy} = this.state

        let add_feelings =  <Text style={{padding:10, backgroundColor:'blue'}}>
                                Add Feelings
                            </Text>

        // console.log(select_feelings, select_privacy)
        if(!isEmpty(select_feelings)){
            add_feelings =  <Text style={{padding:10, backgroundColor:'blue'}}>
                                Add Feelings > {select_feelings.name}
                            </Text>
        }

        let add_privacy =  <Text style={{padding:10, backgroundColor:'yellow'}}>
                                Add Privacy
                            </Text>
        if(!isEmpty(select_privacy)){
            add_privacy =  <Text style={{padding:10, backgroundColor:'yellow'}}>
                                Add Privacy > {select_privacy.name}
                            </Text>
        }
        
        return( <SafeAreaView style={{flex:1}}>
                    <View style={{flex:1}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={'Wait...'}
                            textStyle={{color: '#FFF'}}
                            overlayColor={'rgba(0,0,0,0.5)'}/>
                        <TouchableOpacity
                            onPress={()=>{
                                this.addPicture()
                            }}>
                            <Text style={{padding:10, backgroundColor:'red'}}>
                                Add Image
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.navigate("MyApplicationAddFeelings", {handleSelectFeelings: this.handleSelectFeelings})
                            }}>
                            {add_feelings}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.navigate("MyApplicationAddPrivacy", {handleSelectPrivacy: this.handleSelectPrivacy})
                            }}>
                            {add_privacy}
                        </TouchableOpacity>

                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            placeholder={'input text post'}
                        />
                    </View>
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

export default connect(mapStateToProps, actions)(MyApplicationAddPost);