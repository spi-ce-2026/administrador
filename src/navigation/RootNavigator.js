import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { useAuth } from "@mentorias/auth";

import AccountScreen from "../screens/AccountScreen";
import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import MentorsScreen from "../screens/mentor/MentorsScreen";
import RestrictedScreen from "../screens/RestrictedScreen";
import UsersScreen from "../screens/UsersScreen";
import VouchersScreen from "../screens/VouchersScreen";
import { hasRole } from "../utils/roles";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, color, size }) {
	return <MaterialCommunityIcons name={name} color={color} size={size} />;
}

const tabs = [
	{ name: "Inicio", title: "Início", component: DashboardScreen, icon: "view-dashboard" },
	{ name: "Mentores", component: MentorsScreen, icon: "account-check" },
	{ name: "Vouchers", component: VouchersScreen, icon: "ticket-percent" },
	{ name: "Usuarios", title: "Usuários", component: UsersScreen, icon: "account-group" },
	{ name: "Conta", component: AccountScreen, icon: "account-circle" },
];

function AdminTabs() {
	const theme = useTheme();

	return (
		<Tab.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: theme.colors.primary },
				headerTintColor: theme.colors.onPrimary,
				tabBarActiveTintColor: theme.colors.primary,
			}}>
			{tabs.map(tab => (
				<Tab.Screen
					key={tab.name}
					name={tab.name}
					component={tab.component}
					options={{
						title: tab.title ?? tab.name,
						tabBarIcon: ({ color, size }) => <TabIcon name={tab.icon} color={color} size={size} />,
					}}
				/>
			))}
		</Tab.Navigator>
	);
}

// O login aceita qualquer conta Google; só quem tem o papel ADMIN passa da tela de acesso restrito.
export default function RootNavigator() {
	const { isAuthenticated, user } = useAuth();

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{!isAuthenticated ? (
				<Stack.Screen name="Login" component={LoginScreen} />
			) : hasRole(user, "ADMIN") ? (
				<Stack.Screen name="Main" component={AdminTabs} />
			) : (
				<Stack.Screen name="AcessoRestrito" component={RestrictedScreen} />
			)}
		</Stack.Navigator>
	);
}
