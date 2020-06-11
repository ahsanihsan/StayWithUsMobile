import React, { Component } from "react";
import { Text, View, ScrollView, Alert, AsyncStorage } from "react-native";
import Header from "../../ReuseableComponents/Header";
import { Card } from "react-native-paper";
import NumericInput from "react-native-numeric-input";
import { Input, Button } from "galio-framework";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import Axios from "axios";
import { URL } from "../../Helpers/helper";

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
			// rating: 2,
			// image: "",
			name: "",
			description: "",
			address: "",
			area: 0,
			bedrooom: 0,
			kitchen: 0,
			bathroom: 0,
			rent: 0,
			rating: 0,
			image: 0,
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
			rating,
			image,
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
				rating &&
				image
			)
		) {
			Alert.alert("Please check there is some data missing");
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
				rating,
				image,
				area,
				seller: id,
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
							<Input
								placeholder="Enter apartment address"
								style={{ alignSelf: "center" }}
								value={this.state.address}
								onChangeText={(address) => this.setState({ address })}
							/>
							<Text style={{ paddingTop: 5, paddingBottom: 5, fontSize: 15 }}>
								Area
							</Text>
							<NumericInput
								onChange={(area) => this.setState({ area })}
								step={50}
								value={this.state.area}
							/>
							<Text style={{ paddingTop: 5, paddingBottom: 5, fontSize: 15 }}>
								Bedrooms
							</Text>
							<NumericInput
								value={this.state.bedroom}
								onChange={(bedroom) => this.setState({ bedroom })}
							/>
							<Text style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}>
								Kitchens
							</Text>
							<NumericInput
								value={this.state.kitchen}
								onChange={(kitchen) => this.setState({ kitchen })}
							/>
							<Text style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}>
								Bathroom
							</Text>
							<NumericInput
								value={this.state.bathroom}
								onChange={(bathroom) => this.setState({ bathroom })}
							/>
							<Text style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}>
								Rent
							</Text>
							<NumericInput
								value={this.state.rent}
								onChange={(rent) => this.setState({ rent })}
								step={500}
							/>
							<Text style={{ paddingTop: 10, paddingBottom: 5, fontSize: 15 }}>
								Rating
							</Text>

							<NumericInput
								value={this.state.rating}
								onChange={(rating) => this.setState({ rating })}
							/>
							<Button
								color="success"
								onPress={() => pickImage()}
								style={{ width: "50%", marginTop: 20 }}
							>
								Pick Image
							</Button>
							<Text style={{ fontSize: 15, marginTop: 20 }}>
								File Name:{" "}
								{this.state.fileName
									? this.state.fileName.substring(
											this.state.fileName.length - 20
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
				</ScrollView>
			</View>
		);
	}
}
