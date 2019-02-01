import React from 'react'
import {View, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Dimensions} from 'react-native'

import ExpandableList from 'react-native-expandable-section-flatlist'
import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';
import Image from 'react-native-remote-svg'

import * as actions from '../../Actions'
import Constant from '../../Utils/Constant'

class ListMyAppPage extends React.Component{
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
        numColumns:4,
      };
    }

    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.setState({
        // data: this._data(),
        error: null,
        loading: false,
        refreshing: false
      });

      let {my_applications} = this.props.auth.users

      console.log(my_applications)

      let newValue = []
      Object.entries(my_applications).forEach(([key, value]) => {
        newValue.push({key, item_id: key, ...value})
      })

      this.setState({data:newValue})
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
  
    renderFooter = () => {
      if (!this.state.loading) return null;
  
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    };

    renderItem =({ item, index }) => {

      var swipeoutBtns = [
        {
          component:<View style={{flex: 1, 
                                  alignItems: "center", 
                                  justifyContent: "center", 
                                  backgroundColor: 'red',
                                  }}>
                      <Text style={{fontWeight:'bold', 
                                    color:'white',
                                    textAlign:'center',
                                    fontSize:16}}>DELETE</Text>
                    </View>,
          onPress: () => {
            alert('Delete')
          }
        },
      ]
      return(
        <Swipeout 
            key={item.item_id}
            style={{backgroundColor:'white'}} 
            right={swipeoutBtns}>
            <TouchableOpacity  
              onPress={() => {
                this.props.params.navigation.navigate("ApplicationDetailPage")
              }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    flexDirection: 'row'
                  }}>
                    <TouchableOpacity
                        onPress={()=>{
                          this.props.params.navigation.navigate("ApplicationDetailPage")
                        }}
                        >
                        <FastImage
                            style={{width: 80, height: 80, borderRadius: 40}}
                            source={{
                            uri: item.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <Text style={{paddingLeft: 10}}>
                        {item.name}
                    </Text>
                </View>
              </TouchableOpacity>
            </Swipeout>)
    }

    loadData=()=>{
      let {my_applications} = this.props.auth.users

      let publishedMember = []
      let unPublishedMember = []
      Object.entries(my_applications).forEach(([key, value]) => {

        if(value.status){
          publishedMember.push({key, item_id: key, ...value})
        }else{
          unPublishedMember.push({key, item_id: key, ...value})
        }
      })

      let published = {
        title: 'Published',
        member: publishedMember
      }

      let unPublished = {
        title:'Unpublished',
        member: unPublishedMember
      }
      return [published, unPublished];        
    }

    _renderRow = (rowItem, rowId, sectionId) => {
      // console.log(rowItem)

      var swipeoutRightBtns = []
      if(rowItem.status){
        swipeoutRightBtns = [
          {
            component:<View style={{flex: 1, 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    backgroundColor: 'red',
                                    }}>
                        <Text style={{fontWeight:'bold', 
                                      color:'white',
                                      textAlign:'center',
                                      fontSize:16}}>UNPUBLISHED</Text>
                      </View>,
            onPress: () => {
              alert('UNPUBLISHED')
            }
          },
        ]
      }else{
        swipeoutRightBtns = [
          {
            component:<View style={{flex: 1, 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    backgroundColor: 'blue',
                                    }}>
                        <Text style={{fontWeight:'bold', 
                                      color:'white',
                                      textAlign:'center',
                                      fontSize:16}}>PUBLISHED</Text>
                      </View>,
            onPress: () => {
              alert('PUBLISHED')
            }
          },
          {
            component:<View style={{flex: 1, 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    backgroundColor: 'red',
                                    }}>
                        <Text style={{fontWeight:'bold', 
                                      color:'white',
                                      textAlign:'center',
                                      fontSize:16}}>DELETE</Text>
                      </View>,
            onPress: () => {
              alert('DELETE')
            }
          },
        ]
      }

      return (
        <Swipeout 
            // key={item.item_id}
            style={{backgroundColor:'white'}} 
            right={swipeoutRightBtns}>
        <TouchableOpacity 
          key={ rowId } 
          onPress={()=>{
            // this._itemOnPress(rowItem, rowId, sectionId)
            this.props.params.navigation.navigate("ManageMyApplicationPage", {item: rowItem})
          }}>
          <View
            style={{
              alignItems: 'center', 
              padding: 10,
              borderColor: '#E4E4E4',
              flexDirection: 'row',
            }}>
            
              <TouchableOpacity
                onPress={()=>{
                  this.props.params.navigation.navigate("ManageMyApplicationPage", {item: rowItem})
                }}
                >
                {/* <TestSVG 
                  width={80}
                  height={80}
                  strokeWidth={3}
                  image_uri={rowItem.image_url}/> */}

                  <FastImage
                      style={{width: 80, height: 80, borderRadius: 40}}
                      source={{
                      uri: rowItem.image_url,
                      headers:{ Authorization: 'someAuthToken' },
                      priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                  />
              </TouchableOpacity>
              <View>
                <Text style={{fontSize: 18, 
                              fontWeight: '600',
                              color: '#222',
                              paddingLeft: 10, 
                              paddingBottom:5}}>
                    {rowItem.name}
                </Text>
              </View>
          </View>
        </TouchableOpacity>
        </Swipeout>
      )
    }

    _renderSection = (section, sectionId, state)  => {

      let ic_collapse;
      if(state){
        ic_collapse =  <Image
                          style={{ width: 15, height: 15}}
                          source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="12.233" viewBox="0 0 24.105 12.233">
                          <path id="Path_2031" data-name="Path 2031" d="M-1634.662,58.446h3.792l8.08,8.08,8.08-8.08h4.153l-12.233,12.233Z" transform="translate(1634.662 -58.446)" fill="#3c3f3f"/>
                        </svg>
                        `}} />

      }else{
        ic_collapse =  <Image
                          style={{ width: 15, height: 15}}
                          source={{uri:`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="12.233" viewBox="0 0 24.105 12.233">
                          <path id="Path_2031" data-name="Path 2031" d="M-1634.662,70.679h3.792l8.08-8.08,8.08,8.08h4.153l-12.233-12.233Z" transform="translate(1634.662 -58.446)" fill="#3c3f3f"/>
                        </svg>
                        `}} />
      }

      let member_size = this.loadData()[sectionId].member.length
      if(member_size == 0){
        return ;
      }

      return (
        <View
            style={{ 
                    height: 30, 
                    flexDirection: 'row',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#E4E4E4' }}>
        <View style={{ flexDirection: 'row', 
                      alignItems: 'center'}}>
            <Text style={{ fontSize: 13, 
                            color: 'gray',
                            paddingLeft: 10,
                            fontWeight:'700' }}>
            {section}
            </Text>
        </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight:10 }}>
              {ic_collapse}
          </View>
        </View>
      )
    }

    render() {
      let {renderContent, data} = this.state;

      return (
        <View style={{flex:1}}>
        { 
          renderContent &&
          // <FlatList
          //   data={data}
          //   renderItem={this.renderItem}
          //   ItemSeparatorComponent={this.renderSeparator}
          //   ListFooterComponent={this.renderFooter}
          //   onEndReachedThreshold={50}
          //   key = {this.state.data}
          //   keyExtractor={(item) => item.item_id}
          //   extraData={this.state}
          // />

          <ExpandableList
              ref={instance => this.ExpandableList = instance}
              dataSource={this.loadData()}
              headerKey="title"
              memberKey="member"
              renderRow={this._renderRow}
              headerOnPress={(i, state) => {
                // console.log(i, state)
                // alert('headerOnPress')
              } }
              renderSectionHeaderX={this._renderSection}
              openOptions={[0, 1, 2, 3]}
              // onScroll={this.props.handleScroll}
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
    // uid:getUid(state),
    auth:state.auth
  }
}

export default connect(mapStateToProps, actions)(ListMyAppPage);