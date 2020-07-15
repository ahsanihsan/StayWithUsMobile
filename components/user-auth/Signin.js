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
import { URL, registerForPushNotificationsAsync } from "../../Helpers/helper";
export default class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: "",
			error: false,
			loading: false,
			email: "buyer@test.com",
			password: "ahsan11343",
			isLoading: true,
		};
	}

	async componentDidMount() {
		let token = await registerForPushNotificationsAsync();
		this.setState({ token });
	}

	handleSubmit = () => {
		const { email, password } = this.state;
		if (!email) {
			Alert.alert("Please enter a valid email address");
			return false;
		}
		if (!password) {
			Alert.alert("Please enter a valid password");
			return false;
		}
		this.setState({ loading: true });
		Axios({
			url: URL + "login",
			method: "POST",
			data: {
				email,
				password,
				pushNotificationToken: this.state.token,
			},
		})
			.then((response) => {
				if (response && response.data) {
					if (response.data.success) {
						AsyncStorage.setItem(
							"currentUser",
							JSON.stringify(response.data.user)
						);
						AsyncStorage.setItem("userType", response.data.user.userType);

						this.props.navigation.replace("app");
					} else {
						Alert.alert(response.data.message);
						this.setState({ loading: false });
					}
				} else {
					Alert.alert("Invalid email or password");
					this.setState({ loading: false });
				}
			})
			.catch((error) => {
				Alert.alert("Invalid email or password");
				this.setState({ loading: false });
			});
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
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
					{/* <Text
            h4
            color='#000'
            bold={true}
            style={{ textAlign: "center", marginBottom: 40 }}>
            Login
          </Text> */}
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

					<Input
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
					/>
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
						LOGIN
					</Button>
					<TouchableOpacity
						onPress={() => this.props.navigation.push("forgotpassword")}
						style={{ alignSelf: "center", margin: 30 }}
					>
						<Text style={{ fontSize: 20, color: "#0097e6", marginLeft: 5 }}>
							Forgot Password?
						</Text>
					</TouchableOpacity>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							marginTop: 10,
						}}
					>
						<Text h6>Don't have an account?</Text>
						<TouchableOpacity
							onPress={() => this.props.navigation.push("signup")}
						>
							<Text style={{ fontSize: 20, color: "#0097e6", marginLeft: 5 }}>
								SignUp
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}
