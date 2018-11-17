import React from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    SafeAreaView,
    AsyncStorage
  } from 'react-native';
import * as simpleAuthProviders from 'react-native-simple-auth';
import secrets from './secrets.example';


// class Welcome extends React.Component {

//     constructor(props) {
//       super(props);
//       this.state = {
//         name: this.getName(props.provider),
//         picture: this.getPictureLink(props.provider)
//       };
//     }
  
//     render() {
//       return (
 
//         <View style={styles.container}>
//             <Text>WWWW</Text>
//             {/* <Image style={styles.pic} source={{uri: this.state.picture }} />
//             <Text style={styles.header}>{this.state.name}</Text>
//             <View style={styles.scroll}>
//                 <Text style={styles.mono}>{JSON.stringify(this.props.info, null, 4)}</Text>
//             </View> */}
//         </View>
//       )
//     }
  
//     getName(provider) {
//       switch (provider) {
//         case 'instagram':
//           return this.props.info.data.full_name;
//         case 'linkedin':
//           return `${this.props.info.firstName} ${this.props.info.lastName}`;
//         default:
//           return this.props.info.name
//       }
//     }
  
//     getPictureLink(provider) {
//       switch (provider) {
//         case 'google':
//           return this.props.info.picture;
//         case 'facebook':
//           return `https://graph.facebook.com/${this.props.info.id}/picture?type=square`
//         case 'twitter':
//           return this.props.info.profile_image_url_https;
//         case 'instagram':
//           return this.props.info.data.profile_picture;
//         case 'tumblr':
//           return `https://api.tumblr.com/v2/blog/${this.props.info.name}.tumblr.com/avatar/96`;
//         case 'linkedin':
//           const profileUrl = `https://api.linkedin.com/v1/people/~:(picture-url)?oauth2_access_token=${this.props.info.token}&format=json`
//           fetch(profileUrl)
//             .then(response => response.json())
//             .then(responseJson => {
//               this.setState({ picture: responseJson.pictureUrl });
//             });
//           return '';
//       }
//     }  
// }

export default class Welcome extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false
      };
    }

  
    render() {

        // navigation.navigate("SignedIn")
        // console.log(this.props)
        
        let {navigation} = this.props

    // console.log(secrets)
      return (
        <View style={styles.content}>
          {
            this.state.loading ? null : Object.keys(secrets).map((provider, i) => {
              return (
                <TouchableHighlight
                  key={provider}
                  style={[styles.button, styles[provider]]}
                  onPress={this.onBtnPressed.bind(this, provider, secrets[provider])}>
                  <Text style={[styles.buttonText]}>{provider.split('-')[0]}</Text>
                </TouchableHighlight>
              );
            })

     
                
              
          }
         <TouchableHighlight
                  key="20"
                  style={[styles.button, styles.google]}
                    onPress={()=>{
                        // AsyncStorage.setItem("auth-demo-key", "true", ()=>{
                            // navigation.navigate("SignedOut")
                            navigation.navigate('SignUp')
                        //   });
                    }}>
                  <Text style={[styles.buttonText]}>SignIn/SignUp</Text>
                </TouchableHighlight>
          <ActivityIndicator
              animating={this.state.loading}
              style={[styles.loading]}
              size='large' />
        </View>
      );
    }
  
    onBtnPressed(provider, opts) {
      const _this = this;
      this.setState({
        loading: true
      });
      simpleAuthProviders[provider](opts)
        .then((info) => {
          _this.setState({
              loading: false
          });
        //   _this.props.navigator.push({
        //     title: provider,
        //     provider,
        //     info,
        //     index: 1
        //   });

          // SignedIn
          navigation.navigate("SignedIn")
        })
        .catch((error) => {
          _this.setState({
              loading: false
          });
          Alert.alert(
            'Authorize Error',
            error.message
          );
        });
    }  
}

// export class Welcome extends React.Component{

//     render(){
//         return(
//             <Profile />
//         )
//     }
// }

let styles = StyleSheet.create({
    text: {
      color: 'black',
      backgroundColor: 'white',
      fontSize: 30
    },
    container: {
      flex: 1
    },
    content: {
      flex: 1,
      marginTop: 10,
      marginRight: 10,
      marginLeft: 10
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      alignSelf: 'center'
    },
    button: {
      height: 36,
      flexDirection: 'row',
      borderRadius: 8,
      marginBottom: 10,
      justifyContent: 'center'
    },
    pic: {
      width: 100,
      height: 100
    },
    mono: {
      fontFamily: 'Menlo',
      paddingTop: 10
    },
    scroll: {
      marginTop: 0,
      paddingTop: 0,
      backgroundColor: '#f2f2f2',
      borderColor: '#888',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      flexDirection: 'row'
    },
    header: {
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
      fontSize: 16
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    google: {
      backgroundColor: '#ccc'
    },
    facebook: {
      backgroundColor: '#3b5998'
    },
    twitter: {
      backgroundColor: '#48BBEC'
    },
    instagram: {
      backgroundColor: '#3F729B'
    },
    tumblr: {
      backgroundColor: '#36465D'
    },
    linkedin: {
      backgroundColor: '#0077B5'
    }
  });