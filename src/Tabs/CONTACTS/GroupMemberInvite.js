import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity,} from 'react-native'
import { connect } from 'react-redux';
var _ = require('lodash');

// import SubmitButton from 'react-native-submit-button';

// import ImageWithDefault from '../../Utils/ImageWithDefault'
import {getStatusBarHeight} from '../../Utils/Helpers'
import * as actions from '../../Actions'

import GroupMemberInviteItem from '../../test/GroupMemberInviteItem'

class GroupMemberInvite extends React.Component{
    
    static navigationOptions = ({ navigation }) => ({
        title: "Invite members",
        headerTintColor: '#C7D8DD',
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
        super(props)

        this.state = {
            data: [],
            buttonState: 'normal'
        }
    }

    componentDidMount(){
        const { navigation, auth } = this.props;
        const group = navigation.getParam('group', null);

        let members = group.group_profile.members
        let friends = auth.users.friends

        let key = []
        _.each(members, function(_v, _k) { 
            key.push(_v.friend_id)
        });

        let data = []
        _.each(_.omit(friends,key), function(_v, _k) { 
            data.push(_v)
        });

        console.log(data)

        this.setState({data})
    }

    onSubmit = () => {
        console.log('api call')
        setTimeout(() => {
          this.setState({ buttonState: 'success' });
          console.log('api call > onSubmit')
        }, 2000); // if success, else this.setState({ buttonState: 'error' })
    };

    renderItem = ({ item, index }) => {
        console.log(item)
        return (<GroupMemberInviteItem item={item} index={index} handleCallback={this.handleCallback}/>)
    }

    handleCallback =(item)=> {
        console.log('-- handleCallback', item) 
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
      };

    render(){
        return(<View style={{flex:1}}> 
                <FlatList
                    style={{}}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    extraData={this.state.data}
                    ItemSeparatorComponent={this.renderSeparator}
                />
               </View>)
    }
}

const mapStateToProps = (state) => {
    // console.log(state)

    if(!state._persist.rehydrated){
      return {}
    }
  
    return{
      auth:state.auth
    }
}

export default connect(mapStateToProps, actions)(GroupMemberInvite);