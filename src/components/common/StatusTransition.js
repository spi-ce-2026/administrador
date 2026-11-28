import { View, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';

// Mostra "ACTIVE → SUSPENDED" ou o contrário.
export default function StatusTransition({ de, para }) {
  const tema = useTheme();
  const cor = (s) => (s === 'SUSPENDED' ? tema.perigo : tema.sucesso);
  return (
    <View style={[styles.caixa, { backgroundColor: tema.fundo }]} accessibilityLabel={`Status: ${de} para ${para}`}>
      <Text style={[styles.texto, { color: cor(de) }]}>{de}</Text>
      <Feather name="arrow-right" size={16} color={tema.textoSuave} />
      <Text style={[styles.texto, { color: cor(para) }]}>{para}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 12, padding: 10 },
  texto: { fontWeight: '700', fontSize: 13, fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) },
});
