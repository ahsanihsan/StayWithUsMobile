import React, { Component } from "react";
import { Text, View } from "react-native";
import Header from "../../ReuseableComponents/Header";

export default class ContactUs extends Component {
	render() {
		return (
			<View>
				<Header title="Contact Us" />
				<View
					style={{
						width: "100%",
						alignItems: "center",
						justifyContent: "center",
						marginTop: 100,
					}}
				>
					<Text>This is dummy content for contact us page</Text>
				</View>
			</View>
		);
	}
}
