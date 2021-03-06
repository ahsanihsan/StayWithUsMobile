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
import { Input } from "galio-framework";
import MapView, { Marker } from "react-native-maps";

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
						this.getPropertyRating(response.data.message.rating);
						this.getSellerRating(
							response.data.message.seller.rating,
							response.data.message.seller.averageRate
						);
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

	handleRatings = async () => {
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let id = currentUser._id;
		Axios({
			method: "POST",
			url: URL + "property/rate",
			data: {
				property: this.state.property._id,
				user: id,
				rating: this.state.propertyRating,
				ratingText: this.state.ratingText,
			},
		})
			.then((response) => {
				this.fetch();
				this.setState({ ratingModal: false });
			})
			.catch((error) => {});
	};

	handleSellerRating = async () => {
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let id = currentUser._id;
		Axios({
			method: "POST",
			url: URL + "users/rate/" + this.state.property.seller._id,
			data: {
				user: id,
				rating: this.state.sellerRating,
				ratingText: this.state.sellerRatingText,
			},
		})
			.then((response) => {
				this.fetch();
				this.setState({ sellerRatingModal: false });
			})
			.catch((error) => {
				console.log("********");
				console.log(error);
				console.log("********");
			});
	};

	getPropertyRating = (rating) => {
		if (rating && rating instanceof Array && rating.length > 0) {
			let averageRating = 0;
			rating.map((item) => {
				if (item && item.rating) averageRating = averageRating + item.rating;
			});
			averageRating = averageRating / rating.length;
			this.setState({ rating: averageRating });
		} else {
			this.setState({ rating: 0 });
		}
	};

	getSellerRating = (rating, penalty) => {
		if (rating && rating instanceof Array && rating.length > 0) {
			let averageRating = 0;
			rating.map((item) => {
				if (item && item.rating) averageRating = averageRating + item.rating;
			});
			averageRating = averageRating / rating.length;
			averageRating = averageRating - penalty;
			this.setState({
				sellerRatingAverage: averageRating < 0 ? 0 : averageRating,
			});
		} else {
			this.setState({ sellerRatingAverage: 0 });
		}
	};
	render() {
		const { property, rating } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "white" }}>
				<Header title="Details" isBack navigation={this.props.navigation} />
				{this.state.isLoading ? (
					<ActivityIndicator />
				) : (
					<ScrollView
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
										{property.images.map((item, index) => {
											if (item) {
												return (
													<Image
														key={index}
														source={{
															uri: URL + item,
														}}
														style={{
															width: Dimensions.get("window").width,
															height: 300,
														}}
													/>
												);
											}
										})}
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
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											marginBottom: 10,
										}}
									>
										<Text style={{ fontSize: 15, marginLeft: 5, flex: 3 }}>
											Property Rating: &ensp;
										</Text>
										<View
											style={{
												flex: 5,
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Rating
												readonly
												startingValue={this.state.rating}
												style={{
													alignSelf: "flex-start",
													backgroundColor: "transparent",
												}}
												imageSize={25}
											/>
											<Text style={{ fontSize: 15, marginLeft: 5 }}>
												(
												{property.rating && property.rating instanceof Array
													? property.rating.length
													: 0}
												)
											</Text>
										</View>
									</View>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											marginBottom: 10,
										}}
									>
										<Text style={{ fontSize: 15, marginLeft: 5, flex: 3 }}>
											Seller Rating: &ensp;
										</Text>
										<View
											style={{
												flex: 5,
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Rating
												readonly
												startingValue={this.state.sellerRatingAverage}
												style={{
													alignSelf: "flex-start",
													backgroundColor: "transparent",
												}}
												imageSize={25}
											/>
											<Text style={{ fontSize: 15, marginLeft: 5 }}>
												(
												{property.seller.rating &&
												property.seller.rating instanceof Array
													? property.seller.rating.length
													: 0}
												)
											</Text>
										</View>
									</View>
									<Text style={{ textAlignVertical: "center", color: "gray" }}>
										<EvilIcons name="location" size={20} />
										{property.address}
									</Text>
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
										{property.carParking ? (
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
												<FontAwesome5 name="car" size={32} color="black" />
												<Text style={{ fontSize: 16, color: "#333" }}>
													Car Parking
												</Text>
											</View>
										) : undefined}
										{property.vehicle ? (
											<>
												<Modal
													isVisible={this.state.vehicleModal}
													onBackButtonPress={() => {
														this.setState({ vehicleModal: false });
													}}
													onBackdropPress={() => {
														this.setState({ vehicleModal: false });
													}}
												>
													<View
														style={{
															backgroundColor: "#fff",
															height: 250,
															borderRadius: 10,
															alignSelf: "center",
															justifyContent: "center",
														}}
													>
														<ScrollView
															horizontal={true}
															showsHorizontalScrollIndicator={false}
															scrollEventThrottle={200}
															decelerationRate="fast"
															pagingEnabled
															style={{ flex: 1 }}
														>
															{property.vehicleImages.map((item, index) => {
																if (item) {
																	return (
																		<Image
																			key={index}
																			source={{
																				uri: URL + item,
																			}}
																			style={{
																				width: Dimensions.get("window").width,
																				height: 200,
																			}}
																		/>
																	);
																}
															})}
														</ScrollView>
														<Text style={{ margin: 20 }}>
															{property.vehicleDescription}
														</Text>
													</View>
												</Modal>
												<TouchableOpacity
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
													onPress={() => this.setState({ vehicleModal: true })}
												>
													<FontAwesome5 name="car" size={32} color="black" />
													<View>
														<Text style={{ fontSize: 16, color: "#333" }}>
															Vehicle
														</Text>
														{property.vehicleImages &&
														property.vehicleImages.length > 0 ? (
															<Text
																style={{
																	fontSize: 10,
																	color: "grey",
																}}
															>
																Tap to view images
															</Text>
														) : undefined}
													</View>
												</TouchableOpacity>
											</>
										) : undefined}
										{property.meals ? (
											<>
												<Modal
													isVisible={this.state.breakfastModal}
													onBackButtonPress={() => {
														this.setState({ breakfastModal: false });
													}}
													onBackdropPress={() => {
														this.setState({ breakfastModal: false });
													}}
												>
													<View
														style={{
															backgroundColor: "#fff",
															height: 250,
															borderRadius: 10,
															alignSelf: "center",
															justifyContent: "center",
														}}
													>
														<ScrollView
															horizontal={true}
															showsHorizontalScrollIndicator={false}
															scrollEventThrottle={200}
															decelerationRate="fast"
															pagingEnabled
															style={{ flex: 1 }}
														>
															{property.breakfastImages.map((item, index) => {
																if (item) {
																	return (
																		<Image
																			key={index}
																			source={{
																				uri: URL + item,
																			}}
																			style={{
																				width: Dimensions.get("window").width,
																				height: 200,
																			}}
																		/>
																	);
																}
															})}
														</ScrollView>
														<Text style={{ margin: 20 }}>
															{property.breakfastDescription}
														</Text>
													</View>
												</Modal>
												<Modal
													isVisible={this.state.lunchModal}
													onBackButtonPress={() => {
														this.setState({ lunchModal: false });
													}}
													onBackdropPress={() => {
														this.setState({ lunchModal: false });
													}}
												>
													<View
														style={{
															backgroundColor: "#fff",
															height: 250,
															borderRadius: 10,
															alignSelf: "center",
															justifyContent: "center",
														}}
													>
														<ScrollView
															horizontal={true}
															showsHorizontalScrollIndicator={false}
															scrollEventThrottle={200}
															decelerationRate="fast"
															pagingEnabled
															style={{ flex: 1 }}
														>
															{property.lunchImages.map((item, index) => {
																if (item) {
																	return (
																		<Image
																			key={index}
																			source={{
																				uri: URL + item,
																			}}
																			style={{
																				width: Dimensions.get("window").width,
																				height: 200,
																			}}
																		/>
																	);
																}
															})}
														</ScrollView>
														<Text style={{ margin: 20 }}>
															{property.lunchDescription}
														</Text>
													</View>
												</Modal>
												<Modal
													isVisible={this.state.dinnerModal}
													onBackButtonPress={() => {
														this.setState({ dinnerModal: false });
													}}
													onBackdropPress={() => {
														this.setState({ dinnerModal: false });
													}}
												>
													<View
														style={{
															backgroundColor: "#fff",
															height: 250,
															borderRadius: 10,
															alignSelf: "center",
															justifyContent: "center",
														}}
													>
														<ScrollView
															horizontal={true}
															showsHorizontalScrollIndicator={false}
															scrollEventThrottle={200}
															decelerationRate="fast"
															pagingEnabled
															style={{ flex: 1 }}
														>
															{property.dinnerImages.map((item, index) => {
																if (item) {
																	return (
																		<Image
																			key={index}
																			source={{
																				uri: URL + item,
																			}}
																			style={{
																				width: Dimensions.get("window").width,
																				height: 200,
																			}}
																		/>
																	);
																}
															})}
														</ScrollView>
														<Text style={{ margin: 20 }}>
															{property.dinnerDescription}
														</Text>
													</View>
												</Modal>
												<TouchableOpacity
													onPress={() =>
														this.setState({ breakfastModal: true })
													}
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
													<FontAwesome5
														name="utensils"
														size={32}
														color="black"
													/>
													<View>
														<Text style={{ fontSize: 16, color: "#333" }}>
															{property.breakfastCost} PKR {"\n"}Breakfast
														</Text>
														{property.breakfastImages &&
														property.breakfastImages.length > 0 ? (
															<Text style={{ fontSize: 10, color: "grey" }}>
																Tap to view images
															</Text>
														) : undefined}
													</View>
												</TouchableOpacity>
												<TouchableOpacity
													onPress={() => this.setState({ lunchModal: true })}
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
													<FontAwesome5
														name="utensils"
														size={32}
														color="black"
													/>
													<View>
														<Text style={{ fontSize: 16, color: "#333" }}>
															{property.lunchCost} PKR {"\n"}Lunch
														</Text>
														{property.lunchImages &&
														property.lunchImages.length > 0 ? (
															<Text style={{ fontSize: 10, color: "grey" }}>
																Tap to view images
															</Text>
														) : undefined}
													</View>
												</TouchableOpacity>
												<TouchableOpacity
													onPress={() => this.setState({ dinnerModal: true })}
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
													<FontAwesome5
														name="utensils"
														size={32}
														color="black"
													/>
													<View>
														<Text style={{ fontSize: 16, color: "#333" }}>
															{property.dinnerCost} PKR {"\n"}Dinner
														</Text>
														{property.dinnerImages &&
														property.dinnerImages.length > 0 ? (
															<Text style={{ fontSize: 10, color: "grey" }}>
																Tap to view images
															</Text>
														) : undefined}
													</View>
												</TouchableOpacity>
											</>
										) : undefined}
									</View>
									<View
										style={{
											flex: 1,
											paddingHorizontal: 10,
										}}
									>
										<Text
											style={{
												fontSize: 28,
												fontWeight: "bold",
												marginBottom: 10,
											}}
										>
											Description
										</Text>
										<View style={{}}>
											<Text style={{ textAlign: "justify" }}>
												{property.description}
											</Text>
										</View>
										<Text
											style={{
												fontSize: 28,
												fontWeight: "bold",
												marginBottom: 10,
											}}
										>
											Location
										</Text>
										<MapView
											initialRegion={{
												latitude: this.state.property.latitude,
												longitude: this.state.property.longitude,
												latitudeDelta: 0.0122,
												longitudeDelta: 0.0121,
											}}
											style={{
												width: "100%",
												height: Dimensions.get("window").height / 2,
											}}
										>
											<Marker
												coordinate={{
													latitude: this.state.property.latitude,
													longitude: this.state.property.longitude,
												}}
											/>
										</MapView>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<Text
												style={{
													fontSize: 25,
													fontWeight: "bold",
													marginTop: 20,
													marginBottom: 20,
												}}
											>
												Property Rating ({property.rating.length})
											</Text>
											{this.state.userRole === "Buyer" ? (
												<TouchableOpacity
													onPress={() => this.setState({ ratingModal: true })}
												>
													<MaterialCommunityIcons
														name="plus"
														size={30}
														color={"blue"}
														style={{ padding: 20 }}
													/>
												</TouchableOpacity>
											) : undefined}
										</View>
										<View>
											{property.rating && property.rating.length > 0 ? (
												property.rating.map((item) => {
													return (
														<View
															style={{
																borderWidth: 0.9,
																borderRadius: 10,
																borderColor: "grey",
																alignItems: "flex-start",
																padding: 20,
																marginTop: 10,
															}}
														>
															<AirbnbRating
																readonly
																defaultRating={item.rating}
																showRating={false}
																size={20}
															/>
															<Text>{item.ratingText}</Text>
														</View>
													);
												})
											) : (
												<Text style={{ textAlign: "justify" }}>
													There is no rating for the current property yet
												</Text>
											)}
										</View>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<Text
												style={{
													fontSize: 25,
													fontWeight: "bold",
													marginTop: 20,
													marginBottom: 20,
												}}
											>
												Seller Rating ({property.seller.rating.length})
											</Text>
											{this.state.userRole === "Buyer" ? (
												<TouchableOpacity
													onPress={() =>
														this.setState({ sellerRatingModal: true })
													}
												>
													<MaterialCommunityIcons
														name="plus"
														size={30}
														color={"blue"}
														style={{ padding: 20 }}
													/>
												</TouchableOpacity>
											) : undefined}
										</View>
										<View>
											{property.seller.rating &&
											property.seller.rating.length > 0 ? (
												property.seller.rating.map((item) => {
													return (
														<View
															style={{
																borderWidth: 0.9,
																borderRadius: 10,
																borderColor: "grey",
																alignItems: "flex-start",
																padding: 20,
																marginTop: 10,
															}}
														>
															<AirbnbRating
																readonly
																defaultRating={item.rating}
																showRating={false}
																size={20}
															/>
															<Text>{item.ratingText}</Text>
														</View>
													);
												})
											) : (
												<Text style={{ textAlign: "justify" }}>
													There is no rating for the current seller yet
												</Text>
											)}
										</View>
										<Modal
											isVisible={this.state.ratingModal}
											onBackButtonPress={() => {
												this.setState({ ratingModal: false });
											}}
											onBackdropPress={() => {
												this.setState({ ratingModal: false });
											}}
										>
											<View
												style={{
													backgroundColor: "#fff",
													width: "100%",
													padding: 20,
													borderRadius: 10,
													alignSelf: "center",
												}}
											>
												<Text
													style={{
														fontSize: 16,
														marginTop: 5,
														marginBottom: 10,
													}}
												>
													Rating:
												</Text>
												<Rating
													onFinishRating={(rating) => {
														this.setState({ propertyRating: rating });
													}}
													style={{
														alignSelf: "flex-start",
														backgroundColor: "transparent",
													}}
													imageSize={25}
												/>
												<Input
													placeholder="Enter your review"
													rounded
													style={{
														width: "100%",
														alignSelf: "center",
														marginTop: 10,
													}}
													value={this.state.ratingText}
													onChangeText={(ratingText) =>
														this.setState({ ratingText })
													}
												/>
												<Button
													style={{
														padding: 10,
														borderRadius: 20,
														backgroundColor: "#0652DD",
														marginBottom: 10,
														width: "100%",
													}}
													labelStyle={{
														fontSize: 18,
														fontWeight: "bold",
													}}
													mode="contained"
													onPress={() => this.handleRatings()}
												>
													Submit
												</Button>
											</View>
										</Modal>
										<Modal
											isVisible={this.state.sellerRatingModal}
											onBackButtonPress={() => {
												this.setState({ sellerRatingModal: false });
											}}
											onBackdropPress={() => {
												this.setState({ sellerRatingModal: false });
											}}
										>
											<View
												style={{
													backgroundColor: "#fff",
													width: "100%",
													padding: 20,
													borderRadius: 10,
													alignSelf: "center",
												}}
											>
												<Text
													style={{
														fontSize: 16,
														marginTop: 5,
														marginBottom: 10,
													}}
												>
													Rating:
												</Text>
												<Rating
													onFinishRating={(rating) => {
														this.setState({ sellerRating: rating });
													}}
													style={{
														alignSelf: "flex-start",
														backgroundColor: "transparent",
													}}
													imageSize={25}
												/>
												<Input
													placeholder="Enter your review about the seller"
													rounded
													style={{
														width: "100%",
														alignSelf: "center",
														marginTop: 10,
													}}
													value={this.state.sellerRatingText}
													onChangeText={(sellerRatingText) =>
														this.setState({ sellerRatingText })
													}
												/>
												<Button
													style={{
														padding: 10,
														borderRadius: 20,
														backgroundColor: "#0652DD",
														marginBottom: 10,
														width: "100%",
													}}
													labelStyle={{
														fontSize: 18,
														fontWeight: "bold",
													}}
													mode="contained"
													onPress={() => this.handleSellerRating()}
												>
													Submit
												</Button>
											</View>
										</Modal>
									</View>
									{this.state.userRole === "Seller" ? undefined : (
										<Button
											style={{
												padding: 10,
												borderRadius: 20,
												backgroundColor: "#0652DD",
												marginBottom: 10,
												marginTop: 10,
												alignSelf: "center",
											}}
											contentStyle={{}}
											labelStyle={{ fontSize: 18, fontWeight: "bold" }}
											mode="contained"
											// onPress={() => this.setState({ modalVisible: true })}
											onPress={() =>
												this.props.navigation.navigate("RentNow", {
													id: property._id,
												})
											}
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
