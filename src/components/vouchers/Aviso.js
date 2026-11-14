import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export default function Aviso({ mensagem, aoSumir }) {
  const tema = useTheme();

  useEffect(() => {
    if (!mensagem) return undefined;
    const temporizador = setTimeout(aoSumir, 3000);
    return () => clearTimeout(temporizador);
  }, [mensagem, aoSumir]);

  if (!mensagem) return null;

  return (
    <View pointerEvents="none" style={[styles.caixa, { backgroundColor: tema.texto }]}>
      <Text style={[styles.texto, { color: tema.fundo }]}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 84,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  texto: { fontSize: 14, fontWeight: '500' },
});
