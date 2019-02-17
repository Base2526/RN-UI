import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList,  
        TouchableOpacity,} from 'react-native'
import { connect } from 'react-redux';
var _ = require('lodash');
import FastImage from 'react-native-fast-image'

import * as actions from '../../Actions'
import MyIcon from '../../config/icon-font.js';

class AddClasssSelectMemberPage extends React.Component{
    static navigationOptions = ({ navigation }) => ({
        title: "Select member",
        headerTintColor: '#C7D8DD',
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
              <Text style={{fontSize:18, fontWeight:'bold', color:'#C7D8DD'}}>Add</Text>
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

        return(<TouchableOpacity 
                onPress={()=>{
                    this.onSeleted(index)
                }}>
                <View style={{flex:1, 
                    height:80, 
                    padding:10, 
                    marginRight:10,
                    backgroundColor:'white', 
                    flexDirection:'row',
                    alignItems:'center',
                    paddingLeft:5, 
                    paddingRight:10}}>
                    <TouchableOpacity 
                        style={{paddingLeft:5, 
                                paddingRight:10}}
                        onPress={()=>{
                            this.onSeleted(index)
                        }}
                        >
                        <MyIcon
                            name={'dot-circled'}
                            size={30}
                            color={seleted ? '#E9E9E9' : '#DF2D6C'} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{
                            this.onSeleted(index)
                        }}>
                        <FastImage
                            style={{width: 60, 
                                    height: 60, 
                                    borderRadius: 30, 
                                    borderWidth:.5,
                                    borderColor:'gray'
                            }}
                            source={{
                            uri: item.profile.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                        <Text style={{fontSize:18}}>{item.profile.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>)

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
            }}
          />
        );
    };

    render(){
        return(<View style={{flex:1}}>
                    <FlatList
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