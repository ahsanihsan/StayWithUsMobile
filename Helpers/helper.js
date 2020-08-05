import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import { Alert } from "react-native";
import Axios from "axios";

export const URL = "http://0d8e12d21da5.ngrok.io/";

export async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}
		token = await Notifications.getExpoPushTokenAsync();
	} else {
		Alert.alert("Must use physical device for Push Notifications");
	}
	// if (Platform.OS === "android") {
	// 	Notifications.setNotificationChannelAsync("default", {
	// 		name: "default",
	// 		importance: Notifications.AndroidImportance.MAX,
	// 		vibrationPattern: [0, 250, 250, 250],
	// 		lightColor: "#FF231F7C",
	// 	});
	// }
	return token;
}

export const sendNotification = (title, body, token) => {
	Axios({
		url: URL + "users/notification",
		method: "POST",
		data: {
			title,
			body,
			token,
		},
	})
		.then((response) => {})
		.catch((error) => {});
};

const degreeToRadian = (degree) => {
	var pi = Math.PI;
	return degree * (pi / 180);
};

export const getDistance = (point, interest, kms) => {
	let R = 6371;
	let deg2rad = (n) => {
		return n * (Math.PI / 180);
	};
	let dLat = deg2rad(interest.latitude - point.latitude);
	let dLon = deg2rad(interest.longitude - point.longitude);
	let a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(point.latitude)) *
			Math.cos(deg2rad(interest.latitude)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	let c = 2 * Math.asin(Math.sqrt(a));
	let d = R * c;
	return d <= kms;
};
