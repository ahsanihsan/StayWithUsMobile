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
import { Button, ActivityIndicator } from "react-native-paper";
import { URL, getDistance } from "../../Helpers/helper";
import Axios from "axios";
import { RefreshControl } from "react-native";
import { SearchBar } from "react-native-elements";

import * as Location from "expo-location";

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			properties: [],
			backupProperties: [],
		};
	}

	fetchCurrentLocation = async () => {
		let { status } = await Location.requestPermissionsAsync();
		if (status !== "granted") {
			this.setState({ error: "Permission to access location was denied" });
		}

		let location = await Location.getCurrentPositionAsync({});
		return location;
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
					let userLat = this.state.userCurrentLocation.coords.latitude;
					let userLong = this.state.userCurrentLocation.coords.longitude;
					let newProperties = [];
					console.log("******");
					console.log(properties);
					console.log("******");
					properties.map((item) => {
						let propLat = item.latitude;
						let propLong = item.longitude;
						let distance = getDistance(
							{ longitude: propLong, latitude: propLat },
							{ longitude: userLong, latitude: userLat },
							10
						);
						if (distance) {
							newProperties.push(item);
						}
					});
					this.setState({
						properties: response.data.message,
						backupProperties: response.data.message,
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
		let location = await this.fetchCurrentLocation();
		this.setState({ userCurrentLocation: location });
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
					<Text style={styles.mainText}>Find your house</Text>
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
							}}
							inputContainerStyle={{
								backgroundColor: "transparent",
								borderWidth: 0,
							}}
							value={this.state.searchQuery}
							onChangeText={(text) => {
								this.setState({ searchQuery: text });
								this.handleSearch(text);
							}}
						/>
						<Text style={{ fontSize: 16, color: "gray", marginLeft: 20 }}>
							{this.state.properties.length} results in your area, pull to
							refresh the properties
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
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.push("Details", { id: item._id })
										}
										style={styles.outerContainer}
									>
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
											</View>
										</View>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
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
