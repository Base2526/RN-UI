import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native'

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'

class EditGroupNamePage extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Edit group name",
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
          data:{},
          text:'',
          loading:false
      }
    }
  
    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const group = navigation.getParam('group', null);
        console.log(group)

        this.setState({data:group, text:group.group_profile.name})
    }

    handleSave = () => {
        if(this.state.text.length == 0){
            alert('Group name is empty?')
        }else{
            console.log(this.state.data.group_profile.name)
            console.log(this.state.text)
            if(this.state.data.group_profile.name === this.state.text){
                const { navigation } = this.props;
                navigation.goBack();
            }else{
                // console.log('process', this.state.data.group_id)
                this.setState({loading:true})
                this.props.actionEditGroupNameProfile(this.props.uid, this.state.data.group_id, this.state.text, (result) => {
                    console.log(result)

                    this.setState({loading:false})

                    const { navigation } = this.props;
                    navigation.goBack();
                })
            }
        }
    }

    handleGroupName = (text) => {
        this.setState({text})
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    render() {
        let {text} = this.state
        // if( text == ''){
        //     return(<View style={{flex:1, backgroundColor:'white'}}></View>)
        // }

        return (<View style={{margin:10}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}
                    />
                    <View style={{alignItems:'flex-end', padding:5}}>
                        <Text>{text.length}/30</Text>
                    </View>
                    <View>
                        <TextInput
                            style={{ fontSize: 22, padding:10, borderColor:'gray', borderWidth:.5}}
                            onChangeText={(text) => this.setState({text})}
                            value={text}
                            clearButtonMode='while-editing'
                            maxLength={30}
                            onChangeText = {this.handleGroupName}
                            placeholder={text}
                        />
                    </View>
                </View>)
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

export default connect(mapStateToProps, actions)(EditGroupNamePage);