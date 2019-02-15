import React from 'react'

import {View, 
        Text, 
        TouchableOpacity, 
        TextInput, 
        FlatList,
        SectionList,
        Dimensions} from 'react-native'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import Constant from '../../Utils/Constant'
import * as actions from '../../Actions'
import {getUid} from '../../Utils/Helpers'
import ImageWithDefault from '../../Utils/ImageWithDefault'

import MyIcon from '../../config/icon-font.js';

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

  // console.log(width, (itemRow) )
  return (width - (margin* (itemRow*2))) / itemRow
}

class AddClasssPage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            className: '',
            avatarSource: {"uri":""},
            loading: false,
            data: [],
            seleteds: [],
            orientation:'PORTRAIT',
            numColumns:4,
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
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: "Add classs",
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
              params.handleCreateClass()
            }}>
            <Text style={{fontSize:18, fontWeight:'bold', color:'#C7D8DD'}}>Create</Text>
          </TouchableOpacity>
        ),
    })

    componentDidMount() {
      this.props.navigation.setParams({ handleCreateClass: this.handleCreateClass })
  
      this.setState({
        data: this.loadData(),
      });
    }

    onLayout(e) {
      const {width, height} = Dimensions.get('window')
      // console.log(width, height)
  
      if(width<height){
        this.setState({orientation:'PORTRAIT', numColumns:4})
      }else{
        this.setState({orientation:'LANDSCAPE', numColumns:6})
      }
    }

    loadData=()=>{
      let friend_member = []
      let friends = this.props.friends
      for (var key in friends) {
        let friend = friends[key]
        switch(friend.status){
          case Constant.FRIEND_STATUS_FRIEND:{            
            friend_member.push({...friend, ...{'friend_id':key}});
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_CANCEL:{
            break
          }

          case Constant.FRIEND_STATUS_FRIEND_REQUEST:{
            break
          }

          case Constant.FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
            break
          }
        }
      }
      return friend_member
    }

    handleCreateClass = () => {
      let className = this.state.className.trim()
      let uri = this.state.avatarSource.uri; 

      let seleteds = []
      let list = this.state.sections[0].data[0].list
      list.map((value) => {
        if(value.friend_id !== undefined){
          seleteds.push(value.friend_id)
        }
      })

      console.log(seleteds)

      if(className === "" && uri === ""){
        alert("Class name and Image is empty.")
      }else if(className === ""){
        alert("Class name is empty.")
      }else if(uri === ""){
        alert("Image is empty.")
      }else{
        console.log('className : ' + className + ", uri : " + uri)

        this.setState({loading:true})
        this.props.actionCreateClass(this.props.uid, className, seleteds, this.state.avatarSource.uri).then((result) => {
          console.log(result)

          this.setState({loading:false})
          if(result.status){
            this.props.navigation.goBack()
          }else{
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

    handleClass = (className) => {
      this.setState({ className })
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
          const source = { uri: response.uri };

          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };

          this.setState({
            avatarSource: source,
          });

          console.log(this.state.avatarSource.uri)
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
              <View style={{justifyContent:'center', flex:1, marginLeft:5}}>
                <TextInput style = {{fontSize:22}}
                    underlineColorAndroid = "transparent"
                    placeholder = "Input class name"
                    placeholderTextColor = "gray"
                    autoCapitalize = "none"
                    ref= {(el) => { this.className = el; }}
                    onChangeText = {this.handleClass}
                    value={this.state.className}/>
              </View>
            </View>
            {/* <View style={{position:'absolute', bottom:0, right:0, padding:5}}>
              <Text style={{fontSize:16, fontWeight:'bold'}}>{this.state.sections[0].data[0].list.length == 1 ? '0': this.state.sections[0].data[0].list.length - 1}/50</Text>
            </View> */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#CED0CE",
                position:'absolute',
                bottom:0
              }}
            />
        </View>)
    };

    renderItem = ({item, index}) => {      
      let check = null
      var __ = this.state.seleteds.find(function(element) { 
        return element === item.friend_id; 
      }); 

      if(__ !== undefined){
        check = <Icon name="check" size={15} />
      }

      return(
            <View
              style={{
                alignItems: 'center', 
                padding: 10,
                // borderColor: DictStyle.colorSet.lineColor,
                flexDirection: 'row',
                backgroundColor: 'white'
              }}
            >
              <View style={{flex:1, alignItems:'center'}}>
              <TouchableOpacity 
                  style={{height:60,
                          width: 60,
                          borderRadius: 10}}
                  onPress={()=>this.props.navigation.navigate("FriendProfilePage", {'friend_id': item.friend_id})}>
                    <ImageWithDefault 
                      source={{uri:item.profile.image_url}}
                      style={{width: 60, height: 60, borderRadius: 10, borderWidth:1, borderColor:'gray'}}/>
              </TouchableOpacity>
              </View>
              <View style={{flex:5}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this._check(item.friend_id)
                  }}
                  style={{flex:1, justifyContent:'center'}}>
                  <Text style={{
                              fontSize: 16, 
                              fontWeight: '600',
                              // color: DictStyle.colorSet.normalFontColor,
                              
                              paddingLeft: 10}}>
                      {item.profile.name}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, alignItems:'center'}}>
                <TouchableOpacity >
                  {check}
                </TouchableOpacity>
              </View>
            </View>
      )
    }

    renderSectionHeader = ({ section }) => {
      return (<View style={{padding:10}}><Text style={{fontSize:18}}>{section.title}({this.state.sections[0].data[0].list.length == 1 ? '0': this.state.sections[0].data[0].list.length - 1}/50)</Text></View>)
    }

    renderSection = ({ item }) => {
      return (
        <FlatList
          key = {this.state.orientation}
          /*  เราต้องมีการคำนวณ item ให้เต็มแต่ละแถว  */
          data = {formatData(item.list, this.state.numColumns)}
          numColumns={this.state.numColumns}
          renderItem={this.renderListItem}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
          contentContainerStyle={{flexGrow: 2, justifyContent: 'center'}}
        />
      )
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
                  this.props.navigation.navigate("AddClasssSelectMemberPage", { onSeleted: this.onSeleted, members:newList })
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
                          borderColor:'gray', 
                          // backgroundColor: '#FF83AF',
                          borderWidth:1
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

    render(){
      let {sections} = this.state;
      return(
          <View style={{flex:1}} onLayout={this.onLayout.bind(this)}>
          {this.renderHeader()}

          {/*
          <FlatList
            style={{flex:1}}
            data={this.state.data}
            renderItem={this.renderItem.bind(this)}
            keyExtractor = { (item, index) => index.toString() }
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            renderSectionHeader={this.renderSectionHeader}
            onEndReachedThreshold={50}
            extraData={this.state}
            ListHeaderComponent={() => (!this.state.data.length ? 
              <Text style={{textAlign:'left', fontSize:22}}>No Friend.</Text>
              : null)}
          />
            */}


          <SectionList
            sections={sections}
            renderSectionHeader={this.renderSectionHeader}
            renderItem={this.renderSection}
            // style={{justifyContent:'space-between'}}
            extraData={this.state}
          />

          {/*                    
            <TouchableOpacity 
                      style={{height:80,
                              width: 80,
                              borderRadius: 10,
                              margin:10}}
                        onPress={()=>
                        {
                          
                          ImagePicker.showImagePicker(options, (response) => {
                            console.log('Response = ', response);

                            if (response.didCancel) {
                              console.log('User cancelled image picker');
                            } else if (response.error) {
                              console.log('ImagePicker Error: ', response.error);
                            } else if (response.customButton) {
                              console.log('User tapped custom button: ', response.customButton);
                            } else {
                              const source = { uri: response.uri };

                              // You can also display the image using data:
                              // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                              this.setState({
                                avatarSource: source,
                              });

                              console.log(this.state.avatarSource.uri)
                            }
                          });
                        }}>
                      <FastImage
                          style={{width: 80, height: 80, borderRadius: 10}}
                          source={{
                          uri: this.state.avatarSource.uri === "" ? Constant.DEFAULT_AVATARSOURCE_URI : this.state.avatarSource.uri,
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      />
            </TouchableOpacity>
            <TextInput style = {{margin: 15,
                                height: 40,
                                width:180,
                                borderColor: 'gray',
                                borderWidth: 1}}
                underlineColorAndroid = "transparent"
                placeholder = "Class name"
                placeholderTextColor = "gray"
                autoCapitalize = "none"
                ref= {(el) => { this.className = el; }}
                onChangeText = {this.handleClass}
                value={this.state.className}/>
            */}
          </View>
        )
    }
}

// uid:getUid(state)

const mapStateToProps = (state) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    auth: state.auth,
    friends: state.auth.users.friends,
    uid: getUid(state)
  }
}

export default connect(mapStateToProps, actions)(AddClasssPage);