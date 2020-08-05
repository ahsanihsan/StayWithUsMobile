import React, { Component } from "react";
import {
	Text,
	View,
	ScrollView,
	Alert,
	AsyncStorage,
	Dimensions,
	Image,
} from "react-native";
import Header from "../../ReuseableComponents/Header";
import { Card, Switch } from "react-native-paper";
import NumericInput from "react-native-numeric-input";
import { Input, Button } from "galio-framework";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import Axios from "axios";
import { URL } from "../../Helpers/helper";
import Modal from "react-native-modal";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";

Geocoder.init("AIzaSyAlupYU3lnF4YFTMl7sWl9Sv58onHMb4xI");

export default class AddApartment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// name: "Test House",
			// description:
			// 	"fkjahsdklfjha sdkjfhakldsjhfkasdhlkfj adskjhfklajsd fahsdlkfjhals djflasdf kjagsdfjkghasdkjgf kjadgsfkjagjsd fgjas gdfjga skdfa gjsdgjhfahgjsfasd asdffdshjkahjkf hja j   dfsadf sadf asadfs jghadfs jfda skafd hjkadfs hjkadfs ghjk",
			// address: "Hell, test, hello",
			// area: 100,
			// bedroom: 2,
			// kitchen: 3,
			// bathroom: 1,
			// rent: 45000,
			// image: "",
			name: "",
			description: "",
			address: "",
			area: 0,
			bedrooom: 0,
			kitchen: 0,
			bathroom: 0,
			rent: 0,
			image: 0,
			dinnerCost: 0,
			lunchCost: 0,
			breakfastCost: 0,
			meals: false,
			carParking: false,
		};
	}

	async componentDidMount() {
		if (Constants.platform.ios) {
			const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
			if (status !== "granted") {
				alert("Sorry, we need camera roll permissions to make this work!");
			}
		}
	}

	getMapCoordinates = (long, lat) => {
		Geocoder.from({ latitude: lat, longitude: long })
			.then((json) => {
				var addressComponent = json.results[0].formatted_address;
				this.setState({ address: addressComponent });
			})
			.catch((error) => console.warn(error));
	};

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
			image1,
			image2,
			image3,
			image4,
			dinnerCost,
			lunchCost,
			breakfastCost,
			meals,
			securityFee,
			carParking,
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
				rent &&
				image1
			)
		) {
			Alert.alert("Please check there is some data missing");
			return false;
		}
		if (meals && (dinnerCost <= 0 || lunchCost <= 0 || breakfastCost <= 0)) {
			Alert.alert("Please enter meals price");
			return false;
		}
		if (!this.state.coordinates) {
			Alert.alert("Please select the location of your apartment");
			return false;
		}
		let currentUser = await AsyncStorage.getItem("currentUser");
		currentUser = JSON.parse(currentUser);
		let id = currentUser._id;
		Axios({
			method: "POST",
			url: URL + "property",
			data: {
				name,
				description,
				address,
				bedroom,
				kitchen,
				bathroom,
				rent,
				images: [image1, image2, image3, image4],
				securityFee,
				breakfastImages: [
					this.state.breakfastImage1,
					this.state.breakfastImage3,
					this.state.breakfastImage3,
				],
				lunchImages: [
					this.state.lunchImage1,
					this.state.lunchImage2,
					this.state.lunchImage3,
				],
				dinnerImages: [
					this.state.dinnerImage1,
					this.state.dinnerImage2,
					this.state.dinnerImage3,
				],
				vehicleImages: [
					this.state.vehicleImage1,
					this.state.vehicleImage2,
					this.state.vehicleImage3,
				],
				vehicle: this.state.vehicle,
				vehiclePrice: this.state.vehiclePrice,
				area,
				seller: id,
				dinnerCost,
				lunchCost,
				breakfastCost,
				meals,
				carParking,
				longitude: this.state.coordinates.longitude,
				latitude: this.state.coordinates.latitude,
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
		const pickImage = async (imageNo) => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				base64: true,
			});

			if (!result.cancelled) {
				let fileName = result.uri;
				if (imageNo === 1) {
					this.setState({ image1: result.base64, fileName1: fileName });
				} else if (imageNo === 2) {
					this.setState({ image2: result.base64, fileName2: fileName });
				} else if (imageNo === 3) {
					this.setState({ image3: result.base64, fileName3: fileName });
				} else {
					this.setState({ image4: result.base64, fileName4: fileName });
				}
			}
		};
		const pickImageBreakfast = async (imageNo) => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				base64: true,
			});

			if (!result.cancelled) {
				let fileName = result.uri;
				if (imageNo === 1) {
					this.setState({ breakfastImage1: result.base64 });
				} else if (imageNo === 2) {
					this.setState({ breakfastImage2: result.base64 });
				} else if (imageNo === 3) {
					this.setState({ breakfastImage3: result.base64 });
				}
			}
		};
		const pickImageLunch = async (imageNo) => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				base64: true,
			});

			if (!result.cancelled) {
				let fileName = result.uri;
				if (imageNo === 1) {
					this.setState({ lunchImage1: result.base64 });
				} else if (imageNo === 2) {
					this.setState({ lunchImage2: result.base64 });
				} else if (imageNo === 3) {
					this.setState({ lunchImage3: result.base64 });
				}
			}
		};
		const pickImageDinner = async (imageNo) => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				base64: true,
			});

			if (!result.cancelled) {
				let fileName = result.uri;
				if (imageNo === 1) {
					this.setState({ dinnerImage1: result.base64 });
				} else if (imageNo === 2) {
					this.setState({ dinnerImage2: result.base64 });
				} else if (imageNo === 3) {
					this.setState({ dinnerImage3: result.base64 });
				}
			}
		};
		const pickImageVehicle = async (imageNo) => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				base64: true,
			});

			if (!result.cancelled) {
				let fileName = result.uri;
				if (imageNo === 1) {
					this.setState({ vehicleImage1: result.base64 });
				} else if (imageNo === 2) {
					this.setState({ vehicleImage2: result.base64 });
				} else if (imageNo === 3) {
					this.setState({ vehicleImage3: result.base64 });
				}
			}
		};
		return (
			<View>
				<Header
					title="Add Apartment"
					isBack
					navigation={this.props.navigation}
				/>
				<ScrollView style={{ marginBottom: 100 }}>
					<Card style={{ margin: 20 }}>
						<Card.Title title="Add Apartment" />
						<Card.Content>
							<Input
								placeholder="Enter apartment name"
								style={{ alignSelf: "center" }}
								value={this.state.name}
								onChangeText={(name) => this.setState({ name })}
							/>
							<Input
								placeholder="Enter apartment description"
								style={{ alignSelf: "center" }}
								value={this.state.description}
								onChangeText={(description) => this.setState({ description })}
							/>
							{/* <Input
								placeholder="Enter apartment address"
								style={{ alignSelf: "center" }}
								value={this.state.address}
								onChangeText={(address) => this.setState({ address })}
							/> */}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<View>
									<Text
										style={{ paddingTop: 5, paddingBottom: 5, fontSize: 15 }}
									>
										Area (Square Feet)
									</Text>
									<NumericInput
										onChange={(area) => this.setState({ area })}
										step={50}
										value={this.state.area}
									/>
								</View>
								<View>
									<Text
										style={{ paddingTop: 5, paddingBottom: 5, fontSize: 15 }}
									>
										Bedrooms (Units)
									</Text>
									<NumericInput
										value={this.state.bedroom}
										onChange={(bedroom) => this.setState({ bedroom })}
									/>
								</View>
							</View>
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
										Kitchens (Units)
									</Text>
									<NumericInput
										value={this.state.kitchen}
										onChange={(kitchen) => this.setState({ kitchen })}
									/>
								</View>
								<View>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Bathroom (Units)
									</Text>
									<NumericInput
										value={this.state.bathroom}
										onChange={(bathroom) => this.setState({ bathroom })}
									/>
								</View>
							</View>
							<Text style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}>
								Rent (PKR)
							</Text>
							<NumericInput
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
										flex: 2,
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
										flex: 2,
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
										flex: 2,
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
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Vehicle Price (PKR)
									</Text>
									<NumericInput
										value={this.state.vehiclePrice}
										onChange={(vehiclePrice) => this.setState({ vehiclePrice })}
										step={500}
									/>
									<Text
										style={{ fontSize: 20, fontWeight: "600", marginTop: 10 }}
									>
										Vehicle Images
									</Text>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											marginTop: 10,
										}}
									>
										{this.state.vehicleImage1 ? (
											<TouchableOpacity onPress={() => pickImageVehicle(1)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.vehicleImage1,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageVehicle(1)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 1</Text>
											</TouchableOpacity>
										)}
										{this.state.vehicleImage2 ? (
											<TouchableOpacity onPress={() => pickImageVehicle(2)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.vehicleImage2,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageVehicle(2)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 2</Text>
											</TouchableOpacity>
										)}
										{this.state.vehicleImage3 ? (
											<TouchableOpacity onPress={() => pickImageVehicle(3)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.vehicleImage3,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageVehicle(3)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 3</Text>
											</TouchableOpacity>
										)}
									</View>
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
										flex: 2,
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
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
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
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											marginTop: 10,
										}}
									>
										{this.state.breakfastImage1 ? (
											<TouchableOpacity onPress={() => pickImageBreakfast(1)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.breakfastImage1,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageBreakfast(1)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 1</Text>
											</TouchableOpacity>
										)}
										{this.state.breakfastImage2 ? (
											<TouchableOpacity onPress={() => pickImageBreakfast(2)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.breakfastImage2,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageBreakfast(2)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 2</Text>
											</TouchableOpacity>
										)}
										{this.state.breakfastImage3 ? (
											<TouchableOpacity onPress={() => pickImageBreakfast(3)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.breakfastImage3,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageBreakfast(3)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 3</Text>
											</TouchableOpacity>
										)}
									</View>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Lunch Price (PKR)
									</Text>
									<NumericInput
										value={this.state.lunchCost}
										onChange={(lunchCost) => this.setState({ lunchCost })}
										step={100}
									/>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											marginTop: 10,
										}}
									>
										{this.state.lunchImage1 ? (
											<TouchableOpacity onPress={() => pickImageLunch(1)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," + this.state.lunchImage1,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageLunch(1)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 1</Text>
											</TouchableOpacity>
										)}
										{this.state.lunchImage2 ? (
											<TouchableOpacity onPress={() => pickImageLunch(2)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," + this.state.lunchImage2,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageLunch(2)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 2</Text>
											</TouchableOpacity>
										)}
										{this.state.lunchImage3 ? (
											<TouchableOpacity onPress={() => pickImageLunch(3)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," + this.state.lunchImage3,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageLunch(3)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 3</Text>
											</TouchableOpacity>
										)}
									</View>
									<Text
										style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
									>
										Dinner Price (PKR)
									</Text>
									<NumericInput
										value={this.state.dinnerCost}
										onChange={(dinnerCost) => this.setState({ dinnerCost })}
										step={100}
									/>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											marginTop: 10,
										}}
									>
										{this.state.dinnerImage1 ? (
											<TouchableOpacity onPress={() => pickImageDinner(1)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.dinnerImage1,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageDinner(1)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 1</Text>
											</TouchableOpacity>
										)}
										{this.state.dinnerImage2 ? (
											<TouchableOpacity onPress={() => pickImageDinner(2)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.dinnerImage2,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageDinner(2)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 2</Text>
											</TouchableOpacity>
										)}
										{this.state.dinnerImage3 ? (
											<TouchableOpacity onPress={() => pickImageDinner(3)}>
												<Image
													source={{
														uri:
															"data:image/png;base64," +
															this.state.dinnerImage3,
													}}
													style={{
														width: 100,
														height: 100,
														borderRadius: 10,
													}}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={() => pickImageDinner(3)}
												style={{
													justifyContent: "center",
													width: 100,
													height: 100,
													backgroundColor: "#e4e4e4",
													alignItems: "center",
													borderRadius: 10,
												}}
											>
												<Icon name="plus" />
												<Text style={{ marginTop: 5 }}>Image 3</Text>
											</TouchableOpacity>
										)}
									</View>
								</>
							) : undefined}
							<Text style={{ fontSize: 20, fontWeight: "600", marginTop: 10 }}>
								Location
							</Text>
							<Button
								color="info"
								onPress={() => this.setState({ showMapModal: true })}
								style={{ width: "50%", marginTop: 20 }}
							>
								Open Maps
							</Button>
							<Text style={{ fontSize: 15, marginTop: 20 }}>
								Your Location:{" "}
								{this.state.coordinates
									? this.state.address
									: "Please select your location by opening the maps and dropping a pin."}
							</Text>
							<Text style={{ fontSize: 20, fontWeight: "600", marginTop: 10 }}>
								Apartment Images
							</Text>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									marginTop: 10,
								}}
							>
								{this.state.image1 ? (
									<TouchableOpacity onPress={() => pickImage(1)}>
										<Image
											source={{
												uri: "data:image/png;base64," + this.state.image1,
											}}
											style={{
												width: 100,
												height: 100,
												borderRadius: 10,
											}}
										/>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										onPress={() => pickImage(1)}
										style={{
											justifyContent: "center",
											width: 100,
											height: 100,
											backgroundColor: "#e4e4e4",
											alignItems: "center",
											borderRadius: 10,
										}}
									>
										<Icon name="plus" />
										<Text style={{ marginTop: 5 }}>Image 1</Text>
									</TouchableOpacity>
								)}
								{this.state.image2 ? (
									<TouchableOpacity onPress={() => pickImage(2)}>
										<Image
											source={{
												uri: "data:image/png;base64," + this.state.image2,
											}}
											style={{
												width: 100,
												height: 100,
												borderRadius: 10,
											}}
										/>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										onPress={() => pickImage(2)}
										style={{
											justifyContent: "center",
											width: 100,
											height: 100,
											backgroundColor: "#e4e4e4",
											alignItems: "center",
											borderRadius: 10,
										}}
									>
										<Icon name="plus" />
										<Text style={{ marginTop: 5 }}>Image 2</Text>
									</TouchableOpacity>
								)}
								{this.state.image3 ? (
									<TouchableOpacity onPress={() => pickImage(3)}>
										<Image
											source={{
												uri: "data:image/png;base64," + this.state.image3,
											}}
											style={{
												width: 100,
												height: 100,
												borderRadius: 10,
											}}
										/>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										onPress={() => pickImage(3)}
										style={{
											justifyContent: "center",
											width: 100,
											height: 100,
											backgroundColor: "#e4e4e4",
											alignItems: "center",
											borderRadius: 10,
										}}
									>
										<Icon name="plus" />
										<Text style={{ marginTop: 5 }}>Image 3</Text>
									</TouchableOpacity>
								)}
							</View>
							{this.state.image4 ? (
								<TouchableOpacity onPress={() => pickImage(4)}>
									<Image
										source={{
											uri: "data:image/png;base64," + this.state.image4,
										}}
										style={{
											width: 100,
											height: 100,
											borderRadius: 10,
											alignSelf: "center",
											marginTop: 10,
										}}
									/>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									onPress={() => pickImage(4)}
									style={{
										justifyContent: "center",
										width: 100,
										height: 100,
										backgroundColor: "#e4e4e4",
										alignItems: "center",
										borderRadius: 10,
										alignSelf: "center",
										marginTop: 10,
									}}
								>
									<Icon name="plus" />
									<Text style={{ marginTop: 5 }}>Image 4</Text>
								</TouchableOpacity>
							)}
							<Button
								color="info"
								loading={this.state.loading}
								onPress={() => this.handleSubmit()}
								style={{ width: "100%", marginTop: 20 }}
							>
								Submit
							</Button>
						</Card.Content>
					</Card>
					<Modal
						isVisible={this.state.showMapModal}
						onBackButtonPress={() => {
							this.setState({ showMapModal: false });
						}}
						onBackdropPress={() => {
							this.setState({ showMapModal: false });
						}}
					>
						<View
							style={{
								backgroundColor: "#fff",
								width: "100%",
								borderRadius: 10,
								alignSelf: "center",
								padding: 10,
							}}
						>
							<MapView
								initialRegion={{
									latitude: 31.5204,
									longitude: 74.3587,
									latitudeDelta: 1.1122,
									longitudeDelta: 1.1121,
								}}
								onPress={(event) => {
									let coor = event.nativeEvent.coordinate;
									this.setState({ coordinates: coor });
									this.getMapCoordinates(coor.longitude, coor.latitude);
								}}
								style={{
									width: "100%",
									height: Dimensions.get("window").height / 1.5,
								}}
							>
								{this.state.coordinates ? (
									<Marker coordinate={this.state.coordinates} />
								) : undefined}
							</MapView>
							<Button
								color="success"
								onPress={() => this.setState({ showMapModal: false })}
								style={{ width: "100%", marginTop: 20 }}
							>
								Done
							</Button>
						</View>
					</Modal>
				</ScrollView>
			</View>
		);
	}
}
