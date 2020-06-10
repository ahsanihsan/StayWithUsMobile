import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import BuyerView from "../BuyerView";
import SellerView from "../SellerView";

export default class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		};
	}

	async componentDidMount() {
		let userRole = await AsyncStorage.getItem("userType");
		if (userRole) {
			this.setState({ userRole, isLoading: false });
		}
	}

	render() {
		return (
			<>
				{!this.state.isLoading ? (
					<>
						{this.state.userRole === "Buyer" ? (
							<BuyerView {...this.props} />
						) : (
							<SellerView {...this.props} />
						)}
					</>
				) : (
					<ActivityIndicator />
				)}
			</>
		);
	}
}
