import React, { Component } from "react";
import { Text, View } from "react-native";
import Header from "../../ReuseableComponents/Header";
import * as Animatable from "react-native-animatable";

export default class ContactUs extends Component {
	render() {
		return (
			<View>
				<Header isBack title="Contact Us" navigation={this.props.navigation} />
				<View
					style={{
						width: "100%",
						alignItems: "center",
						justifyContent: "center",
						marginTop: 100,
					}}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							marginTop: 20,
						}}
					>
						<Animatable.Image
							animation="pulse"
							easing="ease-in-out-circ"
							iterationCount="infinite"
							source={require("../../assets/logo.png")}
						/>
					</View>
					<View style={{ marginTop: 150 }}>
						<Text>Contact Us at +923123456789</Text>
						<Text>Email Us at info@staywithus.com</Text>
						<Text>Head office in Lahore, Pakistan</Text>
					</View>
				</View>
			</View>
		);
	}
}
