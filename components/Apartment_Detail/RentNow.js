import React, { Component } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	AsyncStorage,
	Alert,
	Picker,
	KeyboardAvoidingView,
} from "react-native";
import { ActivityIndicator, Switch } from "react-native-paper";
import Header from "../../ReuseableComponents/Header";
import { URL, sendNotification } from "../../Helpers/helper";
import Axios from "axios";
import Modal from "react-native-modal";
import { Button } from "galio-framework";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

import { CreditCardInput } from "react-native-credit-card-input";

export default class RentNow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checkInDate: new Date(),
			checkOutDate: new Date(),
			vehicle: false,
			dinner: false,
			lunch: false,
			breakfast: false,
			dateTextCheckIn: "",
			dateTextCheckOut: "",
			paymentMethod: "cash",
			isLoading: true,
		};
	}

	handleSubmit = () => {
		let checkIn = this.state.dateTextCheckIn;
		let checkOut = this.state.dateTextCheckOut;
		var a = moment(checkIn);
		var b = moment(checkOut);
		let totalDaysStay = b.diff(a, "days") + 1;
		totalDaysStay = totalDaysStay < 0 ? totalDaysStay * -1 : totalDaysStay;

		let totalRentProperty = this.state.property.rent / 30;
		let totalBreakfastCost = this.state.property.breakfastCost;
		let totalLunchCost = this.state.property.lunchCost;
		let totalDinnerCost = this.state.property.dinnerCost;
		let totalVehicleCost = this.state.property.vehiclePrice / 30;

		let consumedRent = totalRentProperty * totalDaysStay;
		let consumedBreakFast = this.state.breakfast
			? totalBreakfastCost * totalDaysStay
			: 0;
		let consumedLunch = this.state.lunch ? totalLunchCost * totalDaysStay : 0;
		let consumedDinner = this.state.dinner
			? totalDinnerCost * totalDaysStay
			: 0;

		let consumedVehicleCost = this.state.vehicle
			? totalVehicleCost * totalDaysStay
			: 0;
		let creditCard = "";
		if (this.state.property.securityFee) {
			if (this.state.creditCard) {
				if (this.state.creditCard.valid) {
					creditCard =
						this.state.creditCard.values.number +
						"-" +
						this.state.creditCard.values.expiry +
						"-" +
						this.state.creditCard.values.cvc;
				} else {
					Alert.alert("Please enter valid credit card details.");
					return false;
				}
			} else {
				Alert.alert("Please enter your credit card details");
				return false;
			}
		}
		if (!checkIn || !checkOut) {
			Alert.alert("Please select your check in and check out date.");
			return false;
		}
		const data = {
			checkInDate: checkIn,
			checkOutDate: checkOut,
			rentCost: consumedRent,
			vehicleCost: consumedVehicleCost,
			breakfastCost: consumedBreakFast,
			lunchCost: consumedLunch,
			dinnerCost: consumedDinner,
			totalDaysStay: totalDaysStay,
			property: this.state.property._id,
			buyer: this.state.userId,
			seller: this.state.property.seller._id,
			creditCard: "",
		};

		this.setState({ bill: data, showBillModal: true });
	};

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
							// isLoading: false,
							// refreshing: false,
						});
					}
				}
			})
			.catch((error) => {
				// this.setState({ property: null, isLoading: false, refreshing: false });
			});
	};

	async componentDidMount() {
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let userRole = currentUser.userType;
		let userId = currentUser._id;
		this.setState({ userRole, userId });
		this.fetch();
	}

	handleConfirmation = async () => {
		Axios({
			url: URL + "property/booking",
			method: "POST",
			data: this.state.bill,
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						let token = this.state.property.seller.pushNotificationToken;
						sendNotification(
							"Booking",
							"You received a request for your property named as " +
								this.state.property.name +
								", visit the requests screen to approve or reject",
							token
						);
						Alert.alert("Success", response.data.message, [
							{
								text: "OK",
								onPress: () => this.props.navigation.goBack(),
							},
						]);
					} else {
						Alert.alert("Error", response.data.message, [
							{
								text: "OK",
								onPress: () => this.setState({ showBillModal: false }),
							},
						]);
					}
				}
			})
			.catch((error) => {
				Alert.alert(
					"There was some problem booking your order, please try again later"
				);
			});
	};

	render() {
		const { property, bill } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "white" }}>
				<Header
					title="Rent Apartment"
					isBack
					navigation={this.props.navigation}
				/>
				{this.state.isLoading ? (
					<ActivityIndicator />
				) : (
					<ScrollView showsVerticalScrollIndicator={false}>
						<KeyboardAvoidingView behavior="padding">
							<View
								style={{
									flex: 1,
									width: "80%",
									marginTop: 20,
									alignSelf: "center",
									marginBottom: "10%",
								}}
							>
								<Text style={{ fontSize: 20, fontWeight: "500" }}>
									Check in date
								</Text>
								<Button
									style={{ width: "100%", marginTop: 20 }}
									onPress={() => {
										this.setState({
											datePickerCheckIn: true,
											datePickerCheckOut: false,
										});
									}}
								>
									{this.state.dateTextCheckIn
										? this.state.dateTextCheckIn
										: "Please select check in date"}
								</Button>
								{this.state.datePickerCheckIn && (
									<DateTimePicker
										value={
											this.state.checkInDate
												? this.state.checkInDate
												: new Date()
										}
										is24Hour={true}
										display="default"
										minimumDate={new Date()}
										onChange={(event, date) => {
											let dateTextCheckIn = moment(date).format("YYYY-MM-DD");
											this.setState({
												checkInDate: date,
												dateTextCheckIn,
												datePickerCheckIn: false,
											});
										}}
									/>
								)}
								<Text
									style={{ fontSize: 20, fontWeight: "500", marginTop: 10 }}
								>
									Check out date
								</Text>
								<Button
									style={{ width: "100%", marginTop: 20 }}
									onPress={() => {
										this.setState({
											datePickerCheckOut: true,
											datePickerCheckIn: false,
										});
									}}
								>
									{this.state.dateTextCheckOut
										? this.state.dateTextCheckOut
										: "Please select check out date"}
								</Button>
								{this.state.datePickerCheckOut && (
									<DateTimePicker
										value={
											this.state.checkOutDate
												? this.state.checkOutDate
												: new Date()
										}
										is24Hour={true}
										display="default"
										// minimumDate={this.state.checkInDate}
										onChange={(event, date) => {
											let dateTextCheckOut = moment(date).format("YYYY-MM-DD");
											this.setState({
												checkOutDate: date,
												dateTextCheckOut,
												datePickerCheckOut: false,
											});
										}}
									/>
								)}
								{property.meals ? (
									<>
										<View
											style={{
												marginTop: 20,
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Text
												style={{ fontSize: 20, fontWeight: "500", flex: 2 }}
											>
												Avail Breakfast
											</Text>
											<Switch
												style={{ flex: 2 }}
												value={this.state.breakfast}
												onValueChange={(breakfast) =>
													this.setState({ breakfast })
												}
											/>
										</View>
										<View
											style={{
												marginTop: 20,
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Text
												style={{ fontSize: 20, fontWeight: "500", flex: 2 }}
											>
												Avail Lunch
											</Text>
											<Switch
												style={{ flex: 2 }}
												value={this.state.lunch}
												onValueChange={(lunch) => this.setState({ lunch })}
											/>
										</View>
										<View
											style={{
												marginTop: 20,
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Text
												style={{ fontSize: 20, fontWeight: "500", flex: 2 }}
											>
												Avail Dinner
											</Text>
											<Switch
												style={{ flex: 2 }}
												value={this.state.dinner}
												onValueChange={(dinner) => this.setState({ dinner })}
											/>
										</View>
									</>
								) : undefined}
								{property.vehicle ? (
									<View
										style={{
											marginTop: 20,
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<Text style={{ fontSize: 20, fontWeight: "500", flex: 2 }}>
											Avail Vehicle
										</Text>
										<Switch
											style={{ flex: 2 }}
											value={this.state.vehicle}
											onValueChange={(vehicle) => this.setState({ vehicle })}
										/>
									</View>
								) : undefined}
								{property.securityFee ? (
									<>
										<Text
											style={{ fontSize: 20, fontWeight: "500", marginTop: 20 }}
										>
											Enter your credit card number
										</Text>
										<Text
											style={{ fontSize: 10, marginTop: 10, marginBottom: 20 }}
										>
											Credit card information will be confidential, only used in
											case of any problem from your side
										</Text>
										<CreditCardInput
											style={{ marginLeft: -20 }}
											onChange={(value) => {
												this.setState({ creditCard: value });
											}}
										/>
									</>
								) : undefined}
								<Button
									style={{ width: "100%", marginTop: 20 }}
									onPress={() => this.handleSubmit()}
								>
									Book Now
								</Button>
							</View>
						</KeyboardAvoidingView>
					</ScrollView>
				)}

				<Modal
					isVisible={this.state.showBillModal}
					onBackButtonPress={() => {
						this.setState({ showBillModal: false });
					}}
					onBackdropPress={() => {
						this.setState({ showBillModal: false });
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
						{this.state.bill ? (
							<>
								{this.state.showPaymentModal ? (
									<View
										style={{
											backgroundColor: "#fff",
											width: "100%",
											padding: 20,
											borderRadius: 10,
											alignSelf: "center",
											zIndex: 100000,
										}}
									>
										<Text
											style={{
												textAlign: "center",
												fontSize: 20,
												fontWeight: "bold",
											}}
										>
											How would you like to pay?
										</Text>
										<Picker
											selectedValue={this.state.paymentMethod}
											style={{ height: 200, width: "100%" }}
											onValueChange={(itemValue, itemIndex) =>
												this.setState({ paymentMethod: itemValue })
											}
										>
											<Picker.Item label="Cash" value="cash" />
											<Picker.Item label="Credit / Debit Card" value="credit" />
										</Picker>
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
											onPress={() => {
												if (this.state.paymentMethod === "cash") {
													Alert.alert(
														"Confirmation",
														"Are you sure you would like to proceed with the booking?",
														[
															{
																text: "Yes",
																onPress: () => this.handleConfirmation(),
															},
															{
																text: "No",
															},
														]
													);
												} else {
													Alert.alert(
														"Wait",
														"We will be bringing credit/debit card option for you soon.",
														[
															{
																text: "Ok",
															},
														]
													);
												}
												this.setState({
													showPaymentModal: true,
												});
											}}
										>
											Confirm order
										</Button>
									</View>
								) : (
									<>
										<Text
											style={{
												textAlign: "center",
												fontSize: 25,
												fontWeight: "bold",
											}}
										>
											Your Bill
										</Text>
										<View style={{ marginTop: 20, marginBottom: 20 }}>
											<Text
												style={{
													fontSize: 15,
													fontWeight: "600",
													marginTop: 10,
													marginBottom: 10,
												}}
											>
												Starting Date:{" "}
												<Text style={{ fontSize: 20, fontWeight: "bold" }}>
													{moment(bill.checkInDate).format("MMMM Do YYYY")}
												</Text>
											</Text>
											<Text
												style={{
													fontSize: 15,
													fontWeight: "600",
													marginTop: 10,
													marginBottom: 10,
												}}
											>
												Ending Date:{" "}
												<Text
													style={{
														fontSize: 20,
														fontWeight: "bold",
													}}
												>
													{moment(bill.checkOutDate).format("MMMM Do YYYY")}
												</Text>
											</Text>
											<Text
												style={{
													fontSize: 15,
													fontWeight: "600",
													marginTop: 10,
													marginBottom: 10,
												}}
											>
												Total Days Stay:{" "}
												<Text
													style={{
														fontSize: 20,
														fontWeight: "bold",
													}}
												>
													{bill.totalDaysStay}
												</Text>
											</Text>
											<Text
												style={{
													fontSize: 15,
													fontWeight: "600",
													marginTop: 10,
													marginBottom: 10,
												}}
											>
												Total rent per day:{" "}
												<Text style={{ fontSize: 20, fontWeight: "bold" }}>
													{Math.round(this.state.property.rent / 30, 10)}
												</Text>{" "}
												PKR
											</Text>
											<Text
												style={{
													fontSize: 15,
													fontWeight: "600",
													marginTop: 10,
													marginBottom: 10,
												}}
											>
												Total rent for stay:{" "}
												<Text style={{ fontSize: 20, fontWeight: "bold" }}>
													{Math.round(bill.rentCost, 10)}
												</Text>{" "}
												PKR
											</Text>
											{property.meals ? (
												<>
													<Text
														style={{
															fontSize: 15,
															fontWeight: "600",
															marginTop: 10,
															marginBottom: 10,
														}}
													>
														Breakfast:{" "}
														<Text style={{ fontSize: 20, fontWeight: "bold" }}>
															{bill.breakfastCost}
														</Text>{" "}
														PKR
													</Text>
													<Text
														style={{
															fontSize: 15,
															fontWeight: "600",
															marginTop: 10,
															marginBottom: 10,
														}}
													>
														Lunch:{" "}
														<Text style={{ fontSize: 20, fontWeight: "bold" }}>
															{bill.lunchCost}
														</Text>{" "}
														PKR
													</Text>
													<Text
														style={{
															fontSize: 15,
															fontWeight: "600",
															marginTop: 10,
															marginBottom: 10,
														}}
													>
														Dinner:{" "}
														<Text style={{ fontSize: 20, fontWeight: "bold" }}>
															{bill.dinnerCost}
														</Text>{" "}
														PKR
													</Text>
												</>
											) : undefined}
											{property.vehicle ? (
												<Text
													style={{
														fontSize: 15,
														fontWeight: "600",
														marginTop: 10,
														marginBottom: 10,
													}}
												>
													Vehicle:{" "}
													<Text style={{ fontSize: 20, fontWeight: "bold" }}>
														{bill.vehicleCost}
													</Text>{" "}
													PKR
												</Text>
											) : undefined}
											<Text
												style={{
													fontSize: 15,
													fontWeight: "600",
													marginTop: 10,
													marginBottom: 10,
													textAlign: "right",
												}}
											>
												Total Bill:{" "}
												<Text style={{ fontSize: 22, fontWeight: "bold" }}>
													{Math.round(
														bill.dinnerCost +
															bill.breakfastCost +
															bill.lunchCost +
															bill.rentCost +
															bill.vehicleCost
													)}
												</Text>{" "}
												PKR
											</Text>
										</View>
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
											onPress={() => {
												// Alert.alert(
												// 	"Confirmation",
												// 	"Are you sure you would like to proceed with the booking?",
												// 	[
												// 		{
												// 			text: "Yes",
												// 			onPress: () => this.handleConfirmation(),
												// 		},
												// 		{
												// 			text: "No",
												// 		},
												// 	]
												// );
												this.setState({
													showPaymentModal: true,
												});
											}}
										>
											Confirm order
										</Button>
									</>
								)}
							</>
						) : (
							<ActivityIndicator />
						)}
					</View>
				</Modal>
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
