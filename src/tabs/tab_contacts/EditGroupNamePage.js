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

import {makeUidState, makeGroupsState} from '../../reselect'

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
            group_id:0,

            data:{},
            text:'',
            loading:false
        }
    }
  
    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.handleSave })

        const { navigation } = this.props;
        // const group = navigation.getParam('group', null);
        // this.setState({data:group, text:group.group_profile.name})

        const group_id = navigation.getParam('group_id', null);

        this.setState({group_id}, ()=>{
            this.loadData(this.props)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.loadData(nextProps)
    }

    loadData = (props) =>{
        let {group_id} = this.state
        let {groups} = props
        let group =  _.find(groups, (v, k)=>{
            return k == group_id
        })

        this.setState({data:group, text:group.group_profile.name})
    }

    handleSave = () => {

        let {text, data} = this.state
        if(text.length == 0){
            alert('Group name is empty?')
        }else{
            if(data.group_profile.name === text){
                const { navigation } = this.props;
                navigation.goBack();
            }else{
                this.setState({loading:true})
                this.props.actionEditGroupNameProfile(this.props.uid, this.state.data.group_id, this.state.text, (result) => {
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


const mapStateToProps = (state, ownProps) => {
    // console.log(state)

    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    // _persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
        return {}
    }

    if(!state.auth.isLogin){
        return;
    }

    return{
        uid: makeUidState(state, ownProps),
        groups: makeGroupsState(state, ownProps),
    }
}

export default connect(mapStateToProps, actions)(EditGroupNamePage);