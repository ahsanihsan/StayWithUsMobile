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
import { Chip, ActivityIndicator, Switch } from "react-native-paper";
import Header from "../../ReuseableComponents/Header";
import { URL } from "../../Helpers/helper";
import Axios from "axios";
import Modal from "react-native-modal";
import { Button } from "galio-framework";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Input } from "galio-framework";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

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
		};
	}

	handleSubmit = () => {
		console.log("********** PROPERTY **********");
		console.log(this.state.property);
		console.log("********** PROPERTY **********");

		console.log("********** BOOKING DETAILS *******");
		console.log(this.state);
		console.log("********** BOOKING DETAILS *******");
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

	async componentDidMount() {
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let userRole = currentUser.userType;
		this.setState({ userRole });
		this.fetch();
	}

	render() {
		const { property, rating } = this.state;
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
						<View style={{ width: "80%", marginTop: 20, alignSelf: "center" }}>
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
										this.state.checkInDate ? this.state.checkInDate : new Date()
									}
									is24Hour={true}
									display="default"
									minimumDate={new Date()}
									onChange={(event, date) => {
										let dateTextCheckIn = moment(date).format("YYYY-MM-DD");
										this.setState({ checkInDate: date, dateTextCheckIn });
									}}
								/>
							)}
							<Text style={{ fontSize: 20, fontWeight: "500", marginTop: 10 }}>
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
									minimumDate={this.state.checkInDate}
									onChange={(event, date) => {
										let dateTextCheckOut = moment(date).format("YYYY-MM-DD");
										this.setState({ checkOutDate: date, dateTextCheckOut });
									}}
								/>
							)}
							<View
								style={{
									marginTop: 20,
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Text style={{ fontSize: 20, fontWeight: "500" }}>
									Avail Breakfast
								</Text>
								<Switch
									style={{ marginLeft: 20 }}
									value={this.state.breakfast}
									onValueChange={(breakfast) => this.setState({ breakfast })}
								/>
							</View>
							<View
								style={{
									marginTop: 20,
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Text style={{ fontSize: 20, fontWeight: "500" }}>
									Avail Lunch
								</Text>
								<Switch
									style={{ marginLeft: 20 }}
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
								<Text style={{ fontSize: 20, fontWeight: "500" }}>
									Avail Dinner
								</Text>
								<Switch
									style={{ marginLeft: 20 }}
									value={this.state.dinner}
									onValueChange={(dinner) => this.setState({ dinner })}
								/>
							</View>
							<View
								style={{
									marginTop: 20,
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Text style={{ fontSize: 20, fontWeight: "500" }}>
									Avail Vehicle
								</Text>
								<Switch
									style={{ marginLeft: 20 }}
									value={this.state.vehicle}
									onValueChange={(vehicle) => this.setState({ vehicle })}
								/>
							</View>
							<Button
								style={{ width: "100%", marginTop: 20 }}
								onPress={() => this.handleSubmit()}
							>
								Book Now
							</Button>
						</View>
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
