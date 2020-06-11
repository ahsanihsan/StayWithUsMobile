import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./components/HomeScreen/HomeScreen";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import Signin from "./components/user-auth/Signin";
import Signup from "./components/user-auth/Signup";
import Profile from "./components/User-Profile/Profile";
// import AddApartment from "./components/Apartments/Apartments";
import AddApartment from "./components/AddApartment";
import Details from "./components/Apartment_Detail/Details";
const HomeStack = createStackNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const HomeTabs = createBottomTabNavigator();
import Alert from "./Alert";
import EditApartment from "./components/EditApartment";

const Auth = () => (
	<AuthStack.Navigator headerMode="none">
		<AuthStack.Screen name="signin" component={Signin} />
		<AuthStack.Screen name="signup" component={Signup} />
	</AuthStack.Navigator>
);

const HomeScreenStack = ({ navigation }) => (
	<HomeStack.Navigator>
		<HomeStack.Screen
			name="Home"
			component={HomeScreen}
			options={{
				headerShown: false,
			}}
		/>
		<HomeStack.Screen
			name="Details"
			component={Details}
			options={({ route }) => ({
				headerShown: false,
			})}
		/>
		<HomeStack.Screen
			name="AddApartment"
			component={AddApartment}
			options={({ route }) => ({
				headerShown: false,
			})}
		/>
		<HomeStack.Screen
			name="EditApartment"
			component={EditApartment}
			options={({ route }) => ({
				headerShown: false,
			})}
		/>
	</HomeStack.Navigator>
);

const HomeTabsScreen = () => (
	<HomeTabs.Navigator
		tabBarOptions={{
			tabStyle: {},
			activeTintColor: "#474787",
			inactiveTintColor: "gray",
		}}
		initialRouteName="Home"
	>
		<HomeTabs.Screen
			name="HomeScreen"
			component={HomeScreenStack}
			options={{
				tabBarLabel: "Home",

				tabBarIcon: ({ focused, color }) => (
					<MaterialCommunityIcons
						name={focused ? "view-dashboard" : "view-dashboard-outline"}
						size={26}
						color={color}
					/>
				),
			}}
		/>
		{/* <HomeTabs.Screen
			name="Apartments"
			component={Apartments}
			options={{
				tabBarIcon: ({ focused, color }) => (
					<MaterialCommunityIcons
						name={focused ? "shield-home" : "home-city-outline"}
						color={color}
						size={26}
					/>
				),
			}}
		/> */}
		<HomeTabs.Screen
			name="Profile"
			component={Profile}
			options={{
				tabBarIcon: ({ focused, color }) => (
					<FontAwesome5
						name={focused ? "user-ninja" : "users-cog"}
						size={26}
						color={color}
					/>
				),
			}}
		/>
	</HomeTabs.Navigator>
);

const RootStackScreen = () => {
	const [user, setUser] = React.useState({});
	return (
		<RootStack.Navigator headerMode="none">
			<RootStack.Screen name="auth" component={Auth} />
			<RootStack.Screen name="app" component={HomeTabsScreen} />
			<RootStack.Screen
				name="alert"
				component={Alert}
				options={{
					animationEnabled: true,
					cardStyle: { backgroundColor: "rgba(0,0,0,0.15)" },
					cardOverlayEnabled: true,
				}}
			/>
		</RootStack.Navigator>
	);
};

const App = () => {
	return (
		<NavigationContainer>
			<RootStackScreen />
		</NavigationContainer>
	);
};

export default App;
