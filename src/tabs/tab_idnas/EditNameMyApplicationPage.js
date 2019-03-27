import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import * as actions from '../../actions'
import {getUid} from '../../utils/Helpers'

class EditNameMyApplicationPage extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Edit display name",
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
        item_id: 0,
        text:'',
        loading:false
      }
    }
  
    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const item_id = navigation.getParam('item_id', null);

        this.setState({item_id}, ()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        // console.log(props)
        let {emails, my_applications} = props
        let {item_id} = this.state

        let my_application =_.find(my_applications, (v, k)=>{
            return k == item_id
        })

        if(my_application === undefined){
            this.props.navigation.goBack(null)
            return;
        }

        this.setState({text:my_application.name})
    }

    handleSave = () => {
        if(this.state.text.length == 0){
            alert('Name is empty?')
        }else{
            if(this.props.profiles.name === this.state.text){
                const { navigation } = this.props;
                navigation.goBack();
            }else{
                this.setState({loading:true})
                this.props.actionEditDisplayNameProfile(this.props.uid, this.state.text, (result) => {
                    console.log(result)

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


const mapStateToProps = (state) => {
//   console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    uid:getUid(state),
    my_applications:state.auth.users.my_applications
  }
}

export default connect(mapStateToProps, actions)(EditNameMyApplicationPage);