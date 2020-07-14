import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import { Alert } from "react-native";

export const URL = "http://063569cd652c.ngrok.io/";

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
