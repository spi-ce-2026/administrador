import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import Botao from './Botao';

// Se preferir, troque pelos seus LoadingSpinner, ErrorDisplay e EmptyState.
export function Carregando() {
  const tema = useTheme();
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={tema.primaria} />
    </View>
  );
}

export function Erro({ mensagem, onTentarDeNovo }) {
  const tema = useTheme();
  return (
    <View style={styles.centro}>
      <Text style={[styles.texto, { color: tema.texto }]}>{mensagem || 'Algo deu errado.'}</Text>
      <Botao titulo="Tentar de novo" variante="secundario" pequeno onPress={onTentarDeNovo} />
    </View>
  );
}

export function Vazio({ texto }) {
  const tema = useTheme();
  return (
    <View style={[styles.centro, { paddingVertical: 48 }]}>
      <Text style={[styles.texto, { color: tema.textoSuave }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  texto: { fontSize: 14, textAlign: 'center' },
});
