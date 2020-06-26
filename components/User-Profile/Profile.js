import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	AsyncStorage,
	TouchableOpacity,
	RefreshControl,
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
import Axios from "axios";
import { URL } from "../../Helpers/helper";
import Modal from "react-native-modal";
import { Input } from "galio-framework";

export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			wishList: [],
			user: "",
			profile: "",
		};
	}

	fetchUser = () => {
		Axios({
			method: "GET",
			url: URL + "users/" + this.state.profile._id,
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						console.log("******");
						console.log(response.data);
						console.log("******");
						this.setState({
							user: response.data.message,
							fetchingUser: false,
						});
					} else {
						this.setState({
							user: this.state.profile,
							fetchingUser: false,
						});
					}
				}
			})
			.catch((error) => {
				this.setState({ wishList: [], isLoading: false, refreshing: false });
			});
	};

	fetchWishList = async () => {
		this.setState({ refreshing: true });
		let profile = await AsyncStorage.getItem("currentUser");
		if (profile) {
			profile = JSON.parse(profile);
			this.setState({ profile, isLoading: false });
			Axios({
				method: "GET",
				url: URL + "users/wishlist/" + profile._id,
			})
				.then((response) => {
					if (response && response.data) {
						if (response.data.success) {
							this.setState({
								wishList: response.data.message,
								isLoading: false,
								refreshing: false,
							});
						} else {
							this.setState({
								wishList: [],
								isLoading: false,
								refreshing: false,
							});
						}
					}
				})
				.catch((error) => {
					this.setState({ wishList: [], isLoading: false, refreshing: false });
				});
		}
	};

	async componentDidMount() {
		this.fetchWishList();
		this.fetchUser();
	}

	handleSubmit = () => {
		Axios({
			method: "PUT",
			url: URL + "users/" + this.state.profile._id,
			data: {
				name: this.state.user.name,
				phone_number: this.state.user.phone_number,
				email: this.state.user.email,
			},
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						AsyncStorage.setItem(
							"currentUser",
							JSON.stringify(response.data.message)
						);
						this.setState({
							profile: response.data.message,
							editProfileModal: false,
							editingUser: false,
						});
					} else {
						this.setState({
							editingUser: false,
							editProfileModal: false,
						});
					}
				}
			})
			.catch((error) => {
				this.setState({
					editingUser: false,
					editProfileModal: false,
				});
			});
	};

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
								<Button
									mode="contained"
									uppercase={true}
									onPress={() => {
										this.setState({ editProfileModal: true });
									}}
									style={{
										borderRadius: 5,
										marginTop: 10,
									}}
								>
									Edit
								</Button>
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
						<ScrollView
							refreshControl={
								<RefreshControl
									refreshing={this.state.refreshing}
									onRefresh={() => this.fetchWishList()}
								/>
							}
						>
							{this.state.isLoading ? (
								<ActivityIndicator />
							) : this.state.wishList.length > 0 ? (
								this.state.wishList.map((item) => {
									return (
										<TouchableOpacity
											style={styles.outerContainer}
											onPress={() =>
												this.props.navigation.navigate("Details", {
													id: item._id,
												})
											}
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
															<Text
																style={{ fontSize: 22, fontWeight: "bold" }}
															>
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
												</View>
											</View>
										</TouchableOpacity>
									);
								})
							) : (
								<Text>There are no items in your wishlist</Text>
							)}
						</ScrollView>
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
				<Modal
					isVisible={this.state.editProfileModal}
					onBackButtonPress={() => {
						this.setState({ editProfileModal: false });
					}}
					onBackdropPress={() => {
						this.setState({ editProfileModal: false });
					}}
				>
					{this.state.fetchingUser ? (
						<ActivityIndicator />
					) : (
						<View
							style={{
								backgroundColor: "#fff",
								width: "90%",
								padding: 10,
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
								Edit User
							</Text>
							<Input
								placeholder="Enter your Name"
								right
								icon="user"
								family="Entypo"
								rounded
								value={this.state.user.name}
								style={{ width: "90%", alignSelf: "center" }}
								iconSize={16}
								iconColor="grey"
								onChangeText={(name) =>
									this.setState((prevState) => ({
										...prevState,
										user: {
											...prevState.user,
											name: name,
										},
									}))
								}
							/>
							<Input
								type="email-address"
								placeholder="Enter your email-address"
								right
								icon="email"
								family="Entypo"
								rounded
								value={this.state.user.email}
								style={{ width: "90%", alignSelf: "center" }}
								iconSize={16}
								iconColor="grey"
								onChangeText={(email) =>
									this.setState((prevState) => ({
										...prevState,
										user: {
											...prevState.user,
											email: email,
										},
									}))
								}
							/>
							<Input
								type="numeric"
								placeholder="Enter your phone number"
								right
								value={this.state.user.phone_number}
								icon="phone"
								family="Entypo"
								rounded
								style={{ width: "90%", alignSelf: "center" }}
								iconSize={16}
								iconColor="grey"
								onChangeText={(phone_number) =>
									this.setState((prevState) => ({
										...prevState,
										user: {
											...prevState.user,
											phone_number: phone_number,
										},
									}))
								}
							/>
							<Button
								mode="contained"
								uppercase={true}
								onPress={() => {
									this.handleSubmit();
								}}
								style={{
									borderRadius: 20,
									marginTop: 10,
									marginBottom: 10,
									width: "90%",
									alignSelf: "center",
								}}
							>
								Submit
							</Button>
						</View>
					)}
				</Modal>
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
