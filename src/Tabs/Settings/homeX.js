import React from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import SettingsList from 'react-native-settings-list';

import Icon from 'react-native-vector-icons/FontAwesome5';

import Styles from '../../styles';

import FastImage from 'react-native-fast-image'


// simple example
class SettingsListExample extends React.Component {
  constructor(){
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {switchValue: false, stages: 20};
  }
  render() {
    return (
      <View style={{backgroundColor:'gray',flex:1}}>
        <View style={{flex:1, marginTop:50}}>
          <SettingsList>
          <SettingsList.Header headerText='First Grouping' headerStyle={{color:'white'}}/>
            <SettingsList.Item
              icon={
                <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                  <Image style={{alignSelf:'center',height:30, width:30}} source={require('./images/about.png')}/>
                </View>
              }
              itemWidth={50}
              title='Icon Example'
              onPress={() => Alert.alert('Icon Example Pressed')}
            />
            <SettingsList.Item
              hasNavArrow={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasSwitch={true}
              title='Switch Example'/>
            <SettingsList.Item
              title='Different Colors Example'
              backgroundColor='#D1D1D1'
              titleStyle={{color:'blue'}}
              arrowStyle={{color:'blue'}}
              onPress={() => Alert.alert('Different Colors Example Pressed')}/>
            <SettingsList.Header headerText='Different Grouping' headerStyle={{color:'white', marginTop:50}}/>
            <SettingsList.Item titleInfo='Some Information' hasNavArrow={false} title='Information Example'/>
            <SettingsList.Item title='Settings 1'/>
            <SettingsList.Item title='Settings 2'/>
            <SettingsList.Item
              id="stages"
              title='stages'
              isEditable={true}
              value={this.state.stages.toString()}
              onTextChange={(text) => this.setState({stages: text})} 
            />
          </SettingsList>
        </View>
      </View>
    );
  }
  onValueChange(value){
    this.setState({switchValue: value});
  }
}


/**
 * realistic iPhone example
 */
class home extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: "Settings",
      headerLeft: (
          <TouchableOpacity
              style={Styles.headerButton}
              onPress={() => navigation.openDrawer()}>
              <Icon name="bars" size={25} />
          </TouchableOpacity>
      ),
      // headerRight: (
      //     <TouchableOpacity
      //         style={Styles.headerButton}
      //         onPress={() => alert("address-book click")}>
      //         <Icon name="address-book" size={20} />
      //     </TouchableOpacity>
      //   ),
    })     

    constructor(props){
      super(props);
      this.onValueChange = this.onValueChange.bind(this);
      this.state = {
        switchValue: false, 
        loggedIn: false,
        renderContent : false,
      };
    }

    componentDidMount() {
      setTimeout(() => {this.setState({renderContent: true})}, 0);
    }


    render() {
      let {
        renderContent
      } = this.state;

      /*
      {"key":1, "id":1, "name":"Hide"},
            {"key":2, "id":2, "name":"Block"},
            {"key":3, "id":3, "name":"Manage class"},
            {"key":4, "id":4, "name":"Manage group"},
            {"key":5, "id":5, "name":"Manage my application"},
            {"key":6, "id":6, "name":"Force Logout"},
            {"key":7, "id":7, "name":"Customize Tab Menus"},
            {"key":8, "id":8, "name":"Logout"},
       */


     var bgColor = '#DCE3F4';
     return (
       <View style={{backgroundColor:'#EFEFF4',flex:1}}>
         {/* <View style={{borderBottomWidth:1, backgroundColor:'#f7f7f8',borderColor:'#c8c7cc'}}>
           <Text style={{alignSelf:'center',marginTop:30,marginBottom:10,fontWeight:'bold',fontSize:16}}>Settings</Text>
         </View> */}

         { renderContent &&
         <View style={{backgroundColor:'#EFEFF4',flex:1}}>
           <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
             {/* <SettingsList.Header headerStyle={{marginTop:15}}/>
             {this.state.toggleAuthView ?
               <SettingsList.Item
                 icon={
                     <Image style={styles.imageStyle} source={require('./images/user.png')}/>
                 }
                 title='Logged In As...'
                 hasNavArrow={false}
               />
               :
               <SettingsList.Item
                 icon={
                     <Image style={styles.imageStyle} source={require('./images/user.png')}/>
                 }
                 isAuth={true}
                 authPropsUser={{placeholder:'E-mail'}}
                 authPropsPW={{placeholder:'Password'}}
                 onPress={() => this.toggleAuthView()}
               />
             } */}
             <SettingsList.Header headerStyle={{marginTop:15}}/>
             <SettingsList.Item
               icon={
                  //  <Image style={styles.imageStyle} source={require('./images/airplane.png')}/>

                  <FastImage
                        style={styles.imageStyle}
                        source={require('./images/airplane.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
               }

              //  hasSwitch={true}
              //  switchState={this.state.switchValue}
              //  switchOnValueChange={this.onValueChange}
              //  hasNavArrow={false}
              //  title='Airplane Mode'

              title='Hide'
              // titleInfo='Airplane Mode'
              titleInfoStyle={styles.titleInfoStyle}
              onPress={() => Alert.alert('Hide')}
             />
             <SettingsList.Item
               icon={
                // <Image style={styles.imageStyle} source={require('./images/wifi.png')}/>
                <FastImage
                  style={styles.imageStyle}
                  source={require('./images/wifi.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
               }
               title='Block'
              //  titleInfo='Bill Wi The Science Fi'
               titleInfoStyle={styles.titleInfoStyle}
               onPress={() => Alert.alert('Block')}
             />
             <SettingsList.Item
               icon={
              //  <Image style={styles.imageStyle} source={require('./images/blutooth.png')}/>
              <FastImage
                  style={styles.imageStyle}
                  source={require('./images/blutooth.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              }
               title='Manage class'
              //  titleInfo='Off'
               titleInfoStyle={styles.titleInfoStyle}
               onPress={() => Alert.alert('Manage class')}
             />
             <SettingsList.Item
               icon={
                // <Image style={styles.imageStyle} source={require('./images/cellular.png')}/>
                <FastImage
                  style={styles.imageStyle}
                  source={require('./images/cellular.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              }
               title='Manage group'
               onPress={() => Alert.alert('Manage group')}
             />
             <SettingsList.Item
               icon={
                // <Image style={styles.imageStyle} source={require('./images/hotspot.png')}/>
                <FastImage
                  style={styles.imageStyle}
                  source={require('./images/hotspot.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              }
               title='Manage my application'
              //  titleInfo='Off'
               titleInfoStyle={styles.titleInfoStyle}
               onPress={() => Alert.alert('Manage my application')}
             />
             <SettingsList.Header headerStyle={{marginTop:15}}/>
             <SettingsList.Item
               icon={
                // <Image style={styles.imageStyle} source={require('./images/notifications.png')}/>
                <FastImage
                  style={styles.imageStyle}
                  source={require('./images/notifications.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              }
               title='Force Logout'
               onPress={() => Alert.alert('Force Logout')}
             />
             <SettingsList.Item
               icon={<Image style={styles.imageStyle} source={require('./images/control.png')}/>}
               title='Customize Tab Menus'
               onPress={() => Alert.alert('Customize Tab Menus')}
             />
             
             {/* <SettingsList.Item
               icon={
              //  <Image style={styles.imageStyle} source={require('./images/dnd.png')}/>
                  <FastImage
                  style={styles.imageStyle}
                  source={require('./images/dnd.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                }
               title='Do Not Disturb'
               onPress={() => Alert.alert('Route To Do Not Disturb Page')}
             />
             <SettingsList.Header headerStyle={{marginTop:15}}/>
             <SettingsList.Item
               icon={
                // <Image style={styles.imageStyle} source={require('./images/general.png')}/>
                <FastImage
                  style={styles.imageStyle}
                  source={require('./images/general.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              }
               title='General'
               onPress={() => Alert.alert('Route To General Page')}
             /> */}
             
             <SettingsList.Item
               icon={
                // <Image style={styles.imageStyle} source={require('./images/display.png')}/>
                  <FastImage
                    style={styles.imageStyle}
                    source={require('./images/display.png')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                }
               title='Logout'
               onPress={() =>
              {

                Alert.alert(
                  'Logout',
                  'Are you sure you want to log out?',
                  [
                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                    {text: 'Cancel', 
                    onPress: () => {console.log("cancel")}, 
                    style: 'cancel'},
                    {text: 'OK', 
                    onPress: () => {
                        AsyncStorage.removeItem("auth-demo-key", ()=>{
                          this.props.navigation.navigate("SignedOut")

                          //   // AsyncStorage.getItem("auth-demo-key")
                          //   // .then(res => {
                          //   //   console.log("3, res")
                          //   //   console.log(res)
                          //   //   console.log("4, res")
                              
                          //   // })
                          //   // .catch(err => alert("error"));
                          })
                          console.log(this.props)
                        }, 
                    },
                  ],
                  { cancelable: false }
                )
              }
              }
              
             />
           </SettingsList>
         </View>
         }
       </View>
     );
   }
   toggleAuthView() {
     this.setState({toggleAuthView: !this.state.toggleAuthView});
   }
   onValueChange(value){
     this.setState({switchValue: value});
   }
 }

const styles = StyleSheet.create({
  imageStyle:{
    marginLeft:15,
    alignSelf:'center',
    height:30,
    width:30
  },
  titleInfoStyle:{
    fontSize:16,
    color: '#8e8e93'
  }
});

// module.exports = SettingsListExample;

export default home