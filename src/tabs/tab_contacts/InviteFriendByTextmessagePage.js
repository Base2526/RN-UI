import React from 'react'
import {View, Text, FlatList, TouchableOpacity} from 'react-native'
import Contacts from 'react-native-contacts';
import { connect } from 'react-redux';
import {Platform, PermissionsAndroid} from 'react-native'; 

import MessageCompose from 'react-native-message-compose';

import * as actions from '../../actions'
import {getUid, getHeaderInset} from '../../utils/Helpers'

import {makeUidState} from '../../reselect'

class InviteFriendByTextmessagePage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: 'Invite friend by text',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
        },
    })
    
    constructor(props){
        super(props)
        this.state ={
            contacts:[]
        }
        this.getContacts = this.getContacts.bind(this);
        this.requestCameraPermission = this.requestCameraPermission.bind(this);
    }
    
    componentWillMount(){
        if(Platform.OS === 'android'){
            this.requestCameraPermission();
        }else{
            this.getContacts()
        }

    }

    getContacts(){
        Contacts.getAll((err, contacts) => {
            if (err) throw err;
          
            // contacts returned
            console.log(contacts)
            
            let items =[]
            
            contacts.map((contact) => {
                // console.log(contact.givenName)
                let item ={}
                item.name = contact.givenName
                if(contact.phoneNumbers.length > 0){
                    contact.phoneNumbers.map((phoneNumber) => {
                        // console.log(phoneNumber.number)

                        item.number = phoneNumber.number
                    })

                    items.push(item)
                }
                // emailAddresses
                // if(contact.emailAddresses.length > 0){
                //     // contact.emailAddresses.map((emailAddresse) => {
                //     //     // console.log(emailAddresse.email)

                //     //     item.email = emailAddresse.email
                //     // })

                //     item.email = contact.emailAddresses
                // }
                // items.push(item)
            });

            this.setState({
                contacts:items
            })

            console.log(this.state.contacts)
        })
    }

    async requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              'title': 'Cool Photo App Camera Permission',
              'message': 'Cool Photo App needs access to your camera ' +
                         'so you can take awesome pictures.'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the contacts")
            this.getContacts()
          } else {
            console.log("contacts permission denied")
          }
        } catch (err) {
          console.warn(err)
        }
    }

    async sendMessage(phoneNumber) {
      try {
        const res = await MessageCompose.send({
          recipients: [phoneNumber],
          subject: 'Join me on DNA',
          body: 'Join me on DNA',
          attachments: [{
            // filename: 'mytext',
            // ext: '.txt',
            // mimeType: 'text/plain',
            text: 'Join me on DNA',
          }],
        });
        console.log(res);
      } catch (e) {
        console.log('error', e);
      }
    }
    
    async sendMessage2(phoneNumber) {
        try {
          await MessageCompose.send({
            recipients: [phoneNumber],
            subject: 'Join me on DNA',
            body: 'Join me on DNA, the all-in-one communication app! https://line.me/ti/p/2NH1U25c58',
            // ![NOTE] SMS attachments are not supported in Android.
            // attachments: [{
            //   filename: 'mytext', // [Optional] If not provided, UUID will be generated.
            //   ext: '.txt',
            //   mimeType: 'text/plain',
            //   text: 'Hello my friend', // Use this if the data is in UTF8 text.
            // //   data: '...BASE64_ENCODED_STRING...', // Or, use this if the data is not in plain text.
            // }],
            attachments: [{
              filename: 'mytext',
              ext: '.txt',
              mimeType: 'text/plain',
              text: 'Hello my friend',
            }],
          });
        } catch (e) {
          // e.code may be 'cannotSendText' || 'cancelled' || 'failed'

          console.log(e)
        }
      }

    ItemSeparatorComponent = () => {
        return (
          <View
            style={{
              height: .5,
              width: "95%",
              backgroundColor: "#CED0CE",
              marginLeft: "5%"
            }}
          />
        );
    }

    renderItem = ({item, index}) => {
        console.log(item)
        return(<View style={{padding:10, justifyContent:'center'}}>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>{item.name}</Text>
                    <Text>{item.number}</Text>

                    <TouchableOpacity 
                        style={{borderWidth:1, 
                                borderColor:'gray', 
                                padding:5,
                                position:'absolute',
                                right:0,
                                marginRight: 10}}
                        onPress={()=>{
                            this.sendMessage(item.number)
                        }}>
                        <Text style={{fontWeight:'bold'}}>+ Invite</Text>
                    </TouchableOpacity>
               </View>)
    }

    render(){
        return(<View style={{flex:1}}>
                <FlatList
                    data={this.state.contacts}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={this.ItemSeparatorComponent}
                />
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

  return({
    uid: makeUidState(state, ownProps),
  })
}
  
export default connect(mapStateToProps, actions)(InviteFriendByTextmessagePage);