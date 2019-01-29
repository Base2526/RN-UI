import React from 'react'
import {View, Text, FlatList, TouchableOpacity} from 'react-native'
import Contacts from 'react-native-contacts';
import { ListItem } from "react-native-elements";
import {Platform, PermissionsAndroid} from 'react-native'; 
import Icon from 'react-native-vector-icons/FontAwesome5';

import {getUid, getHeaderInset} from '../../Utils/Helpers'

export default class InviteFriendForContactPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: 'Invite Friend',
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
                }
                // emailAddresses
                if(contact.emailAddresses.length > 0){
                    // contact.emailAddresses.map((emailAddresse) => {
                    //     // console.log(emailAddresse.email)

                    //     item.email = emailAddresse.email
                    // })

                    item.email = contact.emailAddresses
                }
                items.push(item)
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

    render(){
        return(<View style={{flex:1}}>
            <FlatList
        data={this.state.contacts}
        renderItem={({ item }) => (
            // console.log(item)
            // <View>
            //     <Text>{item.name}</Text>
            //     <Text>{item.number}</Text>
            //     <Text>{JSON.stringify(item.email)}</Text>
            // </View>
          <ListItem
            roundAvatar
            title={item.name}
            subtitle={`${item.number} : ${JSON.stringify(item.email)}`}
            // avatar={{ uri: item.picture.thumbnail }}
          />
        )}
      />
        </View>)
    }
}