import React, { Component } from 'react';
import { View, 
        Text, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        TouchableHighlight,
     } from 'react-native';
import FastImage from 'react-native-fast-image'

import MyIcon from '../../config/icon-font.js';

export default class ListAllSubcategory extends Component {
  
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
        subcategory_select: null,
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

    const { navigation } = this.props;
    const category = navigation.getParam('category', null);
    const subcategory_select = navigation.getParam('subcategory_select', null)
    console.log(subcategory_select)

    console.log(category.children)

    let newData = []
    Object.entries(category.children).forEach(([key, value]) => {
      newData.push(value)
    })

    this.setState({
      data:newData,
      subcategory_select
    })
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
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    // console.log(item)
    let __check = null
    if(this.state.subcategory_select != null){
      if(this.state.subcategory_select.tid == item.tid) 
        __check = <View style={{position:'absolute', right:0, paddingRight:10}}>
                    <MyIcon
                        name={'check-ok'}
                        size={25}
                        color={'gray'} />
                  </View>
    }

    return(<TouchableOpacity 
              key={ item.name } 
              onPress={() => {
                  this.props.navigation.goBack()
                  this.props.navigation.state.params.handleSubcategoryBack({ item });   
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
                          style={{width:35, height:35, borderRadius:5, borderColor:'gray', borderWidth:.5}}
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
                  {__check}
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
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={50}
            extraData={this.state}/>
        </View>
      );
  }
}

