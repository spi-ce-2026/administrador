import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

// variante: 'primario' | 'perigo' | 'secundario' | 'contornoPerigo' | 'contornoPrimario'
export default function Botao({ titulo, onPress, variante = 'primario', carregando = false, icone, pequeno = false, style }) {
  const tema = useTheme();
  const v = {
    primario: { bg: tema.primaria, cor: tema.modo === 'escuro' ? '#120826' : '#FFFFFF' },
    perigo: { bg: tema.perigoSolido, cor: '#FFFFFF' },
    secundario: { bg: tema.botaoSecundarioFundo, cor: tema.botaoSecundarioTexto },
    contornoPerigo: { bg: tema.card, cor: tema.perigo, borda: tema.contador },
    contornoPrimario: { bg: 'transparent', cor: tema.primaria, borda: tema.primaria },
  }[variante];

  return (
    <Pressable
      onPress={onPress}
      disabled={carregando}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.botao,
        pequeno && styles.pequeno,
        { backgroundColor: v.bg, borderColor: v.borda || 'transparent', borderWidth: v.borda ? 1.5 : 0, opacity: pressed ? 0.75 : 1 },
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={v.cor} />
      ) : (
        <>
          {icone}
          <Text style={[styles.texto, pequeno && { fontSize: 13 }, { color: v.cor }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: { height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16 },
  pequeno: { height: 36, borderRadius: 10, paddingHorizontal: 12 },
  texto: { fontSize: 15, fontWeight: '600' },
});
