import React from 'react'
import {View, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        Dimensions} from 'react-native'
import FastImage from 'react-native-fast-image'
import Swipeout from 'react-native-swipeout'
import { connect } from 'react-redux';
import * as actions from '../../Actions'


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
            width: "100%",
            backgroundColor: "#CED0CE",
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
                                  backgroundColor: 'gray',
                                  }}>
                      <Text style={{fontWeight:'bold', 
                                    color:'white',  // unpublished
                                    textAlign:'center',
                                    fontSize:16}}>UNPUBLISHED</Text>
                    </View>,
          onPress: () => {
            alert('Unpublished')
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
            alert('Delete')
          }
        },
      ]

      return(
        <Swipeout 
            key={item.item_id}
            style={{backgroundColor:'white'}} 
            right={swipeoutBtns}>
            <TouchableOpacity  onPress={() => {
                this.props.params.navigation.navigate("ApplicationDetailPage")
              }}>
                <View
                  style={{
                    alignItems: 'center', 
                    padding: 10,
                    flexDirection: 'row'
                  }}>
                    <TouchableOpacity>
                        <FastImage
                            style={{width: 80, height: 80, borderRadius: 40}}
                            source={{
                            uri: item.image_url,
                            headers:{ Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableOpacity>
                    <Text style={{paddingLeft: 10}}>
                        {item.name}
                    </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#CED0CE",
                  position:'absolute',
                  bottom:0
                }}
              />
            </Swipeout>)
    }

    render() {
      let {renderContent, data} = this.state;

      return (
        <View style={{flex:1}}>
        { 
          renderContent &&
          <FlatList
            data={data}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={50}
            key = {this.state.data}
            keyExtractor={(item) => item.item_id}
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
    // uid:getUid(state),
    auth:state.auth
  }
}

export default connect(mapStateToProps, actions)(ListMyAppPage);