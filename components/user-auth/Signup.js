import React, { Component } from "react";
import { View, Image, TouchableOpacity, Alert, Switch } from "react-native";
import { Text, Input } from "galio-framework";
import { Button } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import Axios from "axios";
import { URL } from "../../Helpers/helper";

export default class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			error: false,
			loading: false,
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		};
	}

	handleSubmit = async () => {
		const { name, email, password, confirmPassword, phone_number } = this.state;
		if (!name) {
			Alert.alert("Please enter a valid name");
			return false;
		}
		if (!email) {
			Alert.alert("Please enter a valid email address");
			return false;
		}

		if (!password) {
			Alert.alert("Please enter a valid password");
			return false;
		}

		if (password !== confirmPassword) {
			Alert.alert("Confirmation password does not match");
			return false;
		}
		this.setState({ loading: true });
		Axios({
			method: "POST",
			url: URL + "users",
			data: {
				name,
				userType: this.state.seller ? "Seller" : "Buyer",
				email,
				password,
				phone_number,
			},
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						this.setState({ loading: false });
						this.props.navigation.goBack();
					} else {
						Alert.alert("Error", response.data.message);
						this.setState({ loading: false });
					}
				} else {
					this.setState({ loading: false });
				}
			})
			.catch((error) => {
				this.setState({ loading: false });
				Alert.alert(
					"Error",
					"There was a problem signing you up, please try again later."
				);
			});
	};
	render() {
		return (
			<View style={{ flex: 1 }}>
				<Animatable.Image
					style={{
						alignSelf: "center",
						marginTop: 100,
					}}
					animation="pulse"
					easing="ease-in-out-circ"
					iterationCount="infinite"
					source={require("../../assets/logo.png")}
				/>
				<Input
					placeholder="Enter your Name"
					right
					icon="user"
					family="Entypo"
					rounded
					style={{ width: "90%", alignSelf: "center" }}
					iconSize={16}
					iconColor="grey"
					onChangeText={(name) => this.setState({ name })}
				/>
				<Input
					type="email-address"
					placeholder="Enter your email-address"
					right
					icon="email"
					family="Entypo"
					rounded
					style={{ width: "90%", alignSelf: "center" }}
					iconSize={16}
					iconColor="grey"
					onChangeText={(email) => this.setState({ email })}
				/>
				<Input
					type="numeric"
					placeholder="Enter your phone number"
					right
					icon="phone"
					family="Entypo"
					rounded
					style={{ width: "90%", alignSelf: "center" }}
					iconSize={16}
					iconColor="grey"
					onChangeText={(phone_number) => this.setState({ phone_number })}
				/>
				<Input
					placeholder="Enter your password"
					right
					rounded
					style={{ width: "90%", alignSelf: "center" }}
					password={true}
					iconSize={16}
					iconColor="grey"
					viewPass={true}
					onChangeText={(password) => this.setState({ password })}
				/>
				<Input
					placeholder="Re-enter your password"
					right
					rounded
					style={{ width: "90%", alignSelf: "center" }}
					password={true}
					iconSize={16}
					iconColor="grey"
					viewPass={true}
					onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
				/>
				<View
					style={{
						alignItems: "center",
						flexDirection: "row",
						width: "90%",
						alignSelf: "center",
					}}
				>
					<Text style={{ fontSize: 17, marginRight: 10 }}>Buyer</Text>
					<Switch
						onValueChange={(seller) => {
							this.setState({ seller });
						}}
						value={this.state.seller}
					/>
					<Text style={{ fontSize: 17, marginLeft: 10 }}>Seller</Text>
				</View>
				<Button
					icon="account"
					mode="contained"
					color="#130f40"
					labelStyle={{ fontSize: 16 }}
					loading={this.state.loading}
					style={{
						width: "90%",
						padding: 2,
						marginTop: 12,
						borderRadius: 15,
						alignSelf: "center",
					}}
					onPress={() => this.handleSubmit()}
				>
					Sign-Up
				</Button>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						marginTop: 10,
					}}
				>
					<Text h6>Already have an account?</Text>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
						<Text style={{ fontSize: 20, color: "#0097e6", marginLeft: 5 }}>
							Sign-in here
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
