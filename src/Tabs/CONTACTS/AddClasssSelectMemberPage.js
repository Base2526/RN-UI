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

class AddClasssSelectMemberPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "",
        headerTintColor: 'white',
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
              <Text style={{fontSize:18, fontWeight:'600', color:'white'}}>Add</Text>
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
                            {/* <Image
                                style={{ width: 30, height: 30}}
                                source={ seleted ? require('../../Images/icon-unselect.svg') : require('../../Images/icon-select.svg')}
                            /> */}


                            <Image
                                style={{ width: 30, height: 30}}
                                source={{uri:seleted ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24.178" height="24.181" viewBox="0 0 24.178 24.181">
                                <g id="Group_489" data-name="Group 489" transform="translate(-207.998 -121.569)">
                                <ellipse id="NoPath_-_Copy_36_" data-name="NoPath - Copy (36)" cx="12.089" cy="12.091" rx="12.089" ry="12.091" transform="translate(207.998 121.569)" fill="#e6e6e6"/>
                                </g>
                            </svg>`:
                            `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 734.86 734.86"><defs><style>.cls-1{fill:#df2d6c;}.cls-2{fill:#fff;}</style></defs><title>select</title><g id="Layer_2" data-name="Layer 2"><circle class="cls-1" cx="367.43" cy="367.43" r="367.43"/></g><g id="Layer_4" data-name="Layer 4"><path class="cls-2" d="M638,347.51c0,1,0,2.06,0,3.08v.13q0,1.47-.12,2.94c0,.89-.1,1.78-.17,2.66,0,.29,0,.58-.06.86-.06.84-.14,1.68-.23,2.52a0,0,0,0,1,0,.05C624,494.49,399,660.15,399,660.15S167,491.58,160.16,353.64c0-1-.09-2-.12-3.05s0-2,0-3.08a119.49,119.49,0,0,1,239,0,119.49,119.49,0,0,1,239,0Z" transform="translate(-31.55 -27.41)"/></g></svg>`}} />
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

export default connect(mapStateToProps, actions)(AddClasssSelectMemberPage);