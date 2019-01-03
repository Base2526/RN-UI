import React from 'react'
import {SafeAreaView, 
        View, 
        Text, 
        TextInput, 
        TouchableOpacity,
        FlatList,
        Linking} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
// import FastImage from 'react-native-fast-image'
// var Locale = require('react-native-locale');

import DeviceInfo from 'react-native-device-info';

import {search_google} from '../../Utils/Services'

import ImageWithDefault from '../../Utils/ImageWithDefault'

export default class GoogleSearchCompany extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            loading: false,
            textSearch:'',
            resultSearch:[]
        }

        this.renderItem = this.renderItem.bind(this)
        this._goToURL = this._goToURL.bind(this);

        // console.log(Locale.constants())

        console.log(DeviceInfo)
        console.log(DeviceInfo.getDeviceCountry())
        console.log(DeviceInfo.getDeviceLocale())
    }

    componentDidMount() {
        // https://github.com/apilayer/freegeoip#readme
        // var url = 'https://freegeoip.net/json/';
        // fetch(url)
        //   .then((response) => response.json())
        //   .then((responseJson) => {
        //     console.log(responseJson);
        //     // this.setState({
        //     //   countryName: responseJson.country_name,
        //     //   regionName: responseJson.region_name
        //     // });


        //   })
        //   .catch((error) => {
        //    console.error(error);
        //   });
    }



    _goToURL(url) {
        // const { url } = this.props;
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            console.log('Don\'t know how to open URI: ' + url);
          }
        });
    }

    onSearch(){
        // console.log('onSearch')
        if(this.state.textSearch === ''){
            alert("Text is empty.")
        }else{
            // console.log('onSearch : ' + this.state.textSearch)

            this.setState({
                loading:true
            })

            let textSearch = this.state.textSearch.replace(" ", "+")

            search_google(textSearch).then(data => {
                // this.setState({loading:false})

                console.log(data)

                if(data.hasOwnProperty('items')){
                    this.setState({loading:false, resultSearch:data.items})
                }else{
                    this.setState({loading:false, resultSearch:[]})
                }
            })
        }
    }

    renderItem(item){

        // console.log(item)
        // console.log(item.item.title)
        // console.log(item.pagemap.cse_thumbnail)

        let url_image = ''
        
        if(item.hasOwnProperty('item')){
            if(item.item.hasOwnProperty('pagemap')){
                if(item.item.pagemap.hasOwnProperty('cse_image')){
                    url_image = item.item.pagemap.cse_image[0].src
                }
            }
        }
        
        // if (Object.prototype.hasOwnProperty.call(item.item.pagemap, 'cse_image'))
        // {
        //     // console.log(item.item.pagemap.cse_image[0].src)

        //     // url_image = item.item.pagemap.cse_image[0].src
        // }
        return(
            <TouchableOpacity key={{}} onPress={() => console.log('--')}>
              <View
                style={{
                  alignItems: 'center', 
                  // margin: 5, 
                  padding: 10,
                  // borderWidth: 0.5, 
                //   borderColor: DictStyle.colorSet.lineColor,
                  flexDirection: 'row'
                }}
              >
                  <TouchableOpacity 
                      style={{height:60,
                              width: 60,
                              borderRadius: 10}}
                    onPress={()=> /*'google_search_company_detail'*/

                        {
                        // alert('g')
                        this.props.navigation.navigate("google_search_company_detail", {
                            item,
                          }) 
                          
                        // console.log(this)
                        }
                    }          
                    >
                      {/* <Image
                          style={{width: 40, height: 40, borderRadius: 10}}
                          source={{uri: 
                  'https://www.planwallpaper.com/static/images/9-credit-1.jpg'
                      }}/> */}
                      {/* <FastImage
                          style={{width: 60, height: 60, borderRadius: 10}}
                          source={{
                          uri: url_image,
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      /> */}

                    <ImageWithDefault 
                        source={{uri: url_image}}
                        style={{width: 60, height: 60, borderRadius: 10}}
                      />
                  </TouchableOpacity>
                  <View style={{paddingLeft: 10}}>
                    <Text style={{fontSize: 18, 
                                  fontWeight: '600', 
                                //   color: DictStyle.colorSet.normalFontColor,
                                  paddingBottom:5
                                }}>
                        {item.item.title}
                    </Text>
                    <TouchableOpacity key={{}} onPress={() => this._goToURL(item.item.link)}>
                    <Text style={{color: '#acacac',
                                   fontWeight: 'bold'}}
                        >
                      {item.item.link}
                    </Text>
                    </TouchableOpacity>
                  </View>
              </View>
             </TouchableOpacity>
        )
    }

    render(){

        // console.log(this.state.resultSearch);

        return( <SafeAreaView style={{flex:1}}>
                <Spinner
                visible={this.state.loading}
                textContent={'Search...'}
                textStyle={{color: '#FFF'}}
                overlayColor={'rgba(0,0,0,0.5)'}
                />
                <View style={{margin:5, flexDirection:'row'}}>
                    <TextInput style = {{ flex:3,
                                          alignItems: 'stretch',
                                        //   backgroundColor: 'red',
                                          padding:15,
                                          borderWidth:1,
                                          borderRadius:20,
                                          margin:5
                                        }}
                                // underlineColorAndroid = "transparent"
                                placeholder = "Search Company"
                                placeholderTextColor = "gray"
                                autoCapitalize = "none"
                                ref= {(el) => { this.textSearch = el; }}
                                onChangeText={(textSearch) => this.setState({textSearch})}
                                value={this.state.textSearch}/>
                    <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center'}}
                        onPress={()=>this.onSearch()}>
                        <Text style={{fontSize:18, color:'blue'}}>Search</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={this.state.resultSearch}
            
                    // renderItem={({item}) =>
                    //     <TouchableOpacity key={{}} onPress={() => console.log('--') }>
                    //         <View
                    //             style={{
                    //             alignItems: 'center', 
                    //             // margin: 5, 
                    //             padding: 10,
                    //             // borderWidth: 0.5, 
                    //             // borderColor: DictStyle.colorSet.lineColor,
                    //             flexDirection: 'row'
                    //             }}>
                    //             <Text>text</Text>
                    //         </View>
                    //     </TouchableOpacity>
                    // }

                    renderItem={this.renderItem}
                    // keyExtractor={item => item.email}
                    // ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    // ListFooterComponent={this.renderFooter}
                    // onRefresh={this.handleRefresh}
                    // refreshing={this.state.refreshing}
                    // onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={50}
                />  
                </SafeAreaView>)
    }
}