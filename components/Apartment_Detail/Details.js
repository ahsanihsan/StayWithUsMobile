import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import {
  EvilIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Rating, AirbnbRating } from "react-native-elements";
import { Chip, Button } from "react-native-paper";
export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={200}
            decelerationRate='fast'
            pagingEnabled
            style={{ flex: 1, marginVertical: 5 }}>
            <Image
              source={{
                uri:
                  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
              }}
              style={{
                width: Dimensions.get("window").width,
                height: 300,

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
                width: Dimensions.get("window").width,
                height: 300,

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
                width: Dimensions.get("window").width,
                height: 300,

                borderRadius: 15,
                resizeMode: "cover",
              }}
            />
          </ScrollView>
        </View>
        <View style={styles.apart_details}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>Wooden house</Text>
          <Text style={{ textAlignVertical: "center", color: "gray" }}>
            {" "}
            <EvilIcons name='location' size={28} />
            Faisal Town, Lahore
          </Text>
          <Rating
            readonly
            startingValue={4}
            imageSize={18}
            style={{ alignSelf: "flex-start", marginLeft: 10, marginTop: 5 }}
          />
          <Text style={{ fontSize: 18, marginVertical: 10 }}>
            {" "}
            <Text style={{ color: "#0652DD", fontWeight: "bold" }}>
              35,000
            </Text>{" "}
            PKR / Month
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "center",
              marginVertical: 20,
            }}>
            <View
              style={{
                width: 160,
                flexDirection: "row",
                justifyContent: "space-around",
                borderColor: "gray",
                alignItems: "center",
                borderWidth: 2,
                padding: 10,
                margin: 10,
              }}>
              <FontAwesome5 name='building' size={32} color='black' />
              <Text style={{ fontSize: 16, color: "#333" }}>2600 sqft</Text>
            </View>
            <View
              style={{
                width: 160,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                borderColor: "gray",
                borderWidth: 2,
                margin: 10,
                padding: 10,
              }}>
              <FontAwesome name='bed' size={32} color='black' />
              <Text style={{ fontSize: 16, color: "#333" }}>4 Bedrooms</Text>
            </View>
            <View
              style={{
                width: 160,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                borderColor: "gray",
                borderWidth: 2,
                margin: 10,
                padding: 10,
              }}>
              <MaterialCommunityIcons name='kettle' size={32} color='black' />
              <Text style={{ fontSize: 16, color: "#333" }}>2 Kitchens</Text>
            </View>
            <View
              style={{
                width: 160,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                borderColor: "gray",
                borderWidth: 2,
                margin: 10,
                padding: 10,
              }}>
              <FontAwesome5 name='bath' size={32} color='black' />
              <Text style={{ fontSize: 16, color: "#333" }}>4 Bathrooms</Text>
            </View>
          </View>
          <View style={{ flex: 1, marginVertical: 20, paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold" }}>
              Description{" "}
            </Text>
            <View style={{}}>
              <Text style={{ textAlign: "justify" }}>
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised
                in the 1960s with the release of Letraset sheets containing
                Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
              </Text>
            </View>
          </View>
          <Button
            style={{
              padding: 10,
              borderRadius: 20,
              backgroundColor: "#0652DD",
            }}
            contentStyle={{}}
            labelStyle={{ fontSize: 18, fontWeight: "bold" }}
            mode='contained'
            onPress={() => console.log("Pressed")}>
            Rent now
          </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  apart_details: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
