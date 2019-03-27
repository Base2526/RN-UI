import React from 'react'
import {View, 
        Text, 
        TouchableOpacity,
        TextInput} from 'react-native'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import * as actions from '../../actions'
import {checkInternetDialog} from '../../utils/Helpers'
import {makeUidState, 
        makeClasssState,
        makeIsConnectedState} from '../../reselect'

class EditClassNamePage extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Edit class name",
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
          class_id:0,
          data:{},
          text:'',
          loading:false
      }
    }
  
    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        const class_id = navigation.getParam('class_id', null);

        // console.log(class_id)
        this.setState({class_id},()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps);
    }

    loadData = (props) =>{
        // console.log(props)
        let {class_id} = this.state
        let {classs} = props

        let _class =_.find(classs,  function(v, k) { 
                        return k == class_id; 
                    })

        console.log(_class)
        this.setState({data:_class, text:_class.name})
    }

    handleSave = () => {
        let {is_connected} = this.props
        let {data, text, class_id} = this.state
        if(this.state.text.length == 0){
            alert('Class name is empty?')
        }else{
            // console.log(this.state.data.group_profile.name)
            // console.log(this.state)
            if(data.name === text){
                const { navigation } = this.props;
                navigation.goBack();
            }else{
                // console.log('process', this.state.data.group_id)

                if(!is_connected){
                    checkInternetDialog()
                    return 
                }
                let new_data = {...data, name:text}
                // console.log(new_data)
                
                this.setState({loading:true})
                this.props.actionEditClassNameProfile(this.props.uid, class_id, new_data, (result) => {
                    this.setState({loading:false})

                    const { navigation } = this.props;
                    navigation.goBack();
                })
            
            }
        }
    }

    handleClassName = (text) => {
        this.setState({text})
    }

    render() {

        let {text} = this.state
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
                            onChangeText = {this.handleClassName}
                            placeholder={text}
                        />
                    </View>
                </View>)
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
        uid:makeUidState(state, ownProps),
        classs:makeClasssState(state, ownProps),

        is_connected: makeIsConnectedState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(EditClassNamePage);