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

export default class SellerView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			properties: [],
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
						isLoading: false,
						refreshing: false,
					});
				} else {
					this.setState({
						properties: [],
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
		this.fetchProperties();
	}
	render() {
		const { properties, isLoading } = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.mainHeader}>
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
												uri: URL + item._id + ".jpg",
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
										</View>
									</TouchableOpacity>
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
