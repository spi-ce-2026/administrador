import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppTabs from './src/navigation/dashboard/AppTabs';
import { ThemeProvider, useTheme } from './src/theme';

function Navegacao() {
  const tema = useTheme();
  const base = tema.modoEscuro ? DarkTheme : DefaultTheme;
  const temaNavegacao = {
    ...base,
    colors: {
      ...base.colors,
      background: tema.fundo,
      card: tema.tabBar,
      primary: tema.tabAtivo,
    },
  };

  return (
    <NavigationContainer theme={temaNavegacao}>
      <AppTabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Navegacao />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}