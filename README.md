# RN-UI

install 
ios
 - cd ios sudo rm -R Pods/ 
 - cd ios pod install
 - npm install 
 
android :
 - Unable to resolve dependency for ':react-native-maps@debug/compileClasspath': Could not resolve com.android.support:support-compat:   ===>>> Solve https://github.com/react-native-community/react-native-maps/issues/2695
 
 
  react-native start --reset-cache
  react-native run-ios or react-native run-android
  
  
http://128.199.149.168/sites/default/files/ScreenRecording_03-28-2562%2015-04-51.MP4
  
source code : 

   src > tabs > tab_contacts > FriendsPages.js
   line : 233
   
   // @work
   let params = {'type':'private', 'data':rowItem}
   this.props.params.navigation.navigate("ChatPage", {'title': 'Private ' + rowItem.name, params})
                      
   
   src > tabs > tab_contacts > GroupsPages.js
   line : 286
   
   // @work
   let params = {'type':'group', 'data':rowItem}
   this.props.params.navigation.navigate("ChatPage", {'title':'Group ' + rowItem.name, params})
                        
   
   
