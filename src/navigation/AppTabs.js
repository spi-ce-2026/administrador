import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabBar from "../components/dashboard/TabBar";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import MoreScreen from "../screens/dashboard/MoreScreen";
import PlaceholderScreen from "../screens/dashboard/PlaceholderScreen";
import { dashboardMock } from "../mocks/dashboard/dashboard";
import MentorsScreen from "../screens/mentor/MentorsScreen";
import VouchersScreen from "../screens/voucher/VouchersScreen"; // Corrigido aqui!
import TagsScreen from "../screens/tags/TagsScreen";
import UsersScreen from "../screens/UsersScreen";
import UserDetailScreen from "../screens/users/UserDetailScreen";
import AnalyticsScreen from "../screens/analytics/AnalyticsScreen";

const Tab = createBottomTabNavigator();
const MaisStack = createNativeStackNavigator();
const UsuariosStack = createNativeStackNavigator();
const InicioStack = createNativeStackNavigator();

// Início: Dashboard → Analytics
function InicioNavigator() {
  return (
    <InicioStack.Navigator screenOptions={{ headerShown: false }}>
      <InicioStack.Screen name="Dashboard" component={DashboardScreen} />
      <InicioStack.Screen name="Analytics" component={AnalyticsScreen} />
    </InicioStack.Navigator>
  );
}

// Usuários: Lista → Detalhe
function UsuariosNavigator() {
  return (
    <UsuariosStack.Navigator screenOptions={{ headerShown: false }}>
      <UsuariosStack.Screen name="UsersList" component={UsersScreen} />
      <UsuariosStack.Screen name="UserDetail" component={UserDetailScreen} />
    </UsuariosStack.Navigator>
  );
}

function MaisNavigator() {
  return (
    <MaisStack.Navigator screenOptions={{ headerShown: false }}>
      <MaisStack.Screen name="MaisMenu" component={MoreScreen} />
      <MaisStack.Screen name="Analytics" component={AnalyticsScreen} />
      <MaisStack.Screen
        name="Vouchers"
        component={VouchersScreen}
      />
      <MaisStack.Screen
        name="Tags"
        component={TagsScreen}
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
        component={InicioNavigator}
        options={{ title: "Início" }}
      />
      <Tab.Screen
        name="Mentores"
        component={MentorsScreen}
        options={{ tabBarBadge: dashboardMock.mentoresPendentes }}
      />
      <Tab.Screen
        name="Usuarios"
        component={UsuariosNavigator}
        options={{ title: "Usuários" }}
      />
      <Tab.Screen name="Mais" component={MaisNavigator} />
    </Tab.Navigator>
  );
}
