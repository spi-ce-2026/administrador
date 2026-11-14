import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export default function ErrorDisplay({ mensagem, onTentarNovamente }) {
  const tema = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: tema.fundo }]}>
      <MaterialCommunityIcons name="alert-circle-outline" size={48} color={tema.textoSecundario} />
      <Text style={[styles.mensagem, { color: tema.texto }]}>{mensagem}</Text>
      {onTentarNovamente && (
        <Pressable
          style={[styles.botao, { backgroundColor: tema.header }]}
          onPress={onTentarNovamente}
        >
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  mensagem: { fontSize: 16, textAlign: 'center', marginTop: 12 },
  botao: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  botaoTexto: { color: '#FFFFFF', fontWeight: '600' },
});