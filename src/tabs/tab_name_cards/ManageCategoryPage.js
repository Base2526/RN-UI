import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  FlatList,
} from 'react-native';

import FastImage from 'react-native-fast-image'
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
var _ = require('lodash');

import * as actions from '../../actions'
import Constant from '../../utils/Constant'
import MyIcon from '../../config/icon-font.js';
import {isEmpty, getHeaderInset} from '../../utils/Helpers'
import {makeUidState} from '../../reselect'

class ManageCategoryPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Category",
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
          onPress={() => {}
          }>
          <MyIcon
            style={{paddingRight:10}}
            name={'plus'}
            size={20}
            color={'#C7D8DD'}/>
      </TouchableOpacity>
    ),
  }) 

  constructor(props){
    super(props)
    this.state = {
      renderContent: false,
      loading: false,
      data: []
    }
  }

  componentDidMount() {
    // console.log(this.props.dispatch)

    this.loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(nextProps)
  }

  loadData = (props) =>{
    let data = [{name:'All name cards'}, {name:'Friend cards'}, {name:'Family cards'}]
    this.setState({data, renderContent:true})
  }

  renderItem = ({item, index}) => {
    return(<View
              style={{
                alignItems: 'center', 
                padding: 10,
                borderColor: '#E4E4E4',
                flexDirection: 'row',
              }}>
                <View>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600',
                                  color: '#222',
                                  paddingLeft: 10, 
                                  paddingBottom:5}}>
                        {item.name}
                    </Text>
                </View>
                {/* {this.showMenu(item)} */}
            </View>)
  }

  render() {
    let {renderContent, loading, data} = this.state
    if(!renderContent){
      return(<View style={{flex:1}}></View>)
    }

    console.log(data)
    return (
      <View style={{flex:1}}>
        <Spinner
          visible={loading}
          textContent={'Wait...'}
          textStyle={{color: '#FFF'}}
          overlayColor={'rgba(0,0,0,0.5)'}/>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor = { (item, index) => index.toString() }
          />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  if(!state._persist.rehydrated){
      return {}
  }
  
  return{
    uid:makeUidState(state, ownProps),
  }
}

export default connect(mapStateToProps, actions)(ManageCategoryPage);