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
  NativeModules,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { connect } from 'react-redux';

import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';
var _ = require('lodash');

import * as actions from '../../actions'
import Constant from '../../utils/Constant'
import MyIcon from '../../config/icon-font.js';
import {getUid, getHeaderInset} from '../../utils/Helpers'
import {makeUidState} from '../../reselect'

class SettingsNameCardsPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    // title: "Settings",
    headerTintColor: '#C7D8DD',
    headerStyle: {
      backgroundColor: 'rgba(186, 53, 100, 1.0)',
      // ios navigationoptions underline hide
      borderBottomWidth: 0,

      // android navigationoptions underline hide
      elevation: 0,
      shadowOpacity: 0
    },
    // headerLeft: (
    //     <TouchableOpacity
    //       onPress={() => navigation.openDrawer()}>
    //       <MyIcon
    //           name={'menu'}
    //           size={30}
    //           color={'#C7D8DD'}
    //           />
    //   </TouchableOpacity>
    // ),
  }) 

  // loading
  constructor(props){
    super(props)
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    // console.log(this.props.dispatch)
  }

  render() {
    let {loading} = this.state
    return (
      <ScrollView>
      <Spinner
            visible={loading}
            textContent={'Wait...'}
            textStyle={{color: '#FFF'}}
            overlayColor={'rgba(0,0,0,0.5)'}
          />
        <TableView>
          <Section header="Settings">
            <Cell 
              cellStyle="Basic" 
              title="Manage Category" 
              accessory="DisclosureIndicator"
              hideSeparator={true}
              onPress={()=>{
                this.props.navigation.navigate("manage_category")
              }} />
          </Section>
          </TableView>
      </ScrollView>
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

export default connect(mapStateToProps, actions)(SettingsNameCardsPage);