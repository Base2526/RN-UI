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
        Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';
import { List, ListItem, SearchBar } from "react-native-elements";
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import DictStyle from '../CONTACTS/dictStyle';

import ImagePicker from 'react-native-image-picker';

import Image from 'react-native-remote-svg'

// import RNFetchBlob from 'react-native-fetch-blob'

// import ImgToBase64 from 'react-native-image-base64';

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'

import {getUid} from '../../Utils/Helpers'

import ImageWithDefault from '../../Utils/ImageWithDefault'


// import {group_all, 
//         groupDetail_all, 
//         group_get,
//         groupDetail_get, 
//         group_update, 
//         groupDetail_update} from '../../Utils/DB'

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

  console.log(width, (itemRow) )
  return (width - (margin* (itemRow*2))) / itemRow
}

class AddGroupsPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Create Group",
        headerTintColor: 'white',
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
                <Text style={{fontSize:18, fontWeight:'600', color:'white'}}>Create</Text>
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
        };
    }

    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.props.navigation.setParams({ handleCreateGroup: this.handleCreateGroup })

      this.setState({
        data: this.loadData(),
        error: null,
        loading: false,
        refreshing: false
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

    handleCreateGroup = () => {
      let groupName = this.state.groupName.trim()
      let uri = this.state.avatarSource.uri; 
      let seleteds = this.state.seleteds;
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

          this.setState({loading:false})
          if(result.status){
            this.props.navigation.goBack()
          }else{

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

    loadData=()=>{
      let friend_member = []

      // console.log(this.props.auth.users.friends)
      for (var key in this.props.auth.users.friends) {
    
        let friend =  this.props.auth.users.friends[key]
        // let friend_profile = friend_profiles[key]

        console.log(friend)

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
      // return <SearchBar placeholder="Type Here..." lightTheme round />;
      return(
        <View style={{justifyContent:'center', backgroundColor:'white'}}>
        <View style={{flexDirection:'row', padding:15, justifyContent:'center',}}>
            <TouchableOpacity 
                onPress={()=>{
                  this.onSelectImage()
                }}>
              <FastImage
                  style={{width: 80, 
                          height: 80, 
                          borderRadius: 40, 
                          // borderColor:'gray', 
                          backgroundColor: '#FF83AF',
                          // borderWidth:1
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
                {/* <Image
                    style={{width:25, height:25}}
                    source={require('../../Images/icon-photo-edit.svg')}/> */}

                <Image
                    style={{ width: 25, height: 25}}
                    source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="21.05" height="21.05" viewBox="0 0 21.05 21.05">
                    <g id="Group_477" data-name="Group 477" transform="translate(-91.95 -175.4)">
                      <g id="Ellipse_43" data-name="Ellipse 43" transform="translate(91.95 175.4)" fill="#fff" stroke="#c6d7dd" stroke-width="1">
                        <ellipse cx="10.525" cy="10.525" rx="10.525" ry="10.525" stroke="none"/>
                        <ellipse cx="10.525" cy="10.525" rx="10.025" ry="10.025" fill="none"/>
                      </g>
                      <g id="Group_343" data-name="Group 343" transform="translate(95.206 180.136)">
                        <g id="Path_1779" data-name="Path 1779" transform="translate(0 0)" fill="#fff">
                          <path d="M 10.79541206359863 11.34874057769775 L 3.159631967544556 11.34874057769775 C 1.693111896514893 11.34874057769775 0.5000019073486328 10.15562057495117 0.5000019073486328 8.689081192016602 L 0.5000019073486328 3.159660816192627 C 0.5000019073486328 1.693120718002319 1.693111896514893 0.5000007748603821 3.159631967544556 0.5000007748603821 L 10.79541206359863 0.5000007748603821 C 12.26193237304688 0.5000007748603821 13.45504188537598 1.693120718002319 13.45504188537598 3.159660816192627 L 13.45504188537598 8.689081192016602 C 13.45504188537598 10.15562057495117 12.26193237304688 11.34874057769775 10.79541206359863 11.34874057769775 Z" stroke="none"/>
                          <path d="M 3.159631729125977 1.000000953674316 C 1.968811988830566 1.000000953674316 1.000001907348633 1.968820571899414 1.000001907348633 3.159660339355469 L 1.000001907348633 8.689081192016602 C 1.000001907348633 9.879920959472656 1.968811988830566 10.84874057769775 3.159631729125977 10.84874057769775 L 10.79541206359863 10.84874057769775 C 11.98623180389404 10.84874057769775 12.95504188537598 9.879920959472656 12.95504188537598 8.689081192016602 L 12.95504188537598 3.159660339355469 C 12.95504188537598 1.968820571899414 11.98623180389404 1.000000953674316 10.79541206359863 1.000000953674316 L 3.159631729125977 1.000000953674316 M 3.159631729125977 9.5367431640625e-07 L 10.79541206359863 9.5367431640625e-07 C 12.54042148590088 9.5367431640625e-07 13.95504188537598 1.414630889892578 13.95504188537598 3.159660339355469 L 13.95504188537598 8.689081192016602 C 13.95504188537598 10.43411064147949 12.54042148590088 11.84874057769775 10.79541206359863 11.84874057769775 L 3.159631729125977 11.84874057769775 C 1.41461181640625 11.84874057769775 1.9073486328125e-06 10.43411064147949 1.9073486328125e-06 8.689081192016602 L 1.9073486328125e-06 3.159660339355469 C 1.9073486328125e-06 1.414630889892578 1.41461181640625 9.5367431640625e-07 3.159631729125977 9.5367431640625e-07 Z" stroke="none" fill="#8fb3c1"/>
                        </g>
                        <g id="Path_1778" data-name="Path 1778" transform="translate(4.476 3.423)" fill="#fff">
                          <path d="M 2.501375675201416 4.502800941467285 C 1.397815704345703 4.502800941467285 0.4999956786632538 3.604980945587158 0.4999956786632538 2.501400947570801 C 0.4999956786632538 1.397820949554443 1.397815704345703 0.5000009536743164 2.501375675201416 0.5000009536743164 C 3.604935646057129 0.5000009536743164 4.502755641937256 1.397820949554443 4.502755641937256 2.501400947570801 C 4.502755641937256 3.604980945587158 3.604935646057129 4.502800941467285 2.501375675201416 4.502800941467285 Z" stroke="none"/>
                          <path d="M 2.501375675201416 1.000000953674316 C 1.673515558242798 1.000000953674316 0.9999957084655762 1.673531055450439 0.9999957084655762 2.501400947570801 C 0.9999957084655762 3.329270839691162 1.673515558242798 4.002800941467285 2.501375675201416 4.002800941467285 C 3.329235553741455 4.002800941467285 4.002755641937256 3.329270839691162 4.002755641937256 2.501400947570801 C 4.002755641937256 1.673531055450439 3.329235553741455 1.000000953674316 2.501375675201416 1.000000953674316 M 2.501375675201416 9.5367431640625e-07 C 3.882845640182495 9.5367431640625e-07 5.002755641937256 1.119910955429077 5.002755641937256 2.501400947570801 C 5.002755641937256 3.882890939712524 3.882845640182495 5.002800941467285 2.501375675201416 5.002800941467285 C 1.119905710220337 5.002800941467285 -4.291534423828125e-06 3.882890939712524 -4.291534423828125e-06 2.501400947570801 C -4.291534423828125e-06 1.119910955429077 1.119905710220337 9.5367431640625e-07 2.501375675201416 9.5367431640625e-07 Z" stroke="none" fill="#8fb3c1"/>
                        </g>
                        <g id="Path_1777" data-name="Path 1777" transform="translate(2.106 1.58)" fill="#8fb3c1">
                          <path d="M 1.316509366035461 0.5532206296920776 L 0.5266094207763672 0.5532206296920776 C 0.5119394063949585 0.5532206296920776 0.4999994039535522 0.5412806272506714 0.4999994039535522 0.5266106128692627 C 0.4999994039535522 0.511940598487854 0.5119394063949585 0.5000005960464478 0.5266094207763672 0.5000005960464478 L 1.316509366035461 0.5000005960464478 C 1.33117938041687 0.5000005960464478 1.343119382858276 0.511940598487854 1.343119382858276 0.5266106128692627 C 1.343119382858276 0.5412806272506714 1.33117938041687 0.5532206296920776 1.316509366035461 0.5532206296920776 Z" stroke="none"/>
                          <path d="M 0.5266094207763672 5.960464477539062e-07 L 1.316509366035461 5.960464477539062e-07 C 1.607349395751953 5.960464477539062e-07 1.843119382858276 0.235770583152771 1.843119382858276 0.5266106128692627 C 1.843119382858276 0.8174506425857544 1.607349395751953 1.053220629692078 1.316509366035461 1.053220629692078 L 0.5266094207763672 1.053220629692078 C 0.2357693910598755 1.053220629692078 -5.960464477539062e-07 0.8174506425857544 -5.960464477539062e-07 0.5266106128692627 C -5.960464477539062e-07 0.235770583152771 0.2357693910598755 5.960464477539062e-07 0.5266094207763672 5.960464477539062e-07 Z" stroke="none" fill="#8fb3c1"/>
                        </g>
                      </g>
                    </g>
                  </svg>                                                                    
                    `}} />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={{justifyContent:'center', flex:1, marginLeft:10}}>
              <TextInput style = {{fontSize:26}}
                  underlineColorAndroid = "transparent"
                  placeholder = "Input group name"
                  placeholderTextColor = "gray"
                  autoCapitalize = "none"
                  ref= {(el) => { this.groupName = el; }}
                  onChangeText = {this.handleEmail}
                  value={this.state.groupName}/>
            </View>

        </View>
        <View style={{position:'absolute', bottom:0, right:0, padding:5}}>
          <Text style={{fontSize:16, fontWeight:'bold'}}>{this.state.sections[0].data[0].list.length == 1 ? '0': this.state.sections[0].data[0].list.length - 1}/50</Text>
        </View>
        <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#CED0CE",
                // marginLeft: "14%"
                position:'absolute',
                bottom:0
              }}
            />
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

    handleEmail = (groupName) => {
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
          // borderColor: "green", 
          // borderWidth: 1, 
          justifyContent:'center', 
          alignItems:'center',
          backgroundColor: 'transparent',}} />;
      }

      if(index == 0){
        return(<TouchableOpacity
                style={{padding:5}}
                onPress={()=>{
                  let list = this.state.sections[0].data[0].list;
                  let newList = list.filter(function(value, key){
                    return key != 0;
                  })
                  // console.log(newList)

                  this.props.navigation.navigate("AddGroupsSelectMemberPage", { onSeleted: this.onSeleted, members:newList })
                }}>
                {/* <Image
                    style={{ width: calculatorWidthHeightItem(5, this.state.numColumns), 
                            height: calculatorWidthHeightItem(5, this.state.numColumns),}}
                    source={require('../../Images/icon-create-group-circleplus.svg')}/> */}

                <Image
                    style={{ width: calculatorWidthHeightItem(5, this.state.numColumns), height: calculatorWidthHeightItem(5, this.state.numColumns)}}
                    source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="63.963" height="63.971" viewBox="0 0 63.963 63.971">
                    <g id="circlePlus" transform="translate(-19.037 -246.233)">
                      <g id="Group_463" data-name="Group 463" transform="translate(-188.961 124.664)">
                        <ellipse id="NoPath_-_Copy_36_" data-name="NoPath - Copy (36)" cx="31.982" cy="31.986" rx="31.982" ry="31.986" transform="translate(207.998 121.569)" fill="#e6e6e6"/>
                      </g>
                      <line id="Line_112" data-name="Line 112" x2="25.239" transform="translate(38.179 278.555)" fill="none" stroke="#adadad" stroke-width="2"/>
                      <line id="Line_111" data-name="Line 111" x2="25.356" transform="translate(50.799 265.876) rotate(90)" fill="none" stroke="#adadad" stroke-width="2"/>
                    </g>
                  </svg>`}} />
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
                        right:0}}
                onPress={()=>{
                    this.onDeleted(index)
                }}>
                {/* <Image
                    style={{width: 20, 
                            height: 20,
                            }}
                    source={require('../../Images/icon-group-delete-member.svg')}/> */}


                <Image
                    style={{ width: 20, height: 20}}
                    source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14.034" height="14.036" viewBox="0 0 14.034 14.036">
                    <g id="Group_479" data-name="Group 479" transform="translate(-159.616 -233.514)">
                      <g id="Group_478" data-name="Group 478" transform="translate(159.616 233.514)">
                        <g id="NoPath_-_Copy_36_" data-name="NoPath - Copy (36)" transform="translate(0 0)" fill="#fff" stroke="#c6d7dd" stroke-width="1">
                          <ellipse cx="7.017" cy="7.018" rx="7.017" ry="7.018" stroke="none"/>
                          <ellipse cx="7.017" cy="7.018" rx="6.517" ry="6.518" fill="none"/>
                        </g>
                      </g>
                      <line id="Line_117" data-name="Line 117" x2="9.635" transform="translate(163.326 243.893) rotate(-45)" fill="none" stroke="#adadad" stroke-width="1"/>
                      <line id="Line_118" data-name="Line 118" x2="9.68" transform="translate(163.31 237.064) rotate(45)" fill="none" stroke="#adadad" stroke-width="1"/>
                    </g>
                  </svg>`}} />
              </TouchableOpacity>
            </TouchableOpacity>)
    
    }
    
    renderSectionHeader = ({ section }) => {
      // console.log(section)
      return (<View style={{padding:10}}><Text style={{fontSize:18}}>{section.title}</Text></View>)
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

const mapStateToProps = (state) => {
  console.log(state)

  // https://codeburst.io/redux-persist-the-good-parts-adfab9f91c3b
  //_persist.rehydrated parameter is initially set to false
  if(!state._persist.rehydrated){
    return {}
  }

  return{
    auth:state.auth,
    uid:getUid(state)
  }
}

export default connect(mapStateToProps, actions)(AddGroupsPage);