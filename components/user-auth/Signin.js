import React, { Component } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Text, Input } from "galio-framework";
import { TextInput, Button, IconButton } from "react-native-paper";
import * as Animatable from "react-native-animatable";
export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "", error: false, loading: false };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Animatable.Image
            animation='pulse'
            easing='ease-in-out-circ'
            iterationCount='infinite'
            source={require("../../assets/logo.png")}
          />
        </View>
        <View
          style={{
            flex: 1,
          }}>
          {/* <Text
            h4
            color='#000'
            bold={true}
            style={{ textAlign: "center", marginBottom: 40 }}>
            Login
          </Text> */}
          <Input
            type='email-address'
            placeholder='Enter your email-address'
            right
            icon='email'
            family='Entypo'
            rounded
            style={{ width: "90%", alignSelf: "center" }}
            iconSize={16}
            iconColor='grey'
          />

          <Input
            placeholder='Enter your password'
            right
            rounded
            style={{ width: "90%", alignSelf: "center" }}
            password={true}
            iconSize={16}
            iconColor='grey'
            viewPass={true}
          />
          <Button
            icon='account'
            mode='contained'
            color='#130f40'
            labelStyle={{ fontSize: 16 }}
            loading={this.state.loading}
            style={{
              width: "90%",
              padding: 2,
              marginTop: 12,
              borderRadius: 15,
              alignSelf: "center",
            }}
            onPress={() => this.setState({ loading: true })}>
            LOGIN
          </Button>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}>
            <Text h6>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.push("signup")}>
              <Text style={{ fontSize: 20, color: "#0097e6", marginLeft: 5 }}>
                SignUp
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
