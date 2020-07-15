import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import { Alert } from "react-native";
import Axios from "axios";

export const URL = "http://025bb3f698cf.ngrok.io/";

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
	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}
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

export const getDistance = (latitude1, longitude1, latitude2, longitude2) => {
	const earth_radius = 6371;

	let dLat = degreeToRadian(latitude2 - latitude1);
	let dLon = degreeToRadian(longitude2 - longitude1);

	let a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(degreeToRadian(latitude1)) *
			Math.cos(degreeToRadian(latitude2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	let c = 2 * Math.asin(Math.sqrt(a));
	let d = earth_radius * c;

	return d;
};
