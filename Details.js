import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Details</Text>

        <Button
          title='Bottom Tabs'
          onPress={() => this.props.navigation.push("alert", { name: "Ehsan" })}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
