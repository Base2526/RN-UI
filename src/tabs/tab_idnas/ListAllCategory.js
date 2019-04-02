import React, { Component } from 'react';
import { View, 
        Text, 
        StyleSheet, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        TouchableHighlight,
        BackHandler,
     } from 'react-native';
import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
var _ = require('lodash');
import Spinner from 'react-native-loading-spinner-overlay';

import MyIcon from '../../config/icon-font.js';
import * as actions from '../../actions'
import {isEmpty} from '../../utils/Helpers'

import {makeUidState, makeApplicationCategoryState,} from '../../reselect'

class ListAllCategory extends Component {
  
    static navigationOptions = ({ navigation }) => ({
        title: "Select Category",
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
          category: null,

          mode:'add',
          application_id: 0
        };
    }

    componentDidMount() {
      const { navigation }  = this.props;
      const application_id  = navigation.getParam('application_id', null)
      const category = navigation.getParam('category', null);
      const mode = navigation.getParam('mode', null);

      // กรณีสร้าง application ใหม่
      let {application_category} = this.props
      if( !isEmpty(application_category) ){
        let data =_.map(application_category, (v, k)=>{
                    return v
                  })

        this.setState({
          data,
          category,
          mode,
          application_id,
          renderContent: true
        })
      }else{
        this.props.actionApplicationCategory().then((result) => {
          let data =_.map(result.data, (v, k)=>{
                      return v
                    })

          this.setState({
            data,
            category,
            mode,
            application_id,
            renderContent: true
          })
        })
      }
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
  
    onSelect = (item) =>{
      let {uid} = this.props
      let {mode, application_id} = this.state
      // console.log(uid, mode, application_id, item.tid)
      if(mode == 'edit'){
        this.setState({loading: true})
        this.props.actionUpdateCategoryMyApplication(uid, application_id, item.tid, (result)=>{
          this.setState({loading: false})
          console.log(result)

          this.props.navigation.goBack()
          this.props.navigation.state.params.handleCategoryBack({ item });
        })
      }else{
        this.props.navigation.goBack()
        this.props.navigation.state.params.handleCategoryBack({ item });
      }
    }

    renderItem = ({ item, index }) => {
      let {category} = this.state
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
                    backgroundColor: 'white'
                  }}>
                  <TouchableHighlight>
                      <FastImage
                          style={{width: 35, 
                                  height: 35, 
                                  borderRadius: 5, 
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
                  {category == item.tid ?  <View style={{position:'absolute', right:0, paddingRight:10}}>
                                                    <MyIcon
                                                      name={'check-ok'}
                                                      size={25}
                                                      color={'red'} />
                                                  </View>
                                                :<View />}
                </View>
            </TouchableOpacity>
      )
  }
    
  render() {
    let {data, loading} = this.state;
    return (
      <View style={{flex:1, backgroundColor: 'white'}}>
       <Spinner
                visible={loading}
                textContent={'Wait...'}
                textStyle={{color: '#FFF'}}
                overlayColor={'rgba(0,0,0,0.5)'}
            />
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={this.renderSeparator}
          onEndReachedThreshold={50}
          extraData={this.state}
        />
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

export default connect(mapStateToProps, actions)(ListAllCategory)

