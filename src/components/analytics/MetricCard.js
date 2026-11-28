import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import Pill from '../common/Pill';
import TrendBars from './TrendBars';
import { formatarValor, formatarMeta, formatarVariacao, variacaoPositiva } from '../../utils/metrics';

// Card de uma métrica na tela de Analytics.
export default function MetricCard({ metrica, dado, link, onLink }) {
  const tema = useTheme();
  const positiva = variacaoPositiva(dado.variacao, metrica);

  return (
    <View style={[styles.card, { backgroundColor: tema.card }]}>
      <View style={styles.topo}>
        <Text style={[styles.nome, { color: tema.texto }]}>{metrica.nome}</Text>
        <Text style={{ color: tema.textoSuave, fontSize: 11 }}>Meta {formatarMeta(dado.meta, metrica)}</Text>
      </View>

      <View style={styles.meio}>
        <View style={{ flex: 1 }}>
          <View style={styles.valorLinha}>
            <Text style={[styles.valor, { color: tema.primaria }]}>{formatarValor(dado.valor, metrica.formato)}</Text>
            <Pill texto={formatarVariacao(dado.variacao, metrica.formato)} tipo={positiva ? 'sucesso' : 'perigo'} />
          </View>
          <Text style={{ color: tema.textoSuave, fontSize: 12, marginTop: 2 }}>{metrica.descricao}</Text>
        </View>
        <TrendBars valores={dado.historico} />
      </View>

      {link ? (
        <Pressable onPress={onLink} accessibilityRole="link" style={[styles.link, { borderTopColor: tema.divisor }]}>
          <Text style={{ color: tema.primaria, fontSize: 13, fontWeight: '600' }}>{link}</Text>
          <Feather name="chevron-right" size={16} color={tema.primaria} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  nome: { fontSize: 14, fontWeight: '600' },
  meio: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 4 },
  valorLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  valor: { fontSize: 28, fontWeight: '700' },
  link: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1 },
});
