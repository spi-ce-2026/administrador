import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import ThemeToggleButton from '../ThemeToggleButton';

// Cabeçalho roxo usado em todas as telas.
// espacoInferior: aumente (ex.: 64) quando um card fica sobreposto ao header.
export default function AppHeader({ titulo, sobretitulo, subtitulo, onVoltar, espacoInferior = 16, mostrarTema = true, children }) {
  const tema = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { backgroundColor: tema.header, paddingTop: insets.top + 12, paddingBottom: children ? 0 : espacoInferior }]}>
      <View style={styles.linha}>
        <View style={{ flex: 1 }}>
          {sobretitulo ? <Text style={[styles.sobretitulo, { color: tema.headerTexto }]}>{sobretitulo}</Text> : null}
          <View style={styles.tituloLinha}>
            {onVoltar ? (
              <Pressable onPress={onVoltar} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
                <Feather name="arrow-left" size={22} color={tema.headerTexto} />
              </Pressable>
            ) : null}
            <Text style={[styles.titulo, { color: tema.headerTexto }]} accessibilityRole="header">{titulo}</Text>
          </View>
          {subtitulo ? <Text style={[styles.subtitulo, { color: tema.headerTexto }, onVoltar && { marginLeft: 32 }]}>{subtitulo}</Text> : null}
        </View>
        {mostrarTema ? <ThemeToggleButton /> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tituloLinha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sobretitulo: { fontSize: 14, opacity: 0.9 },
  titulo: { fontSize: 24, fontWeight: '700' },
  subtitulo: { fontSize: 13, opacity: 0.85, marginTop: 2 },
});
