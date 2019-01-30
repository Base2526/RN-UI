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
        headerStyle: {
            backgroundColor: 'rgba(186, 53, 100, 1.0)',
        },
        headerRight: (
            <TouchableOpacity
              style={{paddingRight:10}}
              onPress={() => {
                const { params = {} } = navigation.state
                params.handleAddMember()
              }}>
              <Text style={{fontSize:16, fontWeight:'600'}}>Add</Text>
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
        const data = navigation.getParam('members', null);

        // console.log(members)

        // let members = group.group_profile.members
        let friends = auth.users.friends

        let key = []
        _.each(data, function(_v, _k) { 
            key.push(_v)
        });

        let newData = []
        _.each(friends, function(_v, _k) { 
            let find = key.find(k => k.friend_id==_k)
            if(find === undefined){
                newData.push({..._v, friend_id:_k})
            }else{
                newData.push(find)
            }
        });

        this.setState({data:newData})    
        
        // console.log(new Date())
    }

    handleAddMember = () =>{
        // alert('handleAddMember')

        let newData = this.state.data.filter(function(item){
            return item.seleted == true;
        })

        // console.log(newData)
        newData.sort(function(a, b) {
            var dateA = new Date(a.create), dateB = new Date(b.create);
            return dateA - dateB;
        });

        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onSeleted(newData);
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
            this.state.data[index].create = new Date()
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
                            style={{padding:5}}
                            onPress={()=>{
                                this.onSeleted(index)
                            }}>

                            <Image
                                style={{ width: 30, height: 30}}
                                source={ seleted ? require('../../Images/icon-unselect.svg') : require('../../Images/icon-select.svg')}
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