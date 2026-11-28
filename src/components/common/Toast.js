import { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';

// Aviso que some sozinho. Use "acao" para o "Desfazer".
export default function Toast({ mensagem, acao, onAcao, onSumir, duracao = 5000 }) {
  const tema = useTheme();
  const sumirRef = useRef(onSumir);
  sumirRef.current = onSumir;

  useEffect(() => {
    if (!mensagem) return undefined;
    const t = setTimeout(() => sumirRef.current?.(), duracao);
    return () => clearTimeout(t);
  }, [mensagem, duracao]);

  if (!mensagem) return null;

  return (
    <View style={[styles.toast, { backgroundColor: tema.toastFundo }]} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <Feather name="check" size={18} color="#7BE0A6" />
      <Text style={styles.texto}>{mensagem}</Text>
      {acao ? (
        <Pressable onPress={onAcao} hitSlop={10} accessibilityRole="button">
          <Text style={[styles.acao, { color: tema.toastAcao }]}>{acao}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginHorizontal: 16, marginTop: 14 },
  texto: { flex: 1, color: '#FFFFFF', fontSize: 14 },
  acao: { fontWeight: '600', fontSize: 14 },
});
