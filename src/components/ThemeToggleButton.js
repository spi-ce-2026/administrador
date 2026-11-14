import { Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useThemeControls } from '../theme';

export default function ThemeToggleButton() {
  const tema = useTheme();
  const { modoEscuro, alternarTema } = useThemeControls();

  return (
    <Pressable
      onPress={alternarTema}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={modoEscuro ? 'Ativar tema claro' : 'Ativar tema escuro'}
      style={({ pressed }) => [styles.botao, pressed && { opacity: 0.6 }]}
    >
      <MaterialCommunityIcons
        name={modoEscuro ? 'white-balance-sunny' : 'weather-night'}
        size={22}
        color={tema.headerTexto}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});