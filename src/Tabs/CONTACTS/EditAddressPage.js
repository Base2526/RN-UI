import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native'

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

class EditAddressPage extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
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
                    <Text style={{fontSize:18, color:'#C7D8DD', fontWeight:'bold'}}>Save</Text>
                </TouchableOpacity>
                </View>
            ),
        }
    }

    constructor(props) {
      super(props);
      this.state = {
          text:'',
          loading:false
      }
    }
  
    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })
        this.setState({text:this.props.profiles.address === undefined ?'':this.props.profiles.address})
    }

    handleSave = () => {
        // this.setState({loading:true}) // status_message
        // this.props.actionEditStatusMessageProfile(this.props.uid, this.state.text, (result) => {
        //     console.log(result)

        //     this.setState({loading:false})

        //     const { navigation } = this.props;
        //     navigation.goBack();
        // })


        // export const actionAddressProfile = (uid, address, callback) => dispatch =>{

        this.props.actionAddressProfile(this.props.uid, this.state.text, (result) => {
            console.log(result)

            this.setState({loading:false})

            const { navigation } = this.props;
            navigation.goBack();
        })
    }

    componentWillReceiveProps(nextProps) {
    //   console.log(nextProps)
    }
      
    render() {
        return (<KeyboardAwareScrollView><View style={{margin:10}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{alignItems:'flex-end', padding:5}}>
                        <Text>{this.state.text.length}/500</Text>
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
                            value={this.state.text}
                            clearButtonMode='while-editing'
                            maxLength={500}
                            multiline = {true}
                            placeholder= {this.state.text}
                        />
                    </View>
                </View>
                </KeyboardAwareScrollView>)
    }
}

const mapStateToProps = (state) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    uid:getUid(state),
    profiles:state.auth.users.profiles
  }
}

export default connect(mapStateToProps, actions)(EditAddressPage);