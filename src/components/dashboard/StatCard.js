import { Pressable, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

// Card do grid 2×2. onPress é opcional: quando passado, o card vira atalho
// (sugestão do documento de navegação); sem ele, se comporta como antes.
export default function StatCard({ icone, corIcone, valor, rotulo, onPress }) {
  const tema = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${valor} ${rotulo}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: tema.card, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <MaterialCommunityIcons name={icone} size={24} color={corIcone ?? tema.icone} />
      <Text style={[styles.valor, { color: tema.texto }]}>{valor}</Text>
      <Text style={[styles.rotulo, { color: tema.textoSecundario }]}>{rotulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 16, padding: 14, minHeight: 112 },
  valor: { fontSize: 26, fontWeight: '700', marginTop: 10 },
  rotulo: { fontSize: 13, marginTop: 2 },
});
