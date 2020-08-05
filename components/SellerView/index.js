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
	AsyncStorage,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import constants from "expo-constants";
import { Button, ActivityIndicator, FAB } from "react-native-paper";
import { URL } from "../../Helpers/helper";
import Axios from "axios";
import { RefreshControl } from "react-native";
import { SearchBar } from "react-native-elements";

export default class SellerView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			properties: [],
			backupProperties: [],
			isLoading: true,
		};
	}
	fetchProperties = async () => {
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let id = currentUser._id;
		this.setState({ refreshing: true });
		Axios({
			url: URL + "property/seller/" + id,
			method: "GET",
		})
			.then((response) => {
				if (response && response.data && response.data.success) {
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

	async componentDidMount() {
		this.fetchProperties();
	}
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
					<Text style={styles.mainText}>Your properties</Text>
					<View style={styles.mainIcons}>
						{/* <Ionicons name="ios-search" size={32} color="gray" />
						<MaterialCommunityIcons
							name="filter-outline"
							size={32}
							color="gray"
						/> */}
					</View>
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
								height: 50,
								borderWidth: 0,
							}}
							value={this.state.searchQuery}
							onChangeText={(text) => {
								this.setState({ searchQuery: text });
								this.handleSearch(text);
							}}
						/>
						<Text style={{ fontSize: 16, color: "gray", marginLeft: 20 }}>
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
										</View>
									</View>
								);
							})}
						</ScrollView>
					</>
				)}

				{/* <View style={{ flex: 1, marginHorizontal: 20, marginTop: 40 }}>
					<Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
						Populer
					</Text>
					<ScrollView
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
					</ScrollView>
				</View> */}
				<FAB
					style={styles.fab}
					icon="plus"
					onPress={() => this.props.navigation.navigate("AddApartment")}
				/>
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
		justifyContent: "space-between",
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
	fab: {
		position: "absolute",
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: "#0652DD",
	},
});
