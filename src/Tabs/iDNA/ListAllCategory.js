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
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';
import { List, ListItem, SearchBar } from "react-native-elements";
import Swipeout from 'react-native-swipeout';
import FastImage from 'react-native-fast-image'
import DictStyle from '../CONTACTS/dictStyle';

export default class ListAllCategory extends Component {
  
    static navigationOptions = ({ navigation }) => ({
        title: "Select Category",
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),
        // headerRight: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => alert("address-book click")}>
        //         <Icon name="address-book" size={20} />
        //     </TouchableOpacity>
        //   ),
        
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
        data: this._data(),
        error: null,
        loading: false,
        refreshing: false
      });
    }

    _data=()=>{
        return(
            [{"name":'Brand and Business'}, {"name":'Service'}, {"name":'Entertainment'}, {"name":'Finance'}, {"name":'Academy'}]
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

        // Buttons
        var swipeoutBtns = [
          {
            text: 'Hide',
            onPress: () => { alert("Hide") }
          },
          {
            text: 'Block',
            backgroundColor: 'red',
            onPress: () => { alert("Block") }
          }
        ]

        // let swipeBtns = [{
        //   text: 'Delete',
        //   backgroundColor: 'red',
        //   underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        //   onPress: () => { this.deleteNote(rowData) }
        // }];
    

        return (
          <View style={{flex:1, backgroundColor: 'white'}}>
             
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
                //   style={{backgroundColor:'white'}}
                //   onPress={()=>alert(item.email)}>
                //   <View style={{padding: 10}}>
                //       <Text >{item.name.first}</Text>
                //       <Text >{item.email}</Text>
                //   </View>
                // </TouchableOpacity>
                <Swipeout style={{backgroundColor:'white'}} right={swipeoutBtns}>
                <TouchableOpacity 
                  key={ item.name } 
                  onPress={() => {
                      
                      this.props.navigation.goBack()
                      this.props.navigation.state.params.handleCategoryBack({ selected: 1 });
                    /*
                    const { navigation } = this.props;
                    navigation.goBack();
                    navigation.state.params.handleBack({ selected: true });
                    */
                      
                    }}>
                  <View
                    style={{
                      alignItems: 'center', 
                      // margin: 5, 
                      padding: 10,
                      // borderWidth: 0.5, 
                      borderColor: DictStyle.colorSet.lineColor,
                      flexDirection: 'row',
                      backgroundColor: 'white'
                    }}
                  >
                      <TouchableHighlight 
                          style={{height: 40,
                                  width: 40,
                                  borderRadius: 10}}>
                          {/* <Image
                              style={{width: 40, height: 40, borderRadius: 10}}
                              source={{uri: 
                      'https://www.planwallpaper.com/static/images/9-credit-1.jpg'
                          }}/> */}
                          <FastImage
                              style={{width: 40, height: 40, borderRadius: 10}}
                              source={{
                              uri: 'https://unsplash.it/400/400?image=1',
                              headers:{ Authorization: 'someAuthToken' },
                              priority: FastImage.priority.normal,
                              }}
                              resizeMode={FastImage.resizeMode.contain}
                          />
                      </TouchableHighlight>
                      <Text style={{fontSize: DictStyle.fontSet.mSize, 
                                  color: DictStyle.colorSet.normalFontColor,
                                  paddingLeft: 10}}>
                          {item.name}
                      </Text>
                  </View>
                </TouchableOpacity>
                </Swipeout>
              }
              keyExtractor={item => item.name}
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

