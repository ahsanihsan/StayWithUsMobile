import React, { Component } from "react";
import {
	View,
	Image,
	KeyboardAvoidingView,
	TouchableOpacity,
	Alert,
	AsyncStorage,
} from "react-native";
import { Text, Input } from "galio-framework";
import { TextInput, Button, IconButton } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import Axios from "axios";
import { URL } from "../../Helpers/helper";

export default class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			error: false,
			loading: false,
			email: "ahsan.ihsan@outlook.com",
			password: "ahsan11343",
			isLoading: true,
			emailSent: false,
			codeIsCorrect: false,
		};
	}

	sendEmail = () => {
		const { email, password } = this.state;
		if (!email) {
			Alert.alert("Please enter a valid email address");
			return false;
		}
		this.setState({ loading: true });
		Axios({
			url: URL + "users/reset",
			method: "POST",
			data: {
				email,
			},
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						Alert.alert(response.data.message);
						this.setState({ emailSent: true });
					} else {
						Alert.alert(response.data.message);
						this.setState({ loading: false });
					}
				} else {
					Alert.alert("Invalid email");
					this.setState({ loading: false });
				}
			})
			.catch((error) => {
				Alert.alert("Invalid email");
				this.setState({ loading: false });
			});
	};

	savePassword = () => {
		const { email, confirmNewPassword, newPassword } = this.state;

		if (!newPassword) {
			Alert.alert("Please enter a password");
			return false;
		}
		if (!confirmNewPassword) {
			Alert.alert("Please enter confirmation of password");
			return false;
		}
		if (confirmNewPassword !== newPassword) {
			Alert.alert("New password and confirm password do not match.");
			return false;
		}
		this.setState({ savingPassword: true });
		Axios({
			url: URL + "users/change-password",
			method: "POST",
			data: {
				email,
				newPassword,
			},
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						Alert.alert(
							"Success",
							"Your password has been reset, Please login with your new password.",
							[{ text: "OK", onPress: () => this.props.navigation.goBack() }],
							{ cancelable: false }
						);
						this.setState({
							email: "",
							emailSent: false,
							savingPassword: false,
							loading: false,
							checkingCode: false,
							codeIsCorrect: false,
						});
					} else {
						Alert.alert(response.data.message);
						this.setState({ savingPassword: false });
					}
				} else {
					Alert.alert(
						"There was a problem changing your password, Please try again later."
					);
					this.setState({ savingPassword: false });
				}
			})
			.catch((error) => {
				Alert.alert(
					"There was a problem changing your password, Please try again later."
				);
				this.setState({ savingPassword: false });
			});
	};

	checkCode = () => {
		const { resetCode, email } = this.state;
		if (!resetCode) {
			Alert.alert("Please enter a reset code");
			return false;
		}

		if (resetCode.length !== 5) {
			Alert.alert("Reset code should be 5 digits long.");
			return false;
		}
		this.setState({ checkingCode: true });
		Axios({
			url: URL + "users/verify",
			method: "POST",
			data: {
				email,
				resetCode,
			},
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						Alert.alert(response.data.message);
						this.setState({ codeIsCorrect: true, checkingCode: false });
					} else {
						Alert.alert(response.data.message);
						this.setState({ checkingCode: false });
					}
				} else {
					Alert.alert("Invalid reset code entered");
					this.setState({ checkingCode: false });
				}
			})
			.catch((error) => {
				Alert.alert("Invalid reset code entered");
				this.setState({ checkingCode: false });
			});
	};

	render() {
		if (this.state.emailSent && !this.state.codeIsCorrect) {
			return (
				<View style={{ flex: 1, justifyContent: "center" }}>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							marginTop: 100,
						}}
					>
						<Animatable.Image
							animation="pulse"
							easing="ease-in-out-circ"
							iterationCount="infinite"
							source={require("../../assets/logo.png")}
						/>
					</View>
					<View
						style={{
							flex: 1,
						}}
					>
						<Text
							h5
							color="#000"
							bold={true}
							style={{ textAlign: "center", marginBottom: 40 }}
						>
							Forgot Password
						</Text>
						<Input
							placeholder="Enter your reset code"
							right
							rounded
							style={{ width: "90%", alignSelf: "center" }}
							iconSize={16}
							iconColor="grey"
							value={this.state.resetCode}
							onChangeText={(resetCode) => this.setState({ resetCode })}
						/>
						<Button
							mode="contained"
							color="#130f40"
							loading={this.state.checkingCode}
							style={{
								width: "90%",
								padding: 2,
								marginTop: 12,
								borderRadius: 15,
								alignSelf: "center",
							}}
							onPress={() => this.checkCode()}
						>
							Verify Code
						</Button>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()}
							style={{ alignSelf: "center", margin: 30 }}
						>
							<Text style={{ fontSize: 20, color: "#0097e6", marginLeft: 5 }}>
								Back
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		} else if (this.state.codeIsCorrect) {
			return (
				<View style={{ flex: 1, justifyContent: "center" }}>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							marginTop: 100,
						}}
					>
						<Animatable.Image
							animation="pulse"
							easing="ease-in-out-circ"
							iterationCount="infinite"
							source={require("../../assets/logo.png")}
						/>
					</View>
					<View
						style={{
							flex: 1,
						}}
					>
						<Text
							h5
							color="#000"
							bold={true}
							style={{ textAlign: "center", marginBottom: 40 }}
						>
							Forgot Password
						</Text>

						<Input
							placeholder="Enter your new password"
							right
							rounded
							style={{ width: "90%", alignSelf: "center" }}
							password={true}
							iconSize={16}
							iconColor="grey"
							value={this.state.newPassword}
							onChangeText={(newPassword) => this.setState({ newPassword })}
						/>
						<Input
							placeholder="Confirm your new password"
							right
							rounded
							style={{ width: "90%", alignSelf: "center" }}
							password={true}
							iconSize={16}
							iconColor="grey"
							value={this.state.confirmNewPassword}
							onChangeText={(confirmNewPassword) =>
								this.setState({ confirmNewPassword })
							}
						/>
						<Button
							mode="contained"
							color="#130f40"
							loading={this.state.savingPassword}
							style={{
								width: "90%",
								padding: 2,
								marginTop: 12,
								borderRadius: 15,
								alignSelf: "center",
							}}
							onPress={() => this.savePassword()}
						>
							Change Password
						</Button>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()}
							style={{ alignSelf: "center", margin: 30 }}
						>
							<Text style={{ fontSize: 20, color: "#0097e6", marginLeft: 5 }}>
								Back
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		} else {
			return (
				<View style={{ flex: 1, justifyContent: "center" }}>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							marginTop: 100,
						}}
					>
						<Animatable.Image
							animation="pulse"
							easing="ease-in-out-circ"
							iterationCount="infinite"
							source={require("../../assets/logo.png")}
						/>
					</View>
					<View
						style={{
							flex: 1,
						}}
					>
						<Text
							h5
							color="#000"
							bold={true}
							style={{ textAlign: "center", marginBottom: 40 }}
						>
							Forgot Password
						</Text>
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
							value={this.state.email}
							onChangeText={(email) => this.setState({ email })}
						/>

						{/* <Input
              placeholder="Enter your password"
              right
              rounded
              style={{ width: "90%", alignSelf: "center" }}
              password={true}
              iconSize={16}
              iconColor="grey"
              viewPass={true}
              value={this.state.password}
              onChangeText={(password) => this.setState({ password })}
            /> */}
						<Button
							mode="contained"
							color="#130f40"
							loading={this.state.loading}
							style={{
								width: "90%",
								padding: 2,
								marginTop: 12,
								borderRadius: 15,
								alignSelf: "center",
							}}
							onPress={() => this.sendEmail()}
						>
							Send Email
						</Button>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()}
							style={{ alignSelf: "center", margin: 30 }}
						>
							<Text style={{ fontSize: 20, color: "#0097e6", marginLeft: 5 }}>
								Back
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
		return <View />;
	}
}
