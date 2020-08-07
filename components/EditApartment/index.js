import React, { Component } from "react";
import { Text, View, ScrollView, Alert, AsyncStorage } from "react-native";
import Header from "../../ReuseableComponents/Header";
import { Card, ActivityIndicator, Switch } from "react-native-paper";
import NumericInput from "react-native-numeric-input";
import { Input, Button } from "galio-framework";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import Axios from "axios";
import { URL } from "../../Helpers/helper";

export default class EditApartment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// name: "Test House",
			// description:
			// 	"fkjahsdklfjha sdkjfhakldsjhfkasdhlkfj adskjhfklajsd fahsdlkfjhals djflasdf kjagsdfjkghasdkjgf kjadgsfkjagjsd fgjas gdfjga skdfa gjsdgjhfahgjsfasd asdffdshjkahjkf hja j   dfsadf sadf asadfs jghadfs jfda skafd hjkadfs hjkadfs ghjk",
			// address: "Hell, test, hello",
			// area: 100,P
			// bedroom: 2,
			// kitchen: 3,
			// bathroom: 1,
			// rent: 45000,
			// image: "",
			name: "",
			description: "",
			address: "",
			area: 0,
			bedroom: 0,
			kitchen: 0,
			bathroom: 0,
			rent: 0,
			image: 0,
		};
	}

	async componentDidMount() {
		let id = this.props.route.params.id;

		Axios({
			method: "GET",
			url: URL + "property/" + id,
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						let property = response.data.message;
						this.setState({
							name: property.name,
							description: property.description,
							address: property.address,
							area: property.area,
							bedroom: property.bedroom,
							kitchen: property.kitchen,
							bathroom: property.bathroom,
							rent: property.rent,
							id: property._id,
							carParking: property.carParking,
							meals: property.meals,
							vehicle: property.vehicle,
							lunchCost: property.lunchCost,
							breakfastCost: property.breakfastCost,
							dinnerCost: property.dinnerCost,
							vehiclePrice: property.vehiclePrice,
							isLoading: false,
						});
					} else {
						this.setState({ property: null, isLoading: false });
					}
				}
			})
			.catch((error) => {
				this.setState({ property: null, isLoading: false });
			});
		if (Constants.platform.ios) {
			const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
			if (status !== "granted") {
				alert("Sorry, we need camera roll permissions to make this work!");
			}
		}
	}

	handleSubmit = async () => {
		const {
			area,
			name,
			description,
			address,
			bedroom,
			kitchen,
			bathroom,
			rent,
			meals,
			carParking,
			lunchCost,
			dinnerCost,
			securityFee,
			breakfastCost,
			vehicle,
		} = this.state;
		if (
			!(
				area &&
				name &&
				description &&
				address &&
				bedroom &&
				kitchen &&
				bathroom &&
				rent
			)
		) {
			Alert.alert("Please check there is some data missing");
			return false;
		}
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let id = currentUser._id;
		Axios({
			method: "PUT",
			url: URL + "property/" + this.state.id,
			data: {
				name,
				description,
				address,
				bedroom,
				kitchen,
				bathroom,
				rent,
				area,
				seller: id,
				meals,
				carParking,
				lunchCost,
				dinnerCost,
				breakfastCost,
				vehicle,
				securityFee,
				vehiclePrice: this.state.vehiclePrice,
			},
		})
			.then((response) => {
				if (response && response.data.success) {
					Alert.alert(
						"Success",
						response.data.message,
						[{ text: "OK", onPress: () => this.props.navigation.goBack() }],
						{ cancelable: false }
					);
					this.setState({ loading: false });
				} else {
					this.setState({ loading: false });
				}
			})
			.catch((error) => {
				this.setState({ loading: false });
			});
		this.setState({ loading: true });
	};
	render() {
		const pickImage = async () => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				base64: true,
			});

			if (!result.cancelled) {
				let fileName = result.uri;

				this.setState({ image: result.base64, fileName });
			}
		};
		return (
			<View>
				<Header
					title="Edit Apartment"
					isBack
					navigation={this.props.navigation}
				/>
				<ScrollView style={{ marginBottom: 100 }}>
					<Card style={{ margin: 20 }}>
						<Card.Title title="Edit Apartment" />
						<Card.Content>
							{this.state.isLoading ? (
								<ActivityIndicator />
							) : (
								<>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Apartment Name
									</Text>
									<Input
										placeholder="Enter apartment name"
										style={{ alignSelf: "center" }}
										value={this.state.name}
										onChangeText={(name) => this.setState({ name })}
									/>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Apartment Description
									</Text>

									<Input
										placeholder="Enter apartment description"
										style={{ alignSelf: "center" }}
										value={this.state.description}
										onChangeText={(description) =>
											this.setState({ description })
										}
									/>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Apartment Address
									</Text>

									<Input
										placeholder="Enter apartment address"
										style={{ alignSelf: "center" }}
										value={this.state.address}
										onChangeText={(address) => this.setState({ address })}
									/>
									<Text
										style={{ paddingTop: 5, paddingBottom: 5, fontSize: 15 }}
									>
										Area (Square Feet)
									</Text>
									<NumericInput
										initValue={this.state.area}
										onChange={(area) => this.setState({ area })}
										step={50}
										value={this.state.area}
									/>
									<Text
										style={{ paddingTop: 5, paddingBottom: 5, fontSize: 15 }}
									>
										Bedrooms (Unit)
									</Text>
									<NumericInput
										initValue={this.state.bedroom}
										value={this.state.bedroom}
										onChange={(bedroom) => this.setState({ bedroom })}
									/>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Kitchens (Unit)
									</Text>
									<NumericInput
										initValue={this.state.kitchen}
										value={this.state.kitchen}
										onChange={(kitchen) => this.setState({ kitchen })}
									/>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Bathroom (Unit)
									</Text>
									<NumericInput
										value={this.state.bathroom}
										initValue={this.state.bathroom}
										onChange={(bathroom) => this.setState({ bathroom })}
									/>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Rent (PKR)
									</Text>
									<NumericInput
										initValue={this.state.rent}
										value={this.state.rent}
										onChange={(rent) => this.setState({ rent })}
										step={500}
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
											Security Fee
										</Text>
										<Switch
											value={this.state.securityFee}
											style={{ marginLeft: 10, flex: 5 }}
											onValueChange={(check) => {
												this.setState({ securityFee: check });
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
									</View>
									{this.state.vehicle ? (
										<>
											<Text
												style={{
													paddingTop: 10,
													paddingBottom: 5,
													fontSize: 15,
												}}
											>
												Vehicle Price (PKR)
											</Text>
											<NumericInput
												value={this.state.vehiclePrice}
												onChange={(vehiclePrice) =>
													this.setState({ vehiclePrice })
												}
												step={500}
											/>
										</>
									) : undefined}
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											marginTop: 10,
											marginBottom: 10,
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
											style={{ marginLeft: 10, flex: 5 }}
											value={this.state.meals}
											onValueChange={(check) => {
												this.setState({ meals: check });
											}}
										/>
									</View>

									{this.state.meals ? (
										<>
											<Text
												style={{
													paddingTop: 10,
													paddingBottom: 5,
													fontSize: 15,
												}}
											>
												Breakfast Price (PKR)
											</Text>
											<NumericInput
												value={this.state.breakfastCost}
												onChange={(breakfastCost) =>
													this.setState({ breakfastCost })
												}
												step={100}
											/>
											<Text
												style={{
													paddingTop: 10,
													paddingBottom: 5,
													fontSize: 15,
												}}
											>
												Lunch Price (PKR)
											</Text>
											<NumericInput
												value={this.state.lunchCost}
												onChange={(lunchCost) => this.setState({ lunchCost })}
												step={100}
											/>
											<Text
												style={{
													paddingTop: 10,
													paddingBottom: 5,
													fontSize: 15,
												}}
											>
												Dinner Price (PKR)
											</Text>
											<NumericInput
												value={this.state.dinnerCost}
												onChange={(dinnerCost) => this.setState({ dinnerCost })}
												step={100}
											/>
										</>
									) : undefined}
									<Button
										color="info"
										loading={this.state.loading}
										onPress={() => this.handleSubmit()}
										style={{ width: "100%", marginTop: 20 }}
									>
										Submit
									</Button>
								</>
							)}
						</Card.Content>
					</Card>
				</ScrollView>
			</View>
		);
	}
}
