import React from 'react'

import { View, 
        Text, 
        StyleSheet, 
        TouchableOpacity, 
        FlatList, 
        ActivityIndicator, 
        TouchableHighlight,
        TextInput } from 'react-native';
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

export default class CreateApplicationPage extends React.Component{

    static navigationOptions = ({ navigation }) => ({
        title: "Create Application",

        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={25} />
        //     </TouchableOpacity>
        // ),
        headerRight: (
            <TouchableOpacity
                style={{marginRight:5}}
                onPress={() => alert("create click")}>
                {/* <Icon name="address-book" size={20} /> */}
                <Text style={{fontSize:16, fontWeight:'700'}}>Create</Text>
            </TouchableOpacity>
          ),
    })

    constructor(props) {
        super(props);
    
        this.state = {
            text:'',
            renderContent: false,
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            avatarSource: {"uri":"https://unsplash.it/400/400?image=1"},
            category_select:-99,
            subcategory_select:-99
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
            [{"name":'A1'}, {"name":'A2'}, {"name":'A3'}, {"name":'A4'}]
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

    handleCategoryBack = data => {
        console.log("handleCategoryBack")
        // console.log(data)

        this.setState({
            category_select:data.selected
        })
    };    

    handleSubcategoryBack = data => {
        

        this.setState({
            subcategory_select:data.selected
        })
        console.log("handleSubcategoryBack")
        console.log(" >>>> " + this.state.category_select)
    };    
  
    renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "gray",
            // marginLeft: "14%"
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

    renderItem = ({item, index}) => {
        // return here
        console.log("renderItem : " + index)
        
        switch(index){
            case 0:{
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
                </View>)
            }
            break
            case 1:
            {
                return(<View style={{height:60, flexDirection:'row'}}>
                            <Text style={{flex:2, alignSelf:"center", textAlign:'right'}}>Application name :</Text>
                            <TextInput style = {{
                                            flex:3,
                                            height: 40,
                                            width:120,
                                            borderColor: 'gray',
                                            borderWidth: 1,
                                            alignSelf:'center'}}
                                underlineColorAndroid = "transparent"
                                placeholder = "Name application"
                                placeholderTextColor = "gray"
                                autoCapitalize = "none"
                                onChangeText = {this.handleEmail}
                                />
                        </View>)
            }
            break
            case 2:{
                return(<TouchableOpacity
                    onPress={()=>{
                        // ListAllCategory
                        // alert('ListAllCategory')
                        this.props.navigation.navigate("ListAllCategory", { handleCategoryBack: this.handleCategoryBack })
                    }}
                        >
                        <View style={{height:60, flexDirection:'row'}}>
                            <Text style={{flex:2, alignSelf:"center", textAlign:'right'}}>Category :</Text>
                            <View style={{flex:3, flexDirection:'row', alignItems:'center'}}>
                                <Text style={{}}>Select Category</Text>
                                <FastImage
                                    style={{width: 20, height: 20, position:'absolute', right:0}}
                                    source={require('../../Images/disclosure_indicator.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>)
            }
            break
            case 3:{

                if(this.state.category_select == -99){
                    return
                }

                return(<TouchableOpacity
                        onPress={()=>{
                            // ListAllCategory
                            // alert('ListAllCategory')
                            this.props.navigation.navigate("ListAllSubcategory", { handleSubcategoryBack: this.handleSubcategoryBack })
                        }}
                            >
                            <View style={{height:60, flexDirection:'row'}}>
                                <Text style={{flex:2, alignSelf:"center", textAlign:'right'}}>Subcategory :</Text>
                                <View style={{flex:3, flexDirection:'row', alignItems:'center'}}>
                                    <Text style={{}}>Select Subcategory</Text>
                                    <FastImage
                                        style={{width: 20, height: 20, position:'absolute', right:0}}
                                        source={require('../../Images/disclosure_indicator.png')}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>)
            }
            break

            default:{
              
            }
        }

        
    }

    handleEmail = (text) => {
        this.setState({ text: text })
     }
    
    render() {

        // let swipeBtns = [{
        //   text: 'Delete',
        //   backgroundColor: 'red',
        //   underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        //   onPress: () => { this.deleteNote(rowData) }
        // }];
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
              // ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              // onRefresh={this.handleRefresh}
              // refreshing={this.state.refreshing}
              // onEndReached={this.handleLoadMore}
              onEndReachedThreshold={50}
              extraData={this.state}
            />
          }
          </View>
        );
      }
}