import React from 'react'
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableHighlight} from 'react-native'

import { List, ListItem, SearchBar } from "react-native-elements";

// import FastImage from 'react-native-fast-image'

import DictStyle from '../CONTACTS/dictStyle';

import ImageWithDefault from '../../Utils/ImageWithDefault'

export default class ListFollowingPage extends React.Component{
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
      
      // this.makeRemoteRequest();
      this.setState({
        data: this._data(),
        error: null,
        loading: false,
        refreshing: false
      });
    }

    _data=()=>{
      return(
        [{"gender":"male","name":{"title":"mr","first":"janique","last":"costa"},"location":{"street":"8364 rua belo horizonte ","city":"araraquara","state":"rondônia","postcode":12989,"coordinates":{"latitude":"-74.5614","longitude":"-150.0978"},"timezone":{"offset":"+1:00","description":"Brussels, Copenhagen, Madrid, Paris"}},"email":"janique.costa@example.com","login":{"uuid":"827d20c0-fa56-40aa-a2de-7df6d682d269","username":"smalltiger544","password":"brownie","salt":"7QvzaON4","md5":"12b90398592831552763936af62cf6e8","sha1":"3e7edd839bf49ad03b1df58a9f0fe5a354ca24b3","sha256":"417860b9520d81127a479a785c7886a30de02751f33787a2daa8bca21ac81bed"},"dob":{"date":"1990-07-09T12:14:13Z","age":28},"registered":{"date":"2017-12-26T19:41:16Z","age":0},"phone":"(84) 5181-4592","cell":"(23) 6323-6609","id":{"name":"","value":null},"picture":{"large":"https://randomuser.me/api/portraits/men/42.jpg","medium":"https://randomuser.me/api/portraits/med/men/42.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/42.jpg"},"nat":"BR"},{"gender":"male","name":{"title":"mr","first":"khaled","last":"børresen"},"location":{"street":"asperudtoppen 1297","city":"norheimsund","state":"akershus","postcode":"3168","coordinates":{"latitude":"73.8306","longitude":"-82.1636"},"timezone":{"offset":"+8:00","description":"Beijing, Perth, Singapore, Hong Kong"}},"email":"khaled.børresen@example.com","login":{"uuid":"369635aa-1ed1-471d-a090-038dc8f765d5","username":"ticklishgoose634","password":"fick","salt":"oHYVF9Dz","md5":"1b836c05c70dc3a457da18af8e6b498d","sha1":"90449038fb0be795fed96cb3247add5b2c4b1818","sha256":"3c06758be71b4faeb997f8922b618a95449b062ba2717a2e837d71b6cfb4121f"},"dob":{"date":"1965-10-17T19:19:47Z","age":53},"registered":{"date":"2015-05-01T18:18:49Z","age":3},"phone":"78129723","cell":"46056509","id":{"name":"FN","value":"17106548889"},"picture":{"large":"https://randomuser.me/api/portraits/men/25.jpg","medium":"https://randomuser.me/api/portraits/med/men/25.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/25.jpg"},"nat":"NO"},{"gender":"female","name":{"title":"ms","first":"eva","last":"duncan"},"location":{"street":"6074 henry street","city":"new ross","state":"dún laoghaire–rathdown","postcode":98613,"coordinates":{"latitude":"16.8276","longitude":"-35.8954"},"timezone":{"offset":"-8:00","description":"Pacific Time (US & Canada)"}},"email":"eva.duncan@example.com","login":{"uuid":"c4bc13ec-340a-409a-80f0-25a953d294b3","username":"browncat826","password":"lian","salt":"3T2DiE5z","md5":"040682c040ae3d71abf4f490e430d2ee","sha1":"73b739066ba4966eb2c79fad1fde755577ad2d5f","sha256":"2a4b6c2b29f282e7dad3a9d29f9c873b108526c0d2c450fb7aff0288c648db97"},"dob":{"date":"1968-11-13T04:25:59Z","age":50},"registered":{"date":"2004-04-30T11:59:24Z","age":14},"phone":"031-295-9044","cell":"081-753-3088","id":{"name":"PPS","value":"4824955T"},"picture":{"large":"https://randomuser.me/api/portraits/women/9.jpg","medium":"https://randomuser.me/api/portraits/med/women/9.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/women/9.jpg"},"nat":"IE"},{"gender":"male","name":{"title":"mr","first":"davut","last":"akar"},"location":{"street":"9382 abanoz sk","city":"kırklareli","state":"çorum","postcode":53006,"coordinates":{"latitude":"87.2268","longitude":"133.5745"},"timezone":{"offset":"+2:00","description":"Kaliningrad, South Africa"}},"email":"davut.akar@example.com","login":{"uuid":"bd727e68-32c7-4216-8f9f-176b9540dd7d","username":"greenrabbit611","password":"roger1","salt":"ewbhyOwU","md5":"42b4bd2875b9c66d0c3d20aba6502151","sha1":"5cf93f8243d64704e4c253175ee4d6b2503aff9a","sha256":"1901e2288295ce80b6fbe0530fbfd47e5baeb9bdb44f4ad1525d3845a44aed98"},"dob":{"date":"1946-11-16T01:54:17Z","age":71},"registered":{"date":"2007-06-21T10:10:52Z","age":11},"phone":"(574)-117-3971","cell":"(038)-367-6279","id":{"name":"","value":null},"picture":{"large":"https://randomuser.me/api/portraits/men/84.jpg","medium":"https://randomuser.me/api/portraits/med/men/84.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/84.jpg"},"nat":"TR"},{"gender":"male","name":{"title":"mr","first":"felix","last":"williams"},"location":{"street":"5914 whakatu drive","city":"nelson","state":"southland","postcode":12637,"coordinates":{"latitude":"-51.6104","longitude":"-20.7074"},"timezone":{"offset":"+5:00","description":"Ekaterinburg, Islamabad, Karachi, Tashkent"}},"email":"felix.williams@example.com","login":{"uuid":"e89e7408-f673-4715-816a-5cc5c905d8c7","username":"lazyswan483","password":"walmart","salt":"fCEKDQT9","md5":"6edac421ff1ebe5c48d073a0d4babf59","sha1":"c4333d615e89ee3b839eed7549d0d5a6ea5d0ce3","sha256":"bea7cdd7e8f4fb109a9590ea23c8bc2b4cbcf946af1476150cca36c924dd97a3"},"dob":{"date":"1962-12-23T06:37:03Z","age":55},"registered":{"date":"2005-08-16T09:05:44Z","age":13},"phone":"(567)-075-4832","cell":"(268)-724-5995","id":{"name":"","value":null},"picture":{"large":"https://randomuser.me/api/portraits/men/7.jpg","medium":"https://randomuser.me/api/portraits/med/men/7.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/7.jpg"},"nat":"NZ"}]
      )
    }
  
    makeRemoteRequest = () => {
      const { page, seed } = this.state;
      const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
      this.setState({ loading: true });
  
      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.setState({
            data: page === 1 ? res.results : [...this.state.data, ...res.results],
            error: res.error || null,
            loading: false,
            refreshing: false
          });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    };
  
    handleRefresh = () => {
      this.setState(
        {
          page: 1,
          seed: this.state.seed + 1,
          refreshing: true
        },
        () => {
          this.makeRemoteRequest();
        }
      );
    };
  
    handleLoadMore = () => {
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          this.makeRemoteRequest();
        }
      );
    };
  
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
  
    renderHeader = () => {
      return <SearchBar placeholder="Type Here..." lightTheme round />;
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

    
    render() {
      let {
        renderContent
      } = this.state;

      return (
        <View style={{flex:1}}>
        {
          renderContent &&
          <FlatList
            data={this.state.data}
            // renderItem={({ item }) => (
            //   <ListItem
            //     roundAvatar
            //     title={`${item.name.first} ${item.name.last}`}
            //     subtitle={item.email}
            //     avatar={{ uri: item.picture.thumbnail }}
            //     containerStyle={{ borderBottomWidth: 0 }}
            //     onPress={()=>console.log("item click")}
            //   />
            // )}
            renderItem={({item}) =>
            // <TouchableOpacity
            // style={{backgroundColor:'white'}}
            // onPress={()=>alert(item.email)}>
            //     <View style={{padding: 10}}>
            //         <Text >{item.name.first}</Text>
            //         <Text >{item.email}</Text>
            //     </View>
            //     </TouchableOpacity>
            <TouchableOpacity key={ item.name.first } onPress={() => {
              this.props.params.navigation.navigate("ApplicationDetailPage")
            }}>
              <View
                style={{
                  alignItems: 'center', 
                  // margin: 5, 
                  padding: 10,
                  // borderWidth: 0.5, 
                  borderColor: DictStyle.colorSet.lineColor,
                  flexDirection: 'row'
                }}
              >
                  <TouchableHighlight 
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}>
                      {/* <Image
                          style={{width: 40, height: 40, borderRadius: 10}}
                          source={{uri: 
                  'https://www.planwallpaper.com/static/images/9-credit-1.jpg'
                      }}/> */}
                      {/* <FastImage
                          style={{width: 60, height: 60, borderRadius: 10}}
                          source={{
                          uri: 'https://unsplash.it/400/400?image=1',
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      /> */}

                  <ImageWithDefault 
                    source={{uri: ''}}
                    style={{width: 60, height: 60, borderRadius: 10}}
                  />
                  </TouchableHighlight>
                  <Text style={{fontSize: DictStyle.fontSet.mSize, 
                              color: DictStyle.colorSet.normalFontColor,
                              paddingLeft: 10}}>
                      {item.name.first}
                  </Text>
              </View>
            </TouchableOpacity>
            }
            keyExtractor={item => item.email}
            ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            // onRefresh={this.handleRefresh}
            // refreshing={this.state.refreshing}
            // onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
        }
        </View>
      );
    }
}