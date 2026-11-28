import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import Pill from '../common/Pill';
import { METRICAS, formatarValor, dentroDaMeta, rotuloStatusMeta } from '../../utils/metrics';

// "Saúde do programa" no dashboard (opção C2: grid 2×2 com status).
export default function ProgramHealth({ analytics, onVerAnalytics }) {
  const tema = useTheme();
  if (!analytics) return null;

  return (
    <View style={styles.secao}>
      <View style={styles.cabecalho}>
        <Text style={[styles.titulo, { color: tema.primaria }]}>SAÚDE DO PROGRAMA · {analytics.rotulo.toUpperCase()}</Text>
        <Pressable onPress={onVerAnalytics} hitSlop={10} accessibilityRole="link" style={styles.link}>
          <Text style={{ color: tema.primaria, fontSize: 13, fontWeight: '600' }}>Ver analytics</Text>
          <Feather name="chevron-right" size={14} color={tema.primaria} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {METRICAS.map((m) => {
          const dado = analytics.metricas[m.chave];
          if (!dado) return null;
          const ok = dentroDaMeta(dado.valor, dado.meta, m);
          const valor = formatarValor(dado.valor, m.formato);
          const status = rotuloStatusMeta(dado.valor, dado.meta, m);
          return (
            <Pressable
              key={m.chave}
              onPress={onVerAnalytics}
              accessibilityRole="button"
              accessibilityLabel={`${m.nome}: ${valor}, ${status}`}
              style={({ pressed }) => [styles.card, { backgroundColor: tema.card, opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={{ color: tema.textoSuave, fontSize: 12 }} numberOfLines={1}>{m.nome}</Text>
              <View style={styles.linha}>
                <Text style={[styles.valor, { color: tema.texto }]}>{valor}</Text>
                <Pill texto={status} tipo={ok ? 'sucesso' : 'perigo'} pequeno />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  secao: { marginHorizontal: 16, marginTop: 16 },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 12, fontWeight: '700', letterSpacing: 0.7 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  card: { width: '48%', flexGrow: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 2 },
  valor: { fontSize: 20, fontWeight: '700' },
});
