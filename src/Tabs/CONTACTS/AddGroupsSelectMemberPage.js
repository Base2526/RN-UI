// import React from 'react'
// import {View, Text} from 'react-native'

// export default class AddGroupsSelectMemberPage extends React.Component {

//     render(){
//         return(<View><Text>AddGroupsSelectMemberPage</Text></View>)
//     }
// }

import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList,  
        TouchableOpacity,} from 'react-native'
import { connect } from 'react-redux';
var _ = require('lodash');

import Image from 'react-native-remote-svg'
// import SubmitButton from 'react-native-submit-button';

// import ImageWithDefault from '../../Utils/ImageWithDefault'
import {getStatusBarHeight} from '../../Utils/Helpers'
import * as actions from '../../Actions'

import ImageWithDefault from '../../Utils/ImageWithDefault'

class AddGroupsSelectMemberPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "",
        headerRight: (
            <TouchableOpacity
              style={{paddingRight:10}}
              onPress={() => {
                const { params = {} } = navigation.state
                params.handleAddMember()
              }}>
              <Text style={{fontSize:16, fontWeight:'600'}}>Add Member</Text>
            </TouchableOpacity>
          ),
    })

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            buttonState: 'normal'
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({ handleAddMember: this.handleAddMember })
    

        const { navigation, auth } = this.props;
        // const group = navigation.getParam('group', null);

        
        // let members = group.group_profile.members
        let friends = auth.users.friends

        // let key = []
        // _.each(members, function(_v, _k) { 
        //     key.push(_v.friend_id)
        // });

        let data = []
        _.each(friends, function(_v, _k) { 
            data.push({..._v, friend_id:_k})
        });

        this.setState({data})    
        
        console.log(data)
    }

    handleAddMember = () =>{
        alert('handleAddMember')
    }

    onSubmit = () => {
        console.log('api call')
        setTimeout(() => {
          this.setState({ buttonState: 'success' });
          console.log('api call > onSubmit')
        }, 2000); // if success, else this.setState({ buttonState: 'error' })
    };

    onSeleted = (index) =>{
        let newData = [...this.state.data];
        if(this.state.data[index].seleted === undefined){
            this.state.data[index].seleted = true
        }else{
            this.state.data[index].seleted = !this.state.data[index].seleted
        }

        this.setState({
            data:newData
        })
    }

    renderItem = ({ item, index }) => {
        let seleted = false
        if(this.state.data[index].seleted === undefined){
            seleted = true
        }else{
            seleted = !this.state.data[index].seleted
        }

        return(<View style={{flex:1, 
                    height:80, 
                    padding:10, 
                    marginRight:10,
                    backgroundColor:'white', 
                    flexDirection:'row',
                    alignItems:'center',}}>
                    <View style={{padding:10}}>
                        <TouchableOpacity 
                            onPress={()=>{
                                this.onSeleted(index)
                            }}>
                            <Image
                                style={{ width: 25, height: 25}}
                                source={ seleted ? require('../../Images/icon-unselect.svg') : require('../../Images/collapse_down.svg')}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        style={{height: 60,
                                width: 60,
                                borderRadius: 30}}>
                        <ImageWithDefault 
                        source={{uri: item.profile.image_url}}
                        style={{width: 60, height: 60, borderRadius: 30, borderColor:'gray', borderWidth:1}}/>
                    </TouchableOpacity>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.profile.name}</Text>
                    </View>
                </View>)

    }

    handleCallback =(item)=> {
        console.log('-- handleCallback', item) 
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#CED0CE",
            //   marginLeft: "14%"
            }}
          />
        );
    };

    render(){
        return(<View style={{flex:1}}>
                    <FlatList
                        // style={{}}
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

export default connect(mapStateToProps, actions)(AddGroupsSelectMemberPage);