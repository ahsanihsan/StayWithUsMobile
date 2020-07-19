import React, { Component } from "react";
import { Text, View, AsyncStorage, RefreshControl, Alert } from "react-native";
import Header from "../../ReuseableComponents/Header";
import Axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import { URL, sendNotification } from "../../Helpers/helper";
import { Button } from "galio-framework";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import { Rating, AirbnbRating } from "react-native-elements";
import { Input } from "galio-framework";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";

export default class BookingDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			bookings: [],
		};
	}

	async componentDidMount() {
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let userRole = currentUser.userType;
		let userId = currentUser._id;
		this.setState({ userRole, userId });
		this.fetch();
	}

	fetch = () => {
		this.setState({ refreshing: true });
		if (this.state.userRole === "Seller") {
			Axios({
				url: URL + "property/booking/" + this.state.userId,
				method: "GET",
			})
				.then((response) => {
					if (response && response.data) {
						if (response.data.success) {
							this.setState({
								bookings: response.data.message,
								isLoading: false,
								refreshing: false,
							});
						} else {
							this.setState({
								bookings: null,
								isLoading: false,
								refreshing: false,
							});
						}
					}
				})
				.catch((error) => {
					console.log(error);
					this.setState({
						property: null,
						isLoading: false,
						refreshing: false,
					});
				});
		} else {
			Axios({
				url: URL + "property/booking/buyer/" + this.state.userId,
				method: "GET",
			})
				.then((response) => {
					if (response && response.data) {
						if (response.data.success) {
							this.setState({
								bookings: response.data.message,
								isLoading: false,
								refreshing: false,
							});
						} else {
							this.setState({
								bookings: null,
								isLoading: false,
								refreshing: false,
							});
						}
					}
				})
				.catch((error) => {
					this.setState({
						property: null,
						isLoading: false,
						refreshing: false,
					});
				});
		}
	};

	handleApprove = (id, propertyName, token) => {
		this.setState({ gettingRequest: true });
		Axios({
			url: URL + "property/booking/change/" + id,
			method: "POST",
			data: {
				change: "approved",
			},
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						sendNotification(
							"Booking Approved",
							"Booking request for " +
								propertyName +
								" has been approved by the buyer, please visit the approved bookings screen.",
							token
						);
						Alert.alert("Success", response.data.message);
						this.setState({ gettingRequest: false });
					} else {
						Alert.alert("Error", response.data.message);
						this.setState({ gettingRequest: false });
					}
				}
				this.fetch();
			})
			.catch((error) => {
				this.setState({
					property: null,
					isLoading: false,
					refreshing: false,
					gettingRequest: false,
				});
			});
	};

	handleDecline = (id, propertyName, token, cat = "Buyer") => {
		Axios({
			url: URL + "property/booking/change/" + id,
			method: "POST",
			data: {
				change: "declined",
			},
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						sendNotification(
							"Booking Cancelled",
							"Booking request for " +
								propertyName +
								" has been cancelled by the " +
								cat,
							token
						);
						Alert.alert("Success", response.data.message);
						this.setState({ gettingRequest: false });
					} else {
						Alert.alert("Error", response.data.message);
						this.setState({ gettingRequest: false });
					}
				}
				this.fetch();
			})
			.catch((error) => {
				this.setState({
					property: null,
					isLoading: false,
					refreshing: false,
					gettingRequest: false,
				});
			});
	};

	handleSellerRating = async (id, sellerID) => {
		Axios({
			method: "POST",
			url: URL + "users/rate/" + id,
			data: {
				user: sellerID,
				rating: this.state.sellerRating,
				ratingText: this.state.ratingText,
			},
		})
			.then((response) => {
				this.fetch();
				this.setState({ ratingModal: false });
			})
			.catch((error) => {
				console.log("********");
				console.log(error);
				console.log("********");
			});
	};
	getSellerRating = (rating) => {
		console.log(rating);
		if (rating && rating instanceof Array && rating.length > 0) {
			let averageRating = 0;
			rating.map((item) => {
				if (item && item.rating) averageRating = averageRating + item.rating;
			});
			averageRating = averageRating / rating.length;

			return averageRating;
		} else {
			return 0;
		}
	};

	render() {
		return (
			<View>
				<Header
					title="Booking Requests"
					isBack
					navigation={this.props.navigation}
				/>
				<ScrollView
					style={{ marginTop: 20, height: "100%" }}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={() => this.fetch()}
						/>
					}
				>
					<View style={{ marginBottom: "35%" }}>
						{this.state.isLoading ? (
							<ActivityIndicator />
						) : this.state.bookings.length > 0 ? (
							this.state.bookings.map((item) => {
								return (
									<View
										style={{
											padding: 10,
											alignSelf: "center",
											width: "90%",
											backgroundColor: "#fff",
											shadowColor: "grey",
											shadowOffset: { width: 0, height: 0 },
											shadowOpacity: 1,
											margin: 10,
											borderRadius: 10,
										}}
									>
										<Text style={{ fontSize: 20, fontWeight: "bold" }}>
											{item.checkInDate} - {item.checkOutDate}
										</Text>
										<Text style={{ fontSize: 15, marginTop: 6 }}>
											Rent: {item.rentCost}
										</Text>
										<Text style={{ fontSize: 15, marginTop: 6 }}>
											Breakfast: {item.breakfastCost}
										</Text>
										<Text style={{ fontSize: 15, marginTop: 6 }}>
											Lunch: {item.lunchCost}
										</Text>
										<Text style={{ fontSize: 15, marginTop: 6 }}>
											Dinner: {item.dinnerCost}
										</Text>
										<Text style={{ fontSize: 15, marginTop: 6 }}>
											Vehicle: {item.vehicleCost}
										</Text>
										<View
											style={{
												flexDirection: "row",
												// justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Text style={{ fontSize: 15 }}>Buyer Rating: &ensp;</Text>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													marginLeft: 5,
												}}
											>
												<Rating
													readonly
													startingValue={this.getSellerRating(
														item.buyer.rating
													)}
													style={{
														alignSelf: "flex-start",
														backgroundColor: "transparent",
													}}
													imageSize={25}
												/>
												<Text style={{ fontSize: 15, marginLeft: 5 }}>
													(
													{item.buyer.rating &&
													item.buyer.rating instanceof Array
														? item.buyer.rating.length
														: 0}
													)
												</Text>
											</View>
										</View>
										<Text
											style={{
												fontSize: 15,
												marginTop: 6,
												fontWeight: "bold",
												textAlign: "right",
											}}
										>
											Total Rent:{" "}
											{item.vehicleCost +
												item.dinnerCost +
												item.lunchCost +
												item.rentCost +
												item.breakfastCost}
										</Text>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
												marginTop: 10,
											}}
										>
											{this.state.gettingRequest ? (
												<ActivityIndicator />
											) : (
												<>
													{this.state.userRole === "Buyer" ? (
														<Button
															loading={this.state.gettingRequest}
															style={{ width: "100%" }}
															color="error"
															onPress={() => {
																let createdAt = moment(item.createdAt).add(
																	1,
																	"day"
																);
																let currentTime = moment();
																if (currentTime < createdAt) {
																	Alert.alert(
																		"Confirmation",
																		"Are you sure you want to cancel your order?",
																		[
																			{ text: "No" },
																			{
																				text: "Yes",
																				onPress: () => {
																					this.handleDecline(
																						item._id,
																						item.property.name,
																						item.seller.pushNotificationToken
																					);
																				},
																			},
																		]
																	);
																} else {
																	Alert.alert(
																		"You cannot cancel this request, because 24 hours have passed."
																	);
																}
															}}
														>
															Cancel Order
														</Button>
													) : (
														<>
															<Button
																loading={this.state.gettingRequest}
																style={{ width: "30%" }}
																color="error"
																onPress={() => {
																	Alert.alert(
																		"Confirmation",
																		"Are you sure you want to cancel your order?",
																		[
																			{ text: "No" },
																			{
																				text: "Yes",
																				onPress: () => {
																					let createdAt = moment(
																						item.createdAt
																					).add(1, "day");
																					let currentTime = moment();
																					if (currentTime < createdAt) {
																						this.handleDecline(
																							item._id,
																							item.property.name,
																							item.seller.pushNotificationToken,
																							"Seller"
																						);
																					} else {
																						Alert.alert(
																							"You cannot cancel this request, because 24 hours have passed."
																						);
																					}
																				},
																			},
																		]
																	);
																}}
															>
																Decline
															</Button>
															<Button
																loading={this.state.gettingRequest}
																style={{ width: "30%" }}
																color="success"
																onPress={() => {
																	Alert.alert(
																		"Confirmation",
																		"Are you sure you want to approve this order?",
																		[
																			{ text: "No" },
																			{
																				text: "Yes",
																				onPress: () => {
																					console.log(item);
																					this.handleApprove(
																						item._id,
																						item.property.name,
																						item.buyer.pushNotificationToken
																					);
																				},
																			},
																		]
																	);
																}}
															>
																Approve
															</Button>
															<Button
																loading={this.state.gettingRequest}
																style={{ width: "33%" }}
																color="info"
																onPress={() => {
																	this.setState({ buyerRating: true });
																}}
															>
																Buyer Rating
															</Button>

															<Modal
																isVisible={this.state.buyerRating}
																onBackButtonPress={() => {
																	this.setState({ buyerRating: false });
																}}
																onBackdropPress={() => {
																	this.setState({ buyerRating: false });
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
																	{this.state.ratingModal ? (
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
																					this.setState({
																						sellerRating: rating,
																					});
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
																				onPress={() =>
																					this.handleSellerRating(
																						item.buyer._id,
																						item.seller._id
																					)
																				}
																			>
																				Submit
																			</Button>
																		</View>
																	) : (
																		<>
																			<View
																				style={{
																					flexDirection: "row",
																					justifyContent: "space-between",
																					alignItems: "center",
																				}}
																			>
																				<Text
																					style={{
																						fontSize: 20,
																						fontWeight: "bold",
																						marginTop: 20,
																						marginBottom: 20,
																					}}
																				>
																					Buyer Rating (
																					{item.buyer.rating.length})
																				</Text>
																				{this.state.userRole === "Seller" ? (
																					<TouchableOpacity
																						onPress={() =>
																							this.setState({
																								ratingModal: true,
																							})
																						}
																					>
																						<Icon
																							name="plus"
																							size={20}
																							color={"blue"}
																							style={{ padding: 20 }}
																						/>
																					</TouchableOpacity>
																				) : undefined}
																			</View>
																			<ScrollView>
																				{item.buyer.rating &&
																				item.buyer.rating.length > 0 ? (
																					item.buyer.rating.map((myItem) => {
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
																									defaultRating={myItem.rating}
																									showRating={false}
																									size={20}
																								/>
																								<Text>{myItem.ratingText}</Text>
																							</View>
																						);
																					})
																				) : (
																					<Text
																						style={{ textAlign: "justify" }}
																					>
																						There is no rating for the current
																						seller yet
																					</Text>
																				)}
																			</ScrollView>
																		</>
																	)}
																</View>
															</Modal>
															{/* <Modal
																isVisible={this.state.ratingModal}
																onBackButtonPress={() => {
																	this.setState({ ratingModal: false });
																}}
																onBackdropPress={() => {
																	this.setState({ ratingModal: false });
																}}
															> */}

															{/* </Modal> */}
														</>
													)}
												</>
											)}
										</View>
									</View>
								);
							})
						) : (
							<Text style={{ textAlign: "center", fontSize: 18 }}>
								No booking requests received so far.
							</Text>
						)}
					</View>
				</ScrollView>
			</View>
		);
	}
}
