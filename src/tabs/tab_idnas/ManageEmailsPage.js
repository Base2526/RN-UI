import React from 'react'
import {View, 
        Text, 
        TouchableOpacity, 
        ActivityIndicator, 
        TextInput,
        ScrollView,
        FlatList} from 'react-native';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker';
// import Image from 'react-native-remote-svg'
import Spinner from 'react-native-loading-spinner-overlay';

var _ = require('lodash');

import { connect } from 'react-redux';
import * as actions from '../../actions'
import {isEmpty} from '../../utils/Helpers'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeEmailsState,
        makeMyAppicationsState } from '../../reselect'

class ManageEmailsPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: 'Select email',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
            // ios navigationoptions underline hide
            borderBottomWidth: 0,

            // android navigationoptions underline hide
            elevation: 0,
            shadowOpacity: 0
        },
    })

    constructor(props) {
        super(props);
        this.state = {
            item_id: 0,
            application_id: 0,
            data: [],
            loading: false
        }
    }

    componentDidMount() {
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
        let {application_id} = this.state
        let {emails, my_applications} = props

        let my_application =_.find(my_applications, (v, k)=>{
                                return k == application_id
                            })

        let data =  _.map(emails, (v, k)=>{
                        if( !isEmpty(my_application.emails) ){
                            let my_application_emails = JSON.parse(my_application.emails)
                            let email = my_application_emails.find((ev, ek)=>{
                                            return k == ev
                                        })

                            if( !isEmpty(email) ){
                                return {...v, email_key:k, select:true}
                            }
                        }
                        return {...v, email_key:k, select:false}
                    })

        this.setState({data})
    }

    select = (item, index) =>{
        let {uid} = this.props
        let {data, application_id} = this.state

        let new_data = [...data];
        new_data[index] = {...new_data[index], select: !item.select};

        let select_emails = []
        new_data.map((v, k)=>{
                        if(v.select){
                            select_emails.push(v.email_key)
                        }
                    })

        this.setState({loading:true})
        this.props.actionMyApplicationEmail(uid, application_id, JSON.stringify(select_emails), (result) => {
            this.setState({data:new_data, loading:false})
        })

    }

    renderItem = ({item, index}) => { 
        return( <TouchableOpacity
                    onPress={()=>{
                        this.select(item, index)
                    }}>
                <View style={{flex:1, 
                              padding:20, 
                              backgroundColor:'white', 
                              flexDirection:'row', 
                              alignItems:'center',}}>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.email}</Text>
                    </View>
                    <View style={{position:'absolute', right:0, padding:10}}>
                        <MyIcon
                            name={'check-ok'}
                            size={20}
                            color={item.select ? '#CE3B6E' : '#C7D8DD'} />
                    </View>
                </View>
                </TouchableOpacity>)
    }

    ItemSeparatorComponent = () => {
        return (
          <View
            style={{
              height: .5,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
    }

    render() {

        let {data, loading} = this.state
        
        return(<View style={{ flex:1}}>
                    <Spinner
                        visible={loading}
                        textContent={'Wait...'}
                        textStyle={{color: '#FFF'}}
                        overlayColor={'rgba(0,0,0,0.5)'}/>
                    <FlatList
                        data={data}
                        ItemSeparatorComponent = {this.ItemSeparatorComponent}
                        renderItem={this.renderItem}
                        extraData={data}/>
                </View>)
    }
}

const mapStateToProps = (state, ownProps) => {
    // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
    //_persist.rehydrated parameter is initially set to false
    if(!state._persist.rehydrated){
      return {}
    }

    if(!state.auth.isLogin){
        return;
    }
  
    return{
        uid: makeUidState(state, ownProps),
        emails: makeEmailsState(state, ownProps),
        my_applications: makeMyAppicationsState(state, ownProps),
    }
}
  
export default connect(mapStateToProps, actions)(ManageEmailsPage)