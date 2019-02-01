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

import * as actions from '../../Actions'

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
          refreshing: false
        };
    }

    componentDidMount() {

      setTimeout(() => {this.setState({renderContent: true})}, 0);

      this.setState({
        data: [],
        error: null,
        loading: false,
        refreshing: false
      });

      let {application_category} = this.props.auth
      if(application_category != null){

        let newData = []
        Object.entries(application_category).forEach(([key, value]) => {
          newData.push(value)
        })

        this.setState({
          data: newData
        })
      }else{
        this.props.actionApplicationCategory().then((result) => {
  
          let newData = []
          Object.entries(result.data).forEach(([key, value]) => {
            newData.push(value)
          })
  
          this.setState({
            data: newData
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

    renderItem = ({ item, index }) => {
      console.log(item)
      return(<TouchableOpacity 
                key={ item.name } 
                onPress={() => {
                    this.props.navigation.goBack()
                    this.props.navigation.state.params.handleCategoryBack({ item });
                }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 20,
                    flexDirection: 'row',
                    backgroundColor: 'white'
                  }}>
                  <TouchableHighlight>
                      <FastImage
                          style={{width: 35, height: 35, borderRadius: 17}}
                          source={{
                          uri: item.field_image,
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      />
                  </TouchableHighlight>
                  <Text style={{fontSize: 22, paddingLeft: 10}}>
                      {item.name}
                  </Text>
                </View>
            </TouchableOpacity>
      )
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
          ListFooterComponent={this.renderFooter}
          onEndReachedThreshold={50}
          extraData={this.state}
        />
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

export default connect(mapStateToProps, actions)(ListAllCategory)

