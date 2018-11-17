import React from "react";
import { View, AsyncStorage } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
// import { onSignIn } from "../auth";

export default ({navigation}) => (
  <View style={{ paddingVertical: 20 }}>
    <Card title="SIGN UP">
      <FormLabel>Email</FormLabel>
      <FormInput placeholder="Email address..." />
      <FormLabel>Password</FormLabel>
      <FormInput secureTextEntry placeholder="Password..." />
      <FormLabel>Confirm Password</FormLabel>
      <FormInput secureTextEntry placeholder="Confirm Password..." />

      <Button
        buttonStyle={{ marginTop: 20 }}
        backgroundColor="#03A9F4"
        title="SIGN UP"
        // onPress={() => onSignIn()}
        onPress={() => {
          AsyncStorage.setItem("auth-demo-key", "true", ()=>{
            navigation.navigate("Main")
          })          
        }
        }
      />
      <Button
        buttonStyle={{ marginTop: 20 }}
        backgroundColor="transparent"
        textStyle={{ color: "#bcbec1" }}
        title="Sign In"
        // onPress={() => alert("go to sign in screen")}
        onPress={() => navigation.navigate("SignIn")}
      />
    </Card>
  </View>
);
