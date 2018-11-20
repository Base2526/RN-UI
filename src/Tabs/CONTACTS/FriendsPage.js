import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    AppRegistry,
    Button,
    Image,
    TouchableHighlight
} from 'react-native'
  
import ExpandableList from 'react-native-expandable-section-list'
import DictStyle from './dictStyle'
import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'

export default class FriendsPage extends React.Component{

    constructor(props){
        super(props)

        this.state = {
          renderContent: false,
        }
    }
    
    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);
    }

    mockData=()=>{
        return( [
            {
              title: 'Profile',
              member: [
                {
                  title: '组1--row1',
                }
              ]
            },
            {
              title: 'Friends',
              member: [
                {
                  title: '组2--row1',
                },
                {
                  title: '组2--row2',
                },
                {
                  title: '组2--row3',
                },
                {
                  title: '组2--row4',
                }
              ]
            },
            {
              title: 'Friend Request Sent',
              member: [
                {
                  title: '组3--row1',
                },
                {
                  title: '组3--row2',
                },
                {
                  title: '组3--row3',
                },
              ]
            }
          ])
    }

    _itemOnPress(rowId, sectionId){
      if(rowId == 0 && sectionId == 0){
        this.props.params.navigation.navigate("MyProfilePage")
      }else{
        this.props.params.navigation.navigate("FriendProfilePage")
      }
    }

    _renderRow = (rowItem, rowId, sectionId) => {
        // Buttons
        
        if(rowId == 0 && sectionId == 0){
          return (
            <TouchableOpacity 
              key={ rowId } 
              onPress={this._itemOnPress.bind(this, rowId, sectionId)}
              onLongPress={()=>alert("MyProfile onLongPress")}
              >
              <View
                style={{
                  alignItems: 'center', 
                  // margin: 5, 
                  padding: 10,
                  // borderWidth: 0.5, 
                  borderColor: DictStyle.colorSet.lineColor,
                  flexDirection: 'row',
                }}
              >
                  <TouchableHighlight 
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}        
                      >
                      {/* <Image
                          style={{width: 40, height: 40, borderRadius: 10}}
                          source={{uri: 
                  'https://www.planwallpaper.com/static/images/9-credit-1.jpg'
                      }}/> */}
                      <FastImage
                          style={{width: 60, height: 60, borderRadius: 10}}
                          source={{
                          uri: 'https://unsplash.it/400/400?image=1',
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      />
                  </TouchableHighlight>
                  <Text style={{fontSize: DictStyle.fontSet.mSize, 
                              color: DictStyle.colorSet.normalFontColor,
                              paddingLeft: 10}}>
                      {rowItem.title}
                  </Text>
              </View>
            </TouchableOpacity>

          )
        }

        var swipeoutBtns = [
          {
            text: 'Delete',
            backgroundColor: 'red',
            onPress: () => { alert("Delete Click") }
          },{
            text: 'Hide',
            backgroundColor: '#3c33ff',
            onPress: () => { alert("Hide Click") }
          },{
            text: 'Block',
            backgroundColor: '#22ff1a',
            onPress: () => { alert("Block Click") }
          }
        ]

        return (
          <Swipeout 
            style={{backgroundColor:'white'}} 
            right={swipeoutBtns}>
          <TouchableOpacity 
            key={ rowId } 
            onPress={this._itemOnPress.bind(this, rowId, sectionId)}
            onLongPress={()=>alert("Friend onLongPress")}>
            <View
              style={{
                alignItems: 'center', 
                // margin: 5, 
                padding: 10,
                // borderWidth: 0.5, 
                borderColor: DictStyle.colorSet.lineColor,
                flexDirection: 'row',
              }}
            >
                <TouchableHighlight 
                    style={{height:60,
                            width: 60,
                            borderRadius: 10}}        
                    >
                    {/* <Image
                        style={{width: 40, height: 40, borderRadius: 10}}
                        source={{uri: 
                'https://www.planwallpaper.com/static/images/9-credit-1.jpg'
                    }}/> */}
                    <FastImage
                        style={{width: 60, height: 60, borderRadius: 10}}
                        source={{
                        uri: 'https://unsplash.it/400/400?image=1',
                        headers:{ Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </TouchableHighlight>
                <Text style={{fontSize: DictStyle.fontSet.mSize, 
                            color: DictStyle.colorSet.normalFontColor,
                            paddingLeft: 10}}>
                    {rowItem.title}
                </Text>
            </View>
          </TouchableOpacity>
          </Swipeout>
        )
    };
    
    _renderSection = (section, sectionId, state)  => {
      return (
          <View
              style={{ 
                      height: 30, 
                      flexDirection: 'row',
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      borderBottomWidth: 0.5,
                      borderBottomColor: DictStyle.colorSet.lineColor }}>
          <View style={{ flexDirection: 'row', 
                        alignItems: 'center' }}>
              <Text style={{ fontSize: DictStyle.fontSet.mSize, 
                              color: DictStyle.colorSet.normalFontColor,
                              paddingLeft: 10 }}>
              {section}
              </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, 
                              color: DictStyle.colorSet.weakFontColor }}>
              {'^ '}
              </Text>
          </View>
          </View>
      )
    }
    
    _btnPress = () => {
      console.log(this.ExpandableList);
      this.ExpandableList.setSectionState(0, false);
    };
    
    render() {

      let {
        renderContent
      } = this.state;

      return (
          <View style={{flex: 1}}>
          {
            renderContent && 
            <ExpandableList
                    ref={instance => this.ExpandableList = instance}
                    dataSource={this.mockData()}
                    headerKey="title"
                    memberKey="member"
                    renderRow={this._renderRow}
                    headerOnPress={(i, state) => console.log(i, state)}
                    renderSectionHeaderX={this._renderSection}
                    openOptions={[0, 1, 2,]}
                />
          }
          
          {/* <Button
              style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: 50, backgroundColor: 'blue'}}
              onPress={this._btnPress}
              title="Scroll"
              color="red"
          /> */}
          </View>
      );
    }
}