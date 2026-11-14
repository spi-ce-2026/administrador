import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabBar from "../components/dashboard/TabBar";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import MoreScreen from "../screens/dashboard/MoreScreen";
import PlaceholderScreen from "../screens/dashboard/PlaceholderScreen";
import { dashboardMock } from "../mocks/dashboard/dashboard";
import MentorsScreen from "../screens/mentor/MentorsScreen";

const Tab = createBottomTabNavigator();
const MaisStack = createNativeStackNavigator();

function MaisNavigator() {
  return (
    <MaisStack.Navigator screenOptions={{ headerShown: false }}>
      <MaisStack.Screen name="MaisMenu" component={MoreScreen} />
      <MaisStack.Screen
        name="Vouchers"
        component={PlaceholderScreen}
        initialParams={{ titulo: "Vouchers", voltar: true }}
      />
      <MaisStack.Screen
        name="Tags"
        component={PlaceholderScreen}
        initialParams={{ titulo: "Tags", voltar: true }}
      />
      <MaisStack.Screen
        name="Notificacoes"
        component={PlaceholderScreen}
        initialParams={{ titulo: "Notificações", voltar: true }}
      />
      <MaisStack.Screen
        name="Configuracoes"
        component={PlaceholderScreen}
        initialParams={{ titulo: "Configurações", voltar: true }}
      />
    </MaisStack.Navigator>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Inicio"
        component={DashboardScreen}
        options={{ title: "Início" }}
      />
      <Tab.Screen
        name="Mentores"
        component={MentorsScreen} 
        options={{ tabBarBadge: dashboardMock.mentoresPendentes }}
      />
      <Tab.Screen
        name="Usuarios"
        component={PlaceholderScreen}
        initialParams={{ titulo: "Usuários" }}
        options={{ title: "Usuários" }}
      />
      <Tab.Screen name="Mais" component={MaisNavigator} />
    </Tab.Navigator>
  );
}
