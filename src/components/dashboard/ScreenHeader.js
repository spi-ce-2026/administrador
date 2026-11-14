import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export default function ScreenHeader({ titulo, subtitulo, onVoltar }) {
  const tema = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: tema.header }]}>
      {onVoltar ? (
        <Pressable
          onPress={onVoltar}
          hitSlop={12}
          style={styles.voltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={tema.headerTexto} />
        </Pressable>
      ) : null}
      {subtitulo ? (
        <Text style={[styles.subtitulo, { color: tema.headerSubtexto }]}>{subtitulo}</Text>
      ) : null}
      <Text style={[styles.titulo, { color: tema.headerTexto }]}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  voltar: { marginBottom: 8, alignSelf: 'flex-start' },
  subtitulo: { fontSize: 14 },
  titulo: { fontSize: 26, fontWeight: '700', marginTop: 2 },
});