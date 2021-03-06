import React from 'react'

import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TouchableHighlight, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Styles from '../../styles';
import { List, ListItem, SearchBar } from "react-native-elements";
import FastImage from 'react-native-fast-image'
import DictStyle from '../CONTACTS/dictStyle';

import ImagePicker from 'react-native-image-picker';

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  quality: 0.7,
  maxWidth: 500,
  maxHeight: 500,
};

export default class AddGroupsPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Create Groups",
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),
        headerRight: (
            <TouchableOpacity
                style={{paddingRight:10}}
                onPress={() => alert("Create")}>
                <Text style={{fontSize:16, fontWeight:'600'}}>Create</Text>
            </TouchableOpacity>
          ),
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
          text: '',
          avatarSource: {"uri":"https://unsplash.it/400/400?image=1"},
          seleteds: []
        };
    }

    componentDidMount() {
      // this.makeRemoteRequest();

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
            [ {"key":99, "name":'00'},
              {"key":1, "name":'A1'}, 
              {"key":2, "name":'A2'}, 
              {"key":3, "name":'A3'}, 
              {"key":4, "name":'A4'}, 
              {"key":5, "name":'A5'}]
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
      // return <SearchBar placeholder="Type Here..." lightTheme round />;
      return(
        <View style={{flexDirection:'row', justifyContent:'center'}}>
            <TouchableOpacity 
              style={{height:80,
                      width: 80,
                      borderRadius: 10,
                      margin:10}}
                onPress={()=>{

                  /**
                   * The first arg is the options object for customization (it can also be null or omitted for default options),
                   * The second arg is the callback which sends object: response (more info in the API Reference)
                   */
                  ImagePicker.showImagePicker(options, (response) => {
                    console.log('Response = ', response);

                    if (response.didCancel) {
                      console.log('User cancelled image picker');
                    } else if (response.error) {
                      console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                      console.log('User tapped custom button: ', response.customButton);
                    } else {
                      const source = { uri: response.uri };

                      // You can also display the image using data:
                      // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                      this.setState({
                        avatarSource: source,
                      });

                      console.log(this.state.avatarSource.uri)
                    }
                  });
                }}>
              <FastImage
                  style={{width: 80, height: 80, borderRadius: 10}}
                  source={{
                  uri: this.state.avatarSource.uri,
                  headers:{ Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
            <TextInput style = {{margin: 15,
                                height: 40,
                                width:120,
                                borderColor: 'gray',
                                borderWidth: 1}}
                underlineColorAndroid = "transparent"
                placeholder = "Name chat group"
                placeholderTextColor = "gray"
                autoCapitalize = "none"
                onChangeText = {this.handleEmail}/>
        </View>)
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

    handleEmail = (text) => {
        this.setState({ text: text })
    }

    _check=(key)=>{

      let seleteds = this.state.seleteds
      let check = seleteds.find((seleted) => {
        return seleted.key === key;
      })
      
      if(check === undefined){
        this.setState({
          seleteds: [...seleteds, {key: key}]
        })
      }else{

        seleteds = seleteds.filter(function(seleted){
          return seleted.key !== key;;
        });

        this.setState({
          seleteds
        })
      } 
    }

    renderItem = ({item, index}) => {
        
        switch(index){
            case 0:{
                return(<View><Text>Select friend</Text></View>)
            }
            break
            default:{
                // console.log(item)

                let check
                if('seleted' in item){
                  
                }

                let seleteds = this.state.seleteds
                let _c = seleteds.find((seleted) => {
                  return seleted.key === item.key;
                })

                if(_c !== undefined){
                  check = <Icon name="check" size={15} />
                }

                return(
                      <View
                        style={{
                          alignItems: 'center', 
                          padding: 10,
                          borderColor: DictStyle.colorSet.lineColor,
                          flexDirection: 'row',
                          backgroundColor: 'white'
                        }}
                      >
                        <View style={{flex:1, alignItems:'center'}}>
                          <TouchableOpacity 
                              style={{height: 40,
                                      width: 40,
                                      borderRadius: 10}}
                              onPress={
                                ()=>this.props.navigation.navigate("FriendProfilePage")
                              }>
                              <FastImage
                                  style={{width: 40, height: 40, borderRadius: 10}}
                                  source={{
                                  uri: 'https://unsplash.it/400/400?image=1',
                                  headers:{ Authorization: 'someAuthToken' },
                                  priority: FastImage.priority.normal,
                                  }}
                                  resizeMode={FastImage.resizeMode.contain}
                              />
                          </TouchableOpacity>
                        </View>
                        <View style={{flex:5}}>
                          <TouchableOpacity 
                            onPress={()=>{
                              this._check(item.key)
                            }}
                            >
                            <Text style={{
                                        fontSize: 16, 
                                        fontWeight: '600',
                                        color: DictStyle.colorSet.normalFontColor,
                                        paddingLeft: 10}}>
                                {item.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{flex:1, alignItems:'center'}}>
                          <TouchableOpacity >
                            {check}
                          </TouchableOpacity>
                        </View>
                      </View>
                )
            }
        }
    }
    
    render() {

        console.log(this.state.seleteds)

        // let swipeBtns = [{
        //   text: 'Delete',
        //   backgroundColor: 'red',
        //   underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        //   onPress: () => { this.deleteNote(rowData) }
        // }];

        // console.log(this.state.avatarSource.uri)

        let {
          renderContent
        } = this.state;
    
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

              
              renderItem={this.renderItem.bind(this)}
              keyExtractor={item => item.name}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              // onRefresh={this.handleRefresh}
              // refreshing={this.state.refreshing}
              // onEndReached={this.handleLoadMore}
              renderSectionHeader={this.renderSectionHeader}
              onEndReachedThreshold={50}
              extraData={this.state}
            />
          }
          </View>
        );
      }
}