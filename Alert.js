import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default class Alert extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "rgba(0,0,0,0.8)",
				}}
			>
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
				>
					<MaterialCommunityIcons
						name="sticker-emoji"
						color="white"
						size={64}
					/>
					<Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
						Hello{" "}
						{this.props.route.params.name ? this.props.route.params.name : ""}
					</Text>
					<Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
						Welcome
					</Text>
				</View>

				<View
					style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
				>
					<TouchableOpacity
						onPress={() => this.props.navigation.pop()}
						style={{}}
					>
						<Text style={{ color: "red", fontSize: 24, fontWeight: "bold" }}>
							Close
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
