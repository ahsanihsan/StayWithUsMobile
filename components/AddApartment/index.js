import React, { Component } from "react";
import {
	Text,
	View,
	ScrollView,
	Alert,
	AsyncStorage,
	Dimensions,
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
							<Text style={{ paddingTop: 5, paddingBottom: 5, fontSize: 15 }}>
								Area (Square Feet)
							</Text>
							<NumericInput
								onChange={(area) => this.setState({ area })}
								step={50}
								value={this.state.area}
							/>
							<Text style={{ paddingTop: 5, paddingBottom: 5, fontSize: 15 }}>
								Bedrooms (Units)
							</Text>
							<NumericInput
								value={this.state.bedroom}
								onChange={(bedroom) => this.setState({ bedroom })}
							/>
							<Text style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}>
								Kitchens (Units)
							</Text>
							<NumericInput
								value={this.state.kitchen}
								onChange={(kitchen) => this.setState({ kitchen })}
							/>
							<Text style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}>
								Bathroom (Units)
							</Text>
							<NumericInput
								value={this.state.bathroom}
								onChange={(bathroom) => this.setState({ bathroom })}
							/>
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
									style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
								>
									Car Parking
								</Text>
								<Switch
									value={this.state.carParking}
									style={{ marginLeft: 10 }}
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
									marginBottom: 10,
								}}
							>
								<Text
									style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}
								>
									Meals
								</Text>
								<Switch
									style={{ marginLeft: 10 }}
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
								</>
							) : undefined}
							<Button
								color="info"
								onPress={() => this.setState({ showMapModal: true })}
								style={{ width: "50%", marginTop: 20 }}
							>
								Select Location
							</Button>
							<Text style={{ fontSize: 15, marginTop: 20 }}>
								Location:{" "}
								{this.state.coordinates
									? this.state.address
									: "Please select your location"}
							</Text>
							<Button
								color="success"
								onPress={() => pickImage(1)}
								style={{ width: "50%", marginTop: 20 }}
							>
								Pick Image 1
							</Button>
							<Text style={{ fontSize: 15, marginTop: 20 }}>
								File Name 1:{" "}
								{this.state.fileName1
									? this.state.fileName1.substring(
											this.state.fileName1.length - 20
									  )
									: "Please pick an image"}
							</Text>
							<Button
								color="success"
								onPress={() => pickImage(2)}
								style={{ width: "50%", marginTop: 20 }}
							>
								Pick Image 2
							</Button>
							<Text style={{ fontSize: 15, marginTop: 20 }}>
								File Name 2:{" "}
								{this.state.fileName2
									? this.state.fileName2.substring(
											this.state.fileName2.length - 20
									  )
									: "Please pick an image"}
							</Text>
							<Button
								color="success"
								onPress={() => pickImage(3)}
								style={{ width: "50%", marginTop: 20 }}
							>
								Pick Image 3
							</Button>
							<Text style={{ fontSize: 15, marginTop: 20 }}>
								File Name 3:{" "}
								{this.state.fileName3
									? this.state.fileName3.substring(
											this.state.fileName3.length - 20
									  )
									: "Please pick an image"}
							</Text>
							<Button
								color="success"
								onPress={() => pickImage(4)}
								style={{ width: "50%", marginTop: 20 }}
							>
								Pick Image 4
							</Button>
							<Text style={{ fontSize: 15, marginTop: 20 }}>
								File Name 4:{" "}
								{this.state.fileName4
									? this.state.fileName4.substring(
											this.state.fileName4.length - 20
									  )
									: "Please pick an image"}
							</Text>
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
