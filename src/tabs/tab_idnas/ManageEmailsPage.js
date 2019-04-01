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
        title: 'List email',
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
        // console.log(props)
        /*
        let {emails, my_applications} = props
        let {item_id} = this.state

        let my_application =_.find(my_applications, (v, k)=>{
                                return k == item_id
                            })

        console.log(my_application, emails)

        let data =  _.map(emails, (v, k)=>{
                        if(my_application.emails !== undefined){
                            let __ = _.find(my_application.emails, (ev, ek)=>{
                                        return k == ev
                                      })

                            console.log(__)
                            if(__ !== undefined){
                                return {...v, email_key:k, select:true}
                            }
                        }

                        return {...v, email_key:k, select:false}
                    })
        

        this.setState({data})
        */

        let {application_id} = this.state
        let {emails, my_applications} = props

        console.log(my_applications)

        let my_application =_.find(my_applications, (v, k)=>{
                                return k == application_id
                            })

        let data =  _.map(emails, (v, k)=>{
                        if( !isEmpty(my_application.emails) ){
                            let email =_.find(my_application.emails, (ev, ek)=>{
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
        console.log(item, index)

        let {data} = this.state

        let new_data = [...data];
        new_data[index] = {...new_data[index], select: !item.select};

        this.setState({data:new_data})

        // console.log(item, new_data, index)
        
        /*
        let {emails, my_applications} = this.props
        let {item_id} = this.state

        let my_application =_.find(my_applications, (v, k)=>{
                                return k == item_id
                            })

        let __em = my_application.emails

        if(__em === undefined){
            __em = [item.email_key]
            
            this.props.actionMyApplicationEmail(this.props.uid, this.state.item_id, __em, (result) => {
                console.log(result)
            })
        }else{
            let _find = __em.find(v=>{
                return v == item.email_key;
            })

            let newValue = null
            if(_find === undefined){
                newValue = [...__em, item.email_key]
            }else{
                newValue = __em.filter(function(v) { 
                    return v != item.email_key
                })
            }


            this.props.actionMyApplicationEmail(this.props.uid, this.state.item_id, newValue, (result) => {
                console.log(result)
            })

        }
        */

        // console.log(my_application)
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
        //   uid:getUid(state),
        //   emails:state.auth.users.profiles.emails,
        //   my_applications:state.auth.users.my_applications
        uid: makeUidState(state, ownProps),
        emails: makeEmailsState(state, ownProps),
        my_applications: makeMyAppicationsState(state, ownProps),
    }
}


/// test
  
export default connect(mapStateToProps, actions)(ManageEmailsPage)