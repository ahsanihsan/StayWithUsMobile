import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	AsyncStorage,
} from "react-native";
import {
	Avatar,
	Badge,
	Headline,
	Button,
	ActivityIndicator,
} from "react-native-paper";
import Constants from "expo-constants";
import { Entypo } from "@expo/vector-icons";
export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		};
	}

	async componentDidMount() {
		let profile = await AsyncStorage.getItem("currentUser");
		if (profile) {
			profile = JSON.parse(profile);
			this.setState({ profile, isLoading: false });
		}
	}

	render() {
		const { profile } = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.imgContainer}>
					<Avatar.Image
						size={128}
						style={styles.imgStyles}
						source={require("../../assets/boy.png")}
					/>
					{this.state.isLoading ? (
						<ActivityIndicator />
					) : (
						<>
							<View style={{ marginLeft: -30 }}>
								<Text
									style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}
								>
									{profile.name}
								</Text>
								<Text style={{ fontSize: 15, color: "#fff" }}>
									{profile.email}
								</Text>
								<Text style={{ fontSize: 16, color: "#fff" }}>
									{profile.phone_number}
								</Text>
							</View>
						</>
					)}
				</View>
				<View style={styles.userDataContainer}>
					<View style={{ flex: 1, marginHorizontal: 20, marginTop: 10 }}>
						<Text
							style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}
						>
							My Wishlist
						</Text>
						{/* <ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							style={{ flex: 1 }}
						>
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
						</ScrollView> */}
					</View>
				</View>

				<Button
					mode="contained"
					icon="logout"
					uppercase={true}
					onPress={() => {
						this.props.navigation.replace("auth");
					}}
					style={{
						backgroundColor: "#B53471",
						marginHorizontal: 10,
						marginBottom: 20,
						borderRadius: 20,
						padding: 5,
					}}
				>
					Logout
				</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
