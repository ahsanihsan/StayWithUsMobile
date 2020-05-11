import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Avatar, Badge, Headline, Button } from "react-native-paper";
import Constants from "expo-constants";
import { Entypo } from "@expo/vector-icons";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Avatar.Image
            size={128}
            style={styles.imgStyles}
            source={require("../../assets/boy.png")}
          />
          <View style={{}}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
              Ehsan Ahmad
            </Text>
            <Text style={{ fontSize: 12, color: "#fff" }}>27 Years old</Text>
            <Text style={{ fontSize: 12, color: "#fff" }}>
              Lahore, Pakistan
            </Text>
            <Text style={{ fontSize: 16, color: "#fff" }}>0302-9422054</Text>
          </View>
        </View>
        <View style={styles.userDataContainer}>
          <View style={{ flex: 1, marginHorizontal: 20, marginTop: 10 }}>
            <Text
              style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
              My Wishlist
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}>
              <Image
                source={{
                  uri:
                    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                }}
                style={{
                  width: 200,
                  height: 200,
                  marginRight: 10,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
              />
              <Image
                source={{
                  uri:
                    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                }}
                style={{
                  width: 200,
                  height: 200,
                  marginRight: 10,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
              />
              <Image
                source={{
                  uri:
                    "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                }}
                style={{
                  width: 200,
                  height: 200,
                  marginRight: 10,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
              />
            </ScrollView>
          </View>
        </View>

        <Button
          mode='contained'
          icon='logout'
          uppercase={true}
          style={{
            backgroundColor: "#B53471",
            marginHorizontal: 10,
            marginBottom: 20,
            borderRadius: 20,
            padding: 5,
          }}>
          Logout
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  imgContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 40,
    backgroundColor: "#474787",
  },
  imgStyles: {
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    overflow: "hidden",
    resizeMode: "contain",
    marginVertical: 10,
  },
  userDataContainer: {
    flex: 2,
    backgroundColor: "#ecf0f1",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -30,
    padding: 10,
  },
});
