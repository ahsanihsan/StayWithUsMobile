import React, { Component } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	Dimensions,
	Linking,
	RefreshControl,
	AsyncStorage,
} from "react-native";
import Constants from "expo-constants";
import {
	EvilIcons,
	FontAwesome5,
	FontAwesome,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Rating, AirbnbRating } from "react-native-elements";
import { Chip, ActivityIndicator } from "react-native-paper";
import Header from "../../ReuseableComponents/Header";
import { URL } from "../../Helpers/helper";
import Axios from "axios";
import Modal from "react-native-modal";
import { Button } from "galio-framework";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Details extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	fetch = () => {
		this.setState({ refreshing: true });
		let id = this.props.route.params.id;
		Axios({
			method: "GET",
			url: URL + "property/" + id,
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						this.setState({
							property: response.data.message,
							isLoading: false,
							refreshing: false,
						});
					} else {
						this.setState({
							property: null,
							isLoading: false,
							refreshing: false,
						});
					}
				}
			})
			.catch((error) => {
				this.setState({ property: null, isLoading: false, refreshing: false });
			});
	};

	handleAddToWishlist = async () => {
		this.setState({ addingWishList: true });
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let id = currentUser._id;

		let propertyId = this.state.property._id;

		Axios({
			method: "POST",
			url: URL + "users/wishlist",
			data: {
				property: propertyId,
				user: id,
			},
		})
			.then((response) => {
				if (response.data) {
					if (response.data.success) {
						console.log("******");
						console.log(response.data);
						console.log("******");
						this.setState({
							alreadyFavourite: !this.state.alreadyFavourite,
							addingWishList: false,
						});
					} else {
						this.setState({ addingWishList: false });
					}
				}
				this.setState({ addingWishList: false });
			})
			.catch((error) => {
				console.log("******");
				console.log(error.response);
				console.log("******");
				this.setState({ addingWishList: false });
			});
	};

	async componentDidMount() {
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let userRole = currentUser.userType;
		this.setState({ userRole });
		this.fetch();
	}

	render() {
		const { property } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "white" }}>
				<Header title="Details" isBack navigation={this.props.navigation} />
				{this.state.isLoading ? (
					<ActivityIndicator />
				) : (
					<ScrollView
						style={{ marginBottom: 10 }}
						refreshControl={
							<RefreshControl
								onRefresh={() => this.fetch()}
								refreshing={this.state.refreshing}
							/>
						}
					>
						{this.state.property ? (
							<>
								<View style={styles.imageContainera}>
									<ScrollView
										horizontal={true}
										showsHorizontalScrollIndicator={false}
										scrollEventThrottle={200}
										decelerationRate="fast"
										pagingEnabled
										style={{ flex: 1 }}
									>
										<Image
											source={{
												uri: URL + property._id + ".jpg",
											}}
											style={{
												width: Dimensions.get("window").width,
												height: 300,
											}}
										/>
									</ScrollView>
								</View>
								<View style={styles.apart_details}>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 28, fontWeight: "bold" }}>
											{property.name}
										</Text>
										{this.state.userRole === "Seller" ? (
											<Button
												style={{ width: "20%", margin: 10 }}
												onPress={() => {
													this.props.navigation.navigate("EditApartment", {
														id: property._id,
													});
												}}
											>
												Edit
											</Button>
										) : (
											<TouchableOpacity
												onPress={() => {
													this.handleAddToWishlist();
												}}
											>
												<MaterialCommunityIcons
													name="heart"
													color={this.state.alreadyFavourite ? "red" : "grey"}
													size={50}
													style={{ padding: 20 }}
												/>
											</TouchableOpacity>
										)}
									</View>
									<Text style={{ textAlignVertical: "center", color: "gray" }}>
										{" "}
										<EvilIcons name="location" size={28} />
										{property.address}
									</Text>
									<Rating
										readonly
										startingValue={property.rating}
										style={{
											alignSelf: "flex-start",
											marginLeft: 10,
											marginTop: 5,
											backgroundColor: "transparent",
										}}
										imageSize={18}
									/>
									<Text>
										<Text
											style={{
												fontSize: 25,
												color: "#0652DD",
												fontWeight: "bold",
											}}
										>
											{property.rent}
										</Text>
										<Text> PKR / month</Text>
									</Text>
									<View
										style={{
											flex: 1,
											flexDirection: "row",
											justifyContent: "center",
											flexWrap: "wrap",
											alignItems: "center",
											marginVertical: 20,
										}}
									>
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
											}}
										>
											<FontAwesome5 name="building" size={32} color="black" />
											<Text style={{ fontSize: 16, color: "#333" }}>
												{property.area} sqft
											</Text>
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
											}}
										>
											<FontAwesome name="bed" size={32} color="black" />
											<Text style={{ fontSize: 16, color: "#333" }}>
												{property.bedroom} Bedrooms
											</Text>
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
											}}
										>
											<MaterialCommunityIcons
												name="kettle"
												size={32}
												color="black"
											/>
											<Text style={{ fontSize: 16, color: "#333" }}>
												{property.kitchen} Kitchens
											</Text>
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
											}}
										>
											<FontAwesome5 name="bath" size={32} color="black" />
											<Text style={{ fontSize: 16, color: "#333" }}>
												{property.bathroom} Bathroom
											</Text>
										</View>
									</View>
									<View
										style={{
											flex: 1,
											marginVertical: 20,
											paddingHorizontal: 10,
										}}
									>
										<Text style={{ fontSize: 28, fontWeight: "bold" }}>
											Description{" "}
										</Text>
										<View style={{}}>
											<Text style={{ textAlign: "justify" }}>
												{property.description}
											</Text>
										</View>
									</View>
									{this.state.userRole === "Seller" ? undefined : (
										<Button
											style={{
												padding: 10,
												borderRadius: 20,
												backgroundColor: "#0652DD",
											}}
											contentStyle={{}}
											labelStyle={{ fontSize: 18, fontWeight: "bold" }}
											mode="contained"
											onPress={() => this.setState({ modalVisible: true })}
										>
											Rent now
										</Button>
									)}
									<Modal
										isVisible={this.state.modalVisible}
										onBackButtonPress={() => {
											this.setState({ modalVisible: false });
										}}
										onBackdropPress={() => {
											this.setState({ modalVisible: false });
										}}
									>
										<View
											style={{
												backgroundColor: "#fff",
												width: "80%",
												padding: 20,
												borderRadius: 10,
												alignSelf: "center",
											}}
										>
											<Text
												style={{
													textAlign: "center",
													fontSize: 20,
													marginBottom: 15,
												}}
											>
												Contact Seller
											</Text>
											<Button
												style={{
													padding: 10,
													borderRadius: 20,
													backgroundColor: "#0652DD",
													width: "100%",
												}}
												labelStyle={{ fontSize: 18, fontWeight: "bold" }}
												mode="contained"
												onPress={() => {
													Linking.openURL(
														`tel:${property.seller.phone_number}`
													);
												}}
											>
												Call Seller
											</Button>
											<Button
												style={{
													padding: 10,
													borderRadius: 20,
													backgroundColor: "#0652DD",
													marginTop: 10,
													width: "100%",
												}}
												contentStyle={{}}
												labelStyle={{ fontSize: 18, fontWeight: "bold" }}
												mode="contained"
												onPress={() => {
													Linking.openURL(
														`sms:/open?addresses=${property.seller.phone_number}&body=Hi, I just saw your property with the name ${property.name} near ${property.address}`
													);
												}}
											>
												Text Seller
											</Button>
											<Button
												onPress={() => {
													Linking.openURL(
														`mailto:${property.seller.email}?subject=Rent Application&body=Hi, I saw your ad on Stay With Us, your property name is ${property.name} near ${property.address}`
													);
												}}
												style={{
													padding: 10,
													borderRadius: 20,
													backgroundColor: "#0652DD",
													marginTop: 10,
													width: "100%",
												}}
												contentStyle={{}}
												labelStyle={{ fontSize: 18, fontWeight: "bold" }}
												mode="contained"
											>
												Email Seller
											</Button>
										</View>
									</Modal>
								</View>
							</>
						) : (
							<Text style={{ padding: 10, textAlign: "center" }}>
								There was a problem, fetching the property.
							</Text>
						)}
					</ScrollView>
				)}
			</View>
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
