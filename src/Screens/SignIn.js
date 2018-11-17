import React from "react";
import { View, AsyncStorage } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
// import { onSignIn } from "../auth";

export default ({navigation}) => (
  <View style={{ paddingVertical: 20 }}>
    <Card title="SIGN IN">
      <FormLabel>Email</FormLabel>
      <FormInput placeholder="Email address..." />
      <FormLabel>Password</FormLabel>
      <FormInput secureTextEntry placeholder="Password..." />

      <Button
        buttonStyle={{ marginTop: 20 }}
        backgroundColor="#03A9F4"
        title="SIGN IN"
        onPress={() => {
          // onSignIn().then( () => navigation.navigate("SignedIn")); // NEW LOGIC
          AsyncStorage.setItem("auth-demo-key", "true", ()=>{
            navigation.navigate("Main")
          });
        }}
      />
    </Card>
  </View>
);
