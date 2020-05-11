import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import constants from "expo-constants";
import { Button } from "react-native-paper";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainHeader}>
          <Text style={styles.mainText}>Find your house</Text>
          <View style={styles.mainIcons}>
            <Ionicons name='ios-search' size={32} color='gray' />
            <MaterialCommunityIcons
              name='filter-outline'
              size={32}
              color='gray'
            />
          </View>
        </View>
        <Text style={{ fontSize: 16, color: "gray", marginLeft: 20 }}>
          30 results in your area
        </Text>
        <View style={styles.mainCard}>
          <View style={styles.mainCardImage}>
            <Image
              source={require("../../assets/Images/Home/cityHeights.jpg")}
              style={{
                width: null,
                height: null,
                flex: 1,

                resizeMode: "center",
                borderRadius: 20,
              }}
            />
            <View style={styles.mainCardText}>
              <View>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  City heights
                </Text>
                <Text style={{ fontSize: 16, color: "gray" }}>DHA, Lahore</Text>
              </View>
              <Button
                onPress={() => this.props.navigation.push("Details")}
                mode='contained'
                style={{
                  justifyContent: "center",
                  backgroundColor: "#0652DD",
                  borderRadius: 40,
                }}>
                40,000 PKR
              </Button>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, marginHorizontal: 20, marginTop: 40 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
            Populer
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
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: constants.statusBarHeight,
  },
  mainText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  mainHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  mainIcons: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    paddingHorizontal: 10,
  },
  mainCard: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  mainCardImage: {
    flex: 1,
    borderBottomColor: "#333",
  },
  mainCardText: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginTop: 10,
  },
});
