import React, { Component } from 'react';
import { View, 
        Text, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        TouchableHighlight,
     } from 'react-native';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
var _ = require('lodash');

import * as actions from '../../actions'
import MyIcon from '../../config/icon-font.js';

import {makeUidState, 
        makeApplicationCategoryState,} from '../../reselect'

class ListAllSubcategory extends Component {
  
  static navigationOptions = ({ navigation }) => ({
    title: "Select Subcategory",
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
        refreshing: false,
        subcategory: null,

        application_id:0,
        mode:'add',
      };
  }

  componentDidMount() {
    setTimeout(() => {this.setState({renderContent: true})}, 0);

    const { navigation } = this.props;
    const application_id  = navigation.getParam('application_id', null)
    const mode = navigation.getParam('mode', null);
    const category = navigation.getParam('category', null);
    const subcategory = navigation.getParam('subcategory', null)
    // console.log(subcategory)

    let {application_category} = this.props
    let _category = _.find(application_category, (v, k)=>{
                      return category == k
                    })
    // var subcategory = _.find(category.children, function(v, k) {
    //                     return my_application.subcategory == v.tid;
    //                   });

    // let newData = []
    // Object.entries(category.children).forEach(([key, value]) => {
    //   newData.push(value)
    // })

    let data =_.map(_category.children, (v, k)=>{
                return v
              })

    this.setState({
      data,
      subcategory,
      renderContent: true,
      mode,
      application_id
    })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: .5,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };
  
  onSelect = (item) =>{
    let {uid} = this.props
    let {mode, application_id} = this.state
    // console.log(uid, mode, application_id, item.tid)
    if(mode == 'edit'){
      this.setState({loading: true})
      this.props.actionUpdateSubcategoryMyApplication(uid, application_id, item.tid, (result)=>{
        this.setState({loading: false})
        // console.log(result)

        this.props.navigation.goBack()
        this.props.navigation.state.params.handleSubcategoryBack({ item }); 
      })
    }else{
      this.props.navigation.goBack()
      this.props.navigation.state.params.handleSubcategoryBack({ item }); 
    }
  }

  renderItem = ({ item, index }) => {

    let {subcategory} = this.state
    return(<TouchableOpacity 
              key={ item.name } 
              onPress={() => {
                  this.onSelect(item)
                }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    flexDirection: 'row',
                    backgroundColor: 'white'}}>
                  <TouchableHighlight>
                      <FastImage
                          style={{width:35, 
                                  height:35, 
                                  borderRadius:5, 
                                  // borderColor:'gray', 
                                  // borderWidth:.5
                                }}
                          source={{
                            uri: item.field_image,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      />
                  </TouchableHighlight>
                  <Text style={{paddingLeft: 10}}>
                      {item.name}
                  </Text>
                  {subcategory == item.tid ?  <View style={{position:'absolute', right:0, paddingRight:10}}>
                                                    <MyIcon
                                                      name={'check-ok'}
                                                      size={25}
                                                      color={'red'} />
                                                  </View>
                                                :<View />}
              </View>
            </TouchableOpacity>)
  }
    
  render() {
      let {data} = this.state;

      return (
        <View style={{flex:1, backgroundColor: 'white'}}>
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={this.renderSeparator}
            // ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={50}
            extraData={this.state}/>
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
    // uid:getUid(state),
    // auth:state.auth
    uid: makeUidState(state, ownProps),
    application_category: makeApplicationCategoryState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(ListAllSubcategory)