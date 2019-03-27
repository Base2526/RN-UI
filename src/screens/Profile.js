import React from "react";
import { View, AsyncStorage, SafeAreaView } from "react-native";
import { Card, Button, Text } from "react-native-elements";
// import { onSignOut } from "../auth";

export default ({navigation}) => (
  <SafeAreaView style={{ flex: 1 }}>
  <View style={{ paddingVertical: 20 }}>
    <Card title="John Doe">
      <View
        style={{
          backgroundColor: "#bcbec1",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: 40,
          alignSelf: "center",
          marginBottom: 20
        }}
      >
        <Text style={{ color: "white", fontSize: 28 }}>JD</Text>
      </View>
      {/* <Button
        backgroundColor="#03A9F4"
        title="SIGN OUT"
        onPress={() => onSignOut()}
      /> */}
      <Button
        backgroundColor="#03A9F4"
        title="SIGN OUT"
        onPress={() => 
            // onSignOut().then(() => navigation.navigate("SignedOut"))

            // AsyncStorage.removeItem("auth-demo-key", ()=>{
            //   navigation.navigate("SignedOut")

            //   // AsyncStorage.getItem("auth-demo-key")
            //   // .then(res => {
            //   //   console.log("3, res")
            //   //   console.log(res)
            //   //   console.log("4, res")
                
            //   // })
            //   // .catch(err => alert("error"));
            // })

            navigation.navigate("Auth")
        } // NEW LOGIC
      />
    </Card>
  </View>
  </SafeAreaView>
);
