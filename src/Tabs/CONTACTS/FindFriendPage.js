import React from 'react'

import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';

import DictStyle from './dictStyle';

import * as actions from '../../Actions'
import {getUid, getHeaderInset} from '../../Utils/Helpers'
import ImageWithDefault from '../../Utils/ImageWithDefault'

const Header = props => (
  <View style={{flex:1, alignItems:'flex-end', flexDirection:'row'}}>
      <View style={{flex:1}}>
          <TouchableOpacity
              style={{marginBottom:10}}
              onPress={() => {
                  props.navigation.goBack(null)
              }}>
              <View style={{flexDirection:'row', marginLeft:5}}>
                <Icon name={'chevron-left'} size={25} />
                <Text style={{alignSelf:'center', fontSize:18, marginLeft:5}}>Back</Text>
              </View>
          </TouchableOpacity>
      </View>
  </View>
);

const ImageHeader = (props) => {
  return(<View style={{ backgroundColor: 'rgba(186, 53, 100, 1.0)', height: getHeaderInset(true) }}>
          <Header {...props} style={{ backgroundColor: 'transparent' }}/> 
        </View>)
}

class FindFriendPage extends React.Component{

  static navigationOptions = ({ navigation }) => ({
      title: "Add Friends",
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
        renderContent: false,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false
      };
  }

  componentDidMount() {
    setTimeout(() => {this.setState({renderContent: true})}, 0);

    this.setState({
      error: null,
      refreshing: false
    });

    this.props.actionPeopleYouMayKhow().then((result) => {
      if(result.status){
        // this.setState({data:result.data.data});
      }else{

      }
    })
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
    
  handleRefresh = () => {
    // this.setState(
    //   {
    //     page: 1,
    //     seed: this.state.seed + 1,
    //     refreshing: true
    //   },
    //   () => {
    //     this.makeRemoteRequest();
    //   }
    // );
  };

  handleLoadMore = () => {
    // this.setState(
    //   {
    //     page: this.state.page + 1
    //   },
    //   () => {
    //     this.makeRemoteRequest();
    //   }
    // );
  };

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

  renderHeader = () => {
    // return <SearchBar placeholder="Type Here..." lightTheme round />;
    return(
      <View style={{flexDirection:'row', backgroundColor:'rgba(186, 53, 100, 1.0)', padding:20}}>
          <View style={{flex:1}}>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor:'gray'}}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', marginLeft:10, padding:5 }}>
            <TouchableOpacity>
              <Text style={{}}>Search</Text>
            </TouchableOpacity>
          </View>
      </View>)
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderItem = ({item, index}) => {
      // return here
      // console.log("renderItem : " + index)
      
    switch(index){
      case 0:{
          return(<View><Text>People you may know.</Text></View>)
      }
      break
      default:{
          return(
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    borderColor: DictStyle.colorSet.lineColor,
                    flexDirection: 'row',
                    backgroundColor: 'white'
                  }}>
                  <View style={{flex:1, alignItems:'center'}}>
                    <TouchableOpacity 
                      style={{
                              height: 40,
                              width: 40,
                              borderRadius: 10,
                              alignItems:'center'}}
                      onPress={
                        ()=>this.props.navigation.navigate("FriendProfilePage")
                      }>
                      <ImageWithDefault 
                        source={{uri: item.url_image}}
                        style={{width: 40, height: 40, borderRadius: 10, borderWidth:1, borderColor:'gray'}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex:3}}>
                    <TouchableOpacity 
                          onPress={
                            ()=>this.props.navigation.navigate("FriendProfilePage")
                          }>
                      <Text style={{
                                  fontSize: 18, 
                                  color: DictStyle.colorSet.normalFontColor,
                                  paddingLeft: 5}}>
                          {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex:2}}>
                    <TouchableOpacity
                        style={{
                            borderRadius:10,
                            top:3,
                            right:0,
                            borderWidth:1,
                            borderColor:'gray',
                            alignItems:'center',
                            padding:10}}
                          onPress={
                            ()=>{
                              // console.log(item.uid)
                              // console.log(this.props.uid)
                              // this.props.navigation.goBack()

                              let uid = this.props.uid
                              let friend_id = item.uid

                              this.setState({loading:true})
                              this.props.actionAddFriend(uid, friend_id).then((result) => {
                                console.log(result)

                                console.log('uid : ' + uid)
                                console.log('friend_id : ' + friend_id)

                                this.setState({loading:false})
                                // this.setState({loading: false})
                                if(result.status){
                                  // this.props.navigation.navigate("App") 
                                  // this.setState({data:result.data.data});

                                  switch(result.data.friend_status){
                                    case 99:{
                                      
                                    }
                                    case -1:{

                                    }
                                  }
                                }else{
                          
                                }
                              })
                            }
                          }>
                        <Text style={{color:'red', fontSize:14}}>Add Friend</Text>
                    </TouchableOpacity>
                  </View>
                </View>
          )
      }
    }   
  }
  
  render() {
      // let swipeBtns = [{
      //   text: 'Delete',
      //   backgroundColor: 'red',
      //   underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      //   onPress: () => { this.deleteNote(rowData) }
      // }];

      let {
        renderContent
      } = this.state;

      // this.setState({data:result.data.data});

      console.log(this.state.data)

      // if (this.state.data instanceof Object) console.log('Object!');
  
      return (
        <View style={{flex:1, backgroundColor: 'white'}}>
        {this.renderHeader()}
        {
        renderContent && 
          
          <FlatList
            data={this.state.data}
            // renderItem={({ item }) => (
            //   <ListItem
            //     roundAvatar
            //     title={`${item.name.first} ${item.name.last}`}
            //     subtitle={item.email}
            //     avatar={{ uri: item.picture.thumbnail }}
            //     containerStyle={{ borderBottomWidth: 0 }}
            //     onPress={()=>console.log("item click")}
            //   />
            // )}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            // onRefresh={this.handleRefresh}
            // refreshing={this.state.refreshing}
            // onEndReached={this.handleLoadMore}
            onEndReachedThreshold={20}
            initialNumToRender={5}
          />
        }
        </View>
      );
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     actions
//   }
// }

const mapStateToProps = (state) => {
  console.log(state)
  return({
      // loading:state.auth.loading,
      // isLogin:state.auth.isLogin
      uid:getUid(state)
  })
}

export default connect(mapStateToProps, actions)(FindFriendPage);