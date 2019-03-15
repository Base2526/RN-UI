import React from 'react'

import { View, 
        Text, 
        StyleSheet, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        TouchableHighlight, 
        TextInput,
        SectionList,
        Dimensions,
        Alert} from 'react-native';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'
import {getUid} from '../../Utils/Helpers'
import MyIcon from '../../config/icon-font.js';

import {makeUidState,  
        makeFriendsState, 
        makeFriendProfilesState,} from '../../Reselect'

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
  title: 'Select Avatar',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  quality: 0.7,
  maxWidth: 500,
  maxHeight: 500,
};

const formatData = (data, numColumns) => {
  // เป้นการ ลบ item ที่มี ​field ออกทั้งหมด เพราะว่าเรารองรับการ orientation srceen ด้วย
  data = data.filter(function(item){
    return !('empty' in item);
  }).map((item)=>{
    return item;
  });

  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ name: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const calculatorWidthHeightItem=(margin, itemRow)=>{
  let {width, height} = Dimensions.get('window')

  return (width - (margin* (itemRow*2))) / itemRow
}

class AddGroupsPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Create group",
        headerTintColor: '#C7D8DD',
        headerStyle: {
          backgroundColor: 'rgba(186, 53, 100, 1.0)',

          // ios navigationoptions underline hide
          borderBottomWidth: 0,

          // android navigationoptions underline hide
          elevation: 0,
          shadowOpacity: 0
        },
        headerRight: (
            <TouchableOpacity
                style={{paddingRight:10}}
                onPress={() => {
                  const { params = {} } = navigation.state
                  params.handleCreateGroup()
                }}>
                <Text style={{fontSize:18, fontWeight:"bold", color:'#C7D8DD'}}>Create</Text>
            </TouchableOpacity>
          ),
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
          refreshing: false,
          text: '',
          avatarSource: {"uri":""},
          seleteds: [],
          groupName: '',
          orientation:'PORTRAIT',
          numColumns:6,
          sections : [
            {
              title: "Members",
              key: "1",
              data: [
               {
                 key: "1",
                 list: [
                    {}
                  ],
                },
              ],
            },
          ]
        };
    }

    componentDidMount() {
      this.props.navigation.setParams({ handleCreateGroup: this.handleCreateGroup })
      this.loadData(this.props)
    }

    onLayout(e) {
      const {width, height} = Dimensions.get('window')
      if(width<height){
        this.setState({orientation:'PORTRAIT', numColumns:6})
      }else{
        this.setState({orientation:'LANDSCAPE', numColumns:8})
      }
    }

    loadData=(props)=>{
      let friend_member = []
      let {friends, friend_profiles} = props

      // console.log(this.props.auth.users.friends)
      for (var key in friends) {
    
        let friend =  friends[key]
        // let friend_profile = friend_profiles[key]

        let profile = _.find(friend_profiles, (v, k)=>{
                        return k == key
                      })

        // console.log(friend)
        switch(friend.status){
          case Constant.FRIEND_STATUS_FRIEND:{
            friend_member.push({...friend, ...{'friend_id':key}, profile});
            break
          }
        }
      }
      // return friend_member

      this.setState({data:friend_member, renderContent: true})
    }

    handleCreateGroup = () => {
      let groupName = this.state.groupName.trim()
      let uri = this.state.avatarSource.uri; 

      let seleteds = []
      let list = this.state.sections[0].data[0].list
      list.map((value) => {
        if(value.friend_id !== undefined){
          seleteds.push(value.friend_id)
        }
      })

      if(groupName === "" && uri === "" && seleteds.length === 0){
        alert("Group name and Image && Select friend is empty.")
      }else if(groupName === ""){
        alert("Group name is empty.")
      }else if(uri === ""){
        alert("Image is empty.")
      }else if(seleteds.length === 0){
        alert("Select friend is empty.")
      }else{

        this.setState({loading:true})
        this.props.actionCreateGroup(this.props.uid, groupName, seleteds, this.state.avatarSource.uri).then((result) => {
          console.log(result)

          if(result.status){
            setTimeout(() => {
              this.setState({loading:false})
              this.props.navigation.goBack(null)
            }, 200);
          }else{
            this.setState({loading:false})
            setTimeout(() => {
              Alert.alert(result.message);
            }, 100);
          }
        })
      }
    }
    
    onSeleted = (values) =>{
      let newSections = this.state.sections
      newSections[0].data[0].list = [{},...values]

      this.setState({
        sections: newSections
      })
    }

    onDeleted = (index) =>{
      let newSections = this.state.sections
      let list = newSections[0].data[0].list;

      let newList = list.filter(function(value, key){
        return key != index;
      })

      newSections[0].data[0].list = newList

      this.setState({
        sections: newSections
      })
    }

    onSelectImage = () => {
      /**
       * The first arg is the options object for customization (it can also be null or omitted for default options),
       * The second arg is the callback which sends object: response (more info in the API Reference)
       */
      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri }

          this.setState({
            avatarSource: source,
          });
          // console.log(this.state.avatarSource.uri)
        }
      });
    }
  
    renderHeader = () => {
      return(
        <View style={{justifyContent:'center', backgroundColor:'white'}}>
        <View style={{flexDirection:'row', 
                      marginLeft:5,
                      marginRight:5,
                      marginTop:15,
                      marginBottom:15, 
                      justifyContent:'center',}}>
            <TouchableOpacity 
                onPress={()=>{
                  this.onSelectImage()
                }}>
              <FastImage
                  style={{width: calculatorWidthHeightItem(5, this.state.numColumns), 
                          height: calculatorWidthHeightItem(5, this.state.numColumns), 
                          borderRadius: calculatorWidthHeightItem(5, this.state.numColumns) /2, 
                          backgroundColor: '#FF83AF',
                        }}
                  source={{
                    uri: this.state.avatarSource.uri === "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.avatarSource.uri,
                    headers:{ Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.normal}
              />
              <TouchableOpacity
                style={{position:'absolute', bottom:0, right:0}}
                onPress={()=>{
                  this.onSelectImage()
                }}
                >
                <MyIcon
                  name={'camera'}
                  size={20}
                  color={'#C7D8DD'} />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={{justifyContent:'center', flex:1, marginLeft:10}}>
              <TextInput style = {{fontSize:26}}
                  underlineColorAndroid = "transparent"
                  placeholder = "Input group name"
                  placeholderTextColor = "gray"
                  autoCapitalize = "none"
                  ref= {(el) => { this.groupName = el; }}
                  onChangeText = {this.handleGroupName}
                  value={this.state.groupName}/>
            </View>
        </View>
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#CED0CE",
            // marginLeft: "14%"
            position:'absolute',
            bottom:0
          }}/>
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

    handleGroupName = (groupName) => {
        this.setState({ groupName })
    }

    _check=(friend_id)=>{

      let seleteds = this.state.seleteds
      let check = seleteds.find(function(element) { 
        return element === friend_id; 
      }); 

      if(check === undefined){
        this.setState({
          seleteds: [...seleteds, friend_id]
        })
      }else{
        let newSeleteds = seleteds.filter(function(member) {
          return member !== friend_id;
        });

        this.setState({
          seleteds:newSeleteds
        })
      }
    }

    renderListItem = ({item, index}) => { 
      
      if ('empty' in item) {
        return <View style={{height: 120, 
          width: 100, 
          flex:1,
          justifyContent:'center', 
          alignItems:'center',
          backgroundColor: 'transparent',}} />;
      }

      if(index == 0){
        return(<TouchableOpacity
                style={{margin:5, 
                        width: calculatorWidthHeightItem(5, this.state.numColumns), 
                        height: calculatorWidthHeightItem(5, this.state.numColumns),
                        backgroundColor:'#E9E9E9',
                        justifyContent:'center',
                        borderRadius: calculatorWidthHeightItem(5, this.state.numColumns)/2,
                        alignItems:'center'}}
                onPress={()=>{
                  let list = this.state.sections[0].data[0].list;
                  let newList = list.filter(function(value, key){
                    return key != 0;
                  })
                  this.props.navigation.navigate("AddGroupsSelectMemberPage", { onSeleted: this.onSeleted, members:newList })
                }}>
                <MyIcon
                  name={'plus'}
                  size={calculatorWidthHeightItem(5, this.state.numColumns)/3}
                  color={'#ADADAD'} />
              </TouchableOpacity>)
      }

      return(<TouchableOpacity
              style={{padding:5}}
              onPress={()=>{

              }}>
              <FastImage
                  style={{width: calculatorWidthHeightItem(5, this.state.numColumns),  
                          height: calculatorWidthHeightItem(5, this.state.numColumns),
                          borderRadius: calculatorWidthHeightItem(5, this.state.numColumns)/2, 
                          // borderColor:'gray', 
                          // backgroundColor: '#FF83AF',
                          // borderWidth:1
                        }}
                  source={{
                    uri: item.profile.image_url,
                    headers:{ Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.normal}
              />
              <TouchableOpacity
                style={{padding:5,
                        position:'absolute',
                        borderColor:'#ADADAD',
                        borderWidth:.5,
                        borderRadius:10,
                        right:0}}
                onPress={()=>{
                    this.onDeleted(index)
                }}>
                <MyIcon
                  name={'cancel'}
                  size={10}
                  color={'#ADADAD'} />
              </TouchableOpacity>
            </TouchableOpacity>)
    
    }
    
    renderSectionHeader = ({ section }) => {
      // console.log(section)
      return (<View style={{padding:10}}><Text style={{fontSize:18}}>{section.title}({this.state.sections[0].data[0].list.length == 1 ? '0': this.state.sections[0].data[0].list.length - 1}/50)</Text></View>)
    }

    renderSection = ({ item }) => {
      // console.log("renderSection")
      return (
        <FlatList
          key = {this.state.orientation}
          // data={item.list}
          /*  เราต้องมีการคำนวณ item ให้เต็มแต่ละแถว  */
          data = {formatData(item.list, this.state.numColumns)}
          numColumns={this.state.numColumns}
          renderItem={this.renderListItem}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
          contentContainerStyle={{flexGrow: 2, justifyContent: 'center'}}
          // style={{flex:1, backgroundColor:'red'}}
        />
      )
    }

    render() {
        let {renderContent, sections} = this.state;
        return (
          <View style={{flex:1, backgroundColor: 'white'}} onLayout={this.onLayout.bind(this)}>
          <Spinner
            visible={this.state.loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}
          />
          {this.renderHeader()}
          {
            renderContent &&
            <SectionList
              sections={sections}
              renderSectionHeader={this.renderSectionHeader}
              renderItem={this.renderSection}
              extraData={this.state}
            />
          }
          </View>
        );
      }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  if(!state.auth.isLogin){
    return;
  }

  return{
    uid:makeUidState(state, ownProps),
    friends:makeFriendsState(state, ownProps),
    friend_profiles:makeFriendProfilesState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(AddGroupsPage);