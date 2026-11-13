import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export default function StatCard({ icone, corIcone, valor, rotulo }) {
  const tema = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: tema.card }]}>
      <MaterialCommunityIcons name={icone} size={24} color={corIcone ?? tema.icone} />
      <Text style={[styles.valor, { color: tema.texto }]}>{valor}</Text>
      <Text style={[styles.rotulo, { color: tema.textoSecundario }]}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 16, padding: 14, minHeight: 112 },
  valor: { fontSize: 26, fontWeight: '700', marginTop: 10 },
  rotulo: { fontSize: 13, marginTop: 2 },
});