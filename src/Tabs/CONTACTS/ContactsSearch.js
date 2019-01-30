import React from 'react'
import {View, 
        Text, 
        SafeAreaView,
        Image,
        TouchableOpacity} from 'react-native'

import ExpandableList from 'react-native-expandable-section-flatlist'

import SearchBar from '../../Utils/SearchBar'
import {getHeaderHeight} from '../../Utils/Helpers'
import ImageWithDefault from '../../Utils/ImageWithDefault'

const items = [
    1337,
    'janeway',
    {
      lots: 'of',
      different: {
        types: 0,
        data: false,
        that: {
          can: {
            be: {
              quite: {
                complex: {
                  hidden: [ 'gold!' ],
                },
              },
            },
          },
        },
      },
    },
    [ 4, 2, 'tree' ],
];

export default class ContactsSearch extends React.Component{

    // static navigationOptions = {
    //     header: { visible: false } // !!! Hide Header
    //   }
    static navigationOptions = {header: null, headerTintColor: 'white', };

    constructor(props){
      super(props)

      this.state = {
        items,
        data: []
      };
    }

    componentDidMount(){

      let tabFriends = []
      let tabGroups = []
      let tabClasss = []

      this.setState({
        data: [{title: 'Tab Friends',member: tabFriends}, {title: 'Tab Groups', member: tabGroups}, {title: 'Tab Classs', member: tabClasss}]
      })
    }

    _handleResults(results) {
      // this.setState({ results });
      console.log(results)

      this.setState({ results });

      let tabFriends = []
      let tabGroups = []
      let tabClasss = []

      for(let i = 0; i < 3; i++){
        tabFriends.push({
          name:"",
          image_url:""
        })

        tabGroups.push({
          name:"",
          image_url:""
        })

        tabClasss.push({
          name:"",
          image_url:""
        })
      }

      this.setState({
        data: [{title: 'Tab Friends',member: tabFriends}, {title: 'Tab Groups', member: tabGroups}, {title: 'Tab Classs', member: tabClasss}]
      })
    }

    onHide(results){
      console.log("onHide")

      // console.log(this)
      // navigation.goBack()

      this.props.navigation.goBack()
    }


    _renderSection = (section, sectionId, state)  => {
      let {data} = this.state

      let m_length = data[sectionId].member.length
      if(m_length == 0){
          return ;
      }

      let ic_collapse;
      if(state){
      ic_collapse = <Image
                      style={{width: 20, height: 20}}
                      source={require('../../Images/collapse_down.png')}
                      // resizeMode={FastImage.resizeMode.contain}
                  />
      }else{
          ic_collapse = <Image
                        style={{width: 20, height: 20}}
                        source={require('../../Images/collapse_up.png')}
                        // resizeMode={FastImage.resizeMode.contain}
                  />
      }

      return (
          <View
              style={{ 
                      height: 30, 
                      flexDirection: 'row',
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      borderBottomWidth: 0.5,
                      // borderBottomColor: DictStyle.colorSet.lineColor 
                    }}>
          <View style={{ flexDirection: 'row', 
                      alignItems: 'center'}}>
              <Text style={{ 
                            // fontSize: DictStyle.fontSet.mSize, 
                              color: 'gray',
                              paddingLeft: 10,
                              fontWeight:'700' }}>
              {section + "(" + m_length +")"}
              </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {ic_collapse}
          </View>
          </View>
      )
  }

  _renderRow = (rowItem, rowId, sectionId) => {
    return( 
          <View style={{flex:1, height:100, padding:10, backgroundColor:'white', flexDirection:'row', alignItems:'center',}}>
            <TouchableOpacity 
                style={{height:60,
                        width: 60,
                        borderRadius: 10}}>
                <ImageWithDefault 
                  source={{uri: ''}}
                  style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                />
            </TouchableOpacity>
            <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
              <Text style={{fontSize:18}}>rowItem.name</Text>
            </View>
          </View>)
  }

  render(){
      let {results} = this.state
      return(
        <SafeAreaView style={{flex:1}}>
              <SearchBar
                ref={(ref) => this.searchBar = ref}
                data={items}
                handleResults={this._handleResults.bind(this)}
                showOnLoad
                onHide={this.onHide.bind(this)}
                  />
                  <View style={{flex:1}}>
                      <ExpandableList
                          style={{flex:1, backgroundColor:'green'}}
                          ref={instance => this.ExpandableList = instance}
                          dataSource={this.state.data}
                          headerKey="title"
                          memberKey="member"
                          renderRow={this._renderRow}
                          headerOnPress={(i, state) => {
                          } }
                          renderSectionHeaderX={this._renderSection}
                          openOptions={[0, 1]}
                          removeClippedSubviews={false}
                      />
                  </View>
                  </SafeAreaView>
              )
  }
}