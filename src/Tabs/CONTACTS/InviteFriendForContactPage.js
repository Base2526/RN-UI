import React from 'react'
import {View, Text, FlatList} from 'react-native'

import Contacts from 'react-native-contacts';
import { ListItem } from "react-native-elements";

export default class InviteFriendForContactPage extends React.Component{
    
    constructor(props){
        super(props)
        this.state ={
            contacts:[]
        }
    }
    
    componentWillMount(){
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
        // console.log(Contacts)
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