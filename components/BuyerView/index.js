import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	useWindowDimensions,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import constants from "expo-constants";
import { Button, ActivityIndicator, Switch } from "react-native-paper";
import { URL, getDistance } from "../../Helpers/helper";
import Axios from "axios";
import { RefreshControl } from "react-native";
import { SearchBar } from "react-native-elements";
import Modal from "react-native-modal";
import { Button as MyButton } from "galio-framework";

import * as Location from "expo-location";
import NumericInput from "react-native-numeric-input";

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			properties: [],
			backupProperties: [],
			lowerLimit: 0,
			upperLimit: 0,
			bedroomsNo: 0,
			carParking: false,
			meals: false,
			vehicle: false,
		};
	}

	fetchCurrentLocation = async () => {
		// let { status } = await Location.requestPermissionsAsync();
		// if (status !== "granted") {
		// 	this.setState({ error: "Permission to access location was denied" });
		// }
		// let location = await Location.getCurrentPositionAsync({});
		// return location;
	};

	filterContent = () => {
		const {
			lowerLimit,
			upperLimit,
			bedroomsNo,
			carParking,
			meals,
			vehicle,
		} = this.state;

		let properties = this.state.backupProperties;

		let newProperties = [];
		let query = false;
		if (lowerLimit || upperLimit) {
			query = true;
			if (lowerLimit && upperLimit) {
				properties.map((item) => {
					if (item.rent <= upperLimit && item.rent >= lowerLimit) {
						newProperties.push(item);
					}
				});
			} else if (lowerLimit && !upperLimit) {
				properties.map((item) => {
					if (item.rent >= lowerLimit) {
						newProperties.push(item);
					}
				});
			} else if (!lowerLimit && upperLimit) {
				properties.map((item) => {
					if (item.rent <= upperLimit) {
						newProperties.push(item);
					}
				});
			}
		}
		// if (bedroomsNo) {
		// 	query = true;
		// 	if (newProperties.length > 0) {
		// 		newProperties.map((item) => {
		// 			if (item.bedroom == bedroomsNo) {
		// 				newProperties.push(item);
		// 			}
		// 		});
		// 	} else {
		// 		properties.map((item) => {
		// 			if (item.bedroom === bedroomsNo) {
		// 				newProperties.push(item);
		// 			}
		// 		});
		// 	}
		// }
		// if (carParking) {
		// 	query = true;
		// 	if (newProperties.length > 0) {
		// 		newProperties.map((item) => {
		// 			if (item.carParking) {
		// 				newProperties.push(item);
		// 			}
		// 		});
		// 	} else {
		// 		properties.map((item) => {
		// 			if (item.carParking) {
		// 				newProperties.push(item);
		// 			}
		// 		});
		// 	}
		// }
		// if (vehicle) {
		// 	query = true;
		// 	if (newProperties.length > 0) {
		// 		newProperties.map((item) => {
		// 			if (item.vehicle) {
		// 				newProperties.push(item);
		// 			}
		// 		});
		// 	} else {
		// 		properties.map((item) => {
		// 			if (item.vehicle) {
		// 				newProperties.push(item);
		// 			}
		// 		});
		// 	}
		// }
		// if (meals) {
		// 	query = true;
		// 	if (newProperties.length > 0) {
		// 		newProperties.map((item) => {
		// 			if (item.meals) {
		// 				newProperties.push(item);
		// 			}
		// 		});
		// 	} else {
		// 		properties.map((item) => {
		// 			if (item.meals) {
		// 				newProperties.push(item);
		// 			}
		// 		});
		// 	}
		// }
		// let finalProperties = [];
		// newProperties.map((prevItem) => {
		// 	if (finalProperties.length > 0) {
		// 		finalProperties.map((newItem) => {
		// 			if (newItem) {
		// 				console.log("*************");
		// 				console.log(prevItem._id);
		// 				console.log(newItem._id);
		// 				console.log("*************");
		// 				if (prevItem._id != newItem._id) {
		// 					finalProperties.push(newItem);
		// 				}
		// 			}
		// 		});
		// 	} else {
		// 		finalProperties.push(prevItem);
		// 	}
		// });
		this.setState({
			properties: query ? newProperties : properties,
			filterModal: false,
		});
	};
	fetchProperties = async () => {
		this.setState({ refreshing: true });
		Axios({
			url: URL + "property",
			method: "GET",
		})
			.then((response) => {
				if (response && response.data && response.data.success) {
					let properties = response.data.message;
					console.log("**********");
					console.log(properties);
					console.log("**********");
					// let userLat = this.state.userCurrentLocation.coords.latitude;
					// let userLong = this.state.userCurrentLocation.coords.longitude;
					// let newProperties = [];
					// properties.map((item) => {
					// 	let propLat = item.latitude;
					// 	let propLong = item.longitude;
					// 	let distance = getDistance(
					// 		{ longitude: propLong, latitude: propLat },
					// 		{ longitude: userLong, latitude: userLat },
					// 		50
					// 	);
					// 	if (distance) {
					// 		newProperties.push(item);
					// 	}
					// });
					this.setState({
						properties: properties,
						backupProperties: properties,
						isLoading: false,
						refreshing: false,
					});
				} else {
					this.setState({
						properties: [],
						backupProperties: [],
						isLoading: false,
						refreshing: false,
					});
				}
			})
			.catch((error) => {
				this.setState({
					isLoading: false,
					errorText:
						"There was some problem fetching properties for you, try again later",
					refreshing: false,
				});
			});
	};
	async componentDidMount() {
		// let location = await this.fetchCurrentLocation();
		// this.setState({ userCurrentLocation: location });
		this.fetchProperties();
	}

	handleSearch = (searchedText = "") => {
		let filteredVideos = [];
		if (this.state.backupProperties.length == 0) return filteredVideos;
		filteredVideos = this.state.backupProperties;
		if (searchedText) {
			filteredVideos = this.state.backupProperties.filter((item) => {
				const itemData = `${item.name.toUpperCase()} ${item.address.toUpperCase()}`;
				const textData = searchedText.toUpperCase();
				return itemData.indexOf(textData) > -1;
			});
		}
		this.setState({ properties: filteredVideos });
	};

	render() {
		const { properties, isLoading } = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.mainHeader}>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.openDrawer();
						}}
					>
						<MaterialCommunityIcons
							name="menu"
							size={32}
							style={{ marginRight: 20 }}
						/>
					</TouchableOpacity>
					<Text style={styles.mainText}>Home</Text>
					<TouchableOpacity
						style={{ alignSelf: "flex-end" }}
						onPress={() => {
							this.setState({
								properties: this.state.backupProperties,
								filterModal: true,
							});
						}}
					>
						<MaterialCommunityIcons name="filter" size={32} />
					</TouchableOpacity>
				</View>
				{isLoading ? (
					<ActivityIndicator />
				) : (
					<>
						<SearchBar
							placeholder="Search by name or location"
							clearIcon
							round
							lightTheme
							containerStyle={{
								backgroundColor: "transparent",
								borderWidth: 0,
								height: 50,
							}}
							inputContainerStyle={{
								backgroundColor: "transparent",
								borderWidth: 0,
								height: 50,
							}}
							value={this.state.searchQuery}
							onChangeText={(text) => {
								this.setState({ searchQuery: text });
								this.handleSearch(text);
							}}
						/>
						<Text
							style={{
								fontSize: 16,
								color: "gray",
								marginLeft: 20,
								marginTop: 10,
							}}
						>
							{this.state.properties.length} nearby apartments found in your
							area
						</Text>
						<ScrollView
							refreshControl={
								<RefreshControl
									onRefresh={() => this.fetchProperties()}
									refreshing={this.state.refreshing}
								/>
							}
						>
							{properties.map((item) => {
								return (
									<View style={styles.outerContainer}>
										<Image
											source={{
												uri: URL + item.images[0],
											}}
											style={{
												width: "100%",
												height: 150,
												borderTopLeftRadius: 10,
												borderTopRightRadius: 10,
											}}
										/>
										<View style={styles.mainCard}>
											<View style={styles.mainCardImage}>
												<View style={styles.mainCardText}>
													<View>
														<Text style={{ fontSize: 22, fontWeight: "bold" }}>
															{item.name}
														</Text>
														<Text
															style={{
																fontSize: 16,
																color: "gray",
																marginTop: 5,
															}}
														>
															{item.address}
														</Text>
													</View>
												</View>
												<View
													style={{
														flexDirection: "row",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<Text>
														<Text
															style={{
																fontSize: 25,
																color: "#0652DD",
																fontWeight: "bold",
															}}
														>
															{item.rent}
														</Text>
														<Text> PKR</Text>
													</Text>
													<TouchableOpacity
														onPress={() =>
															this.props.navigation.push("Details", {
																id: item._id,
															})
														}
													>
														<Text style={{ color: "blue", padding: 10 }}>
															Show Details
														</Text>
													</TouchableOpacity>
												</View>
											</View>
										</View>
									</View>
								);
							})}
						</ScrollView>
						<Modal
							isVisible={this.state.filterModal}
							onBackButtonPress={() => {
								this.setState({ filterModal: false });
							}}
							onBackdropPress={() => {
								this.setState({ filterModal: false });
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
										margin: 10,
										fontSize: 20,
										fontWeight: "bold",
										textAlign: "center",
									}}
								>
									Filter Properties
								</Text>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<View>
										<Text
											style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
										>
											Lower Price Limit
										</Text>
										<NumericInput
											initValue={this.state.lowerLimit}
											value={this.state.lowerLimit}
											onChange={(lowerLimit) => this.setState({ lowerLimit })}
											step={500}
										/>
									</View>
									<View>
										<Text
											style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
										>
											Upper Price Limit
										</Text>
										<NumericInput
											step={500}
											initValue={this.state.upperLimit}
											value={this.state.upperLimit}
											onChange={(upperLimit) => this.setState({ upperLimit })}
										/>
									</View>
								</View>
								{/* <Text
									style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
								>
									Number of Bedrooms
								</Text>
								<NumericInput
									initValue={this.state.bedroomsNo}
									value={this.state.bedroomsNo}
									onChange={(bedroomsNo) => this.setState({ bedroomsNo })}
								/>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										marginTop: 10,
									}}
								>
									<Text
										style={{
											paddingTop: 10,
											paddingBottom: 5,
											fontSize: 15,
											flex: 3,
										}}
									>
										Car Parking
									</Text>
									<Switch
										value={this.state.carParking}
										style={{ marginLeft: 10, flex: 5 }}
										onValueChange={(check) => {
											this.setState({ carParking: check });
										}}
									/>
								</View>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										marginTop: 10,
									}}
								>
									<Text
										style={{
											paddingTop: 10,
											paddingBottom: 5,
											fontSize: 15,
											flex: 3,
										}}
									>
										Meals
									</Text>
									<Switch
										value={this.state.meals}
										style={{ marginLeft: 10, flex: 5 }}
										onValueChange={(check) => {
											this.setState({ meals: check });
										}}
									/>
								</View>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										marginTop: 10,
									}}
								>
									<Text
										style={{
											paddingTop: 10,
											paddingBottom: 5,
											fontSize: 15,
											flex: 3,
										}}
									>
										Vehicle
									</Text>
									<Switch
										value={this.state.vehicle}
										style={{ marginLeft: 10, flex: 5 }}
										onValueChange={(check) => {
											this.setState({ vehicle: check });
										}}
									/>
								</View> */}
								<MyButton
									color="info"
									loading={this.state.loading}
									onPress={() => this.filterContent()}
									style={{ width: "100%", marginTop: 20 }}
								>
									Filter
								</MyButton>
							</View>
						</Modal>
					</>
				)}
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
		alignItems: "center",
		padding: 20,
		justifyContent: "space-between",
	},
	mainIcons: {
		width: "30%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	mainCard: {
		padding: 15,
	},
	outerContainer: {
		elevation: 7,
		borderRadius: 10,
		margin: 20,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.7,
	},
	mainCardImage: {
		// borderBottomColor: "#333",
	},
	mainCardText: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
