import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Header({ title, isBack, navigation }) {
	return (
		<View
			style={{
				backgroundColor: "#130f40",
				width: "100%",
				height: 100,
				justifyContent: "flex-end",
			}}
		>
			{isBack ? (
				<TouchableOpacity
					style={{
						position: "absolute",
						zIndex: 100,
						padding: 15,
					}}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<MaterialCommunityIcons
						name="keyboard-backspace"
						color="white"
						size={30}
					/>
				</TouchableOpacity>
			) : undefined}
			<Text
				style={{
					color: "white",
					textAlign: "center",
					fontSize: 20,
					marginBottom: 20,
				}}
			>
				{title}
			</Text>
		</View>
	);
}
