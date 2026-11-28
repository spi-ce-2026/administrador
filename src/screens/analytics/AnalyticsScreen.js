import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import MetricCard from '../../components/analytics/MetricCard';
import { Carregando, Erro } from '../../components/common/Estados';
import { buscarDashboard } from '../../services/dashboardService';
import { METRICAS } from '../../utils/metrics';

const PERIODOS = [
  { id: 'month', rotulo: 'Mês' },
  { id: 'quarter', rotulo: 'Trimestre' },
  { id: 'year', rotulo: 'Ano' },
];

// Usa o mesmo GET /admin/dashboard, com ?period=. Confirme com o back-end
// se ele aceita o período e devolve o "historico" de cada métrica.
export default function AnalyticsScreen({ navigation }) {
  const tema = useTheme();
  const [periodo, setPeriodo] = useState('month');
  const [analytics, setAnalytics] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  async function carregar(p = periodo) {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await buscarDashboard({ periodo: p });
      setAnalytics(dados.analytics);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar(periodo);
  }, [periodo]);

  const verNoShow = () => navigation.navigate('Usuarios', { screen: 'UsersList', params: { filtro: 'noshow' } });

  return (
    <View style={{ flex: 1, backgroundColor: tema.fundo }}>
      <AppHeader
        titulo="Analytics"
        subtitulo="Desempenho do programa"
        onVoltar={navigation.canGoBack() ? () => navigation.goBack() : undefined}
      >
        <View style={styles.segmento} accessibilityRole="tablist">
          {PERIODOS.map((p) => {
            const ativo = p.id === periodo;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPeriodo(p.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: ativo }}
                style={[styles.opcao, ativo && { backgroundColor: tema.card }]}
              >
                <Text style={{ color: ativo ? tema.primaria : tema.headerTexto, fontWeight: ativo ? '600' : '400', fontSize: 13 }}>{p.rotulo}</Text>
              </Pressable>
            );
          })}
        </View>
      </AppHeader>

      {carregando && !analytics ? (
        <Carregando />
      ) : erro ? (
        <Erro mensagem={erro} onTentarDeNovo={() => carregar()} />
      ) : (
        <ScrollView contentContainerStyle={[styles.lista, carregando && { opacity: 0.5 }]}>
          {METRICAS.map((m) =>
            analytics.metricas[m.chave] ? (
              <MetricCard
                key={m.chave}
                metrica={m}
                dado={analytics.metricas[m.chave]}
                link={m.chave === 'taxaNoShow' ? 'Ver usuários com no-show' : undefined}
                onLink={verNoShow}
              />
            ) : null
          )}
          <Text style={{ color: tema.textoSuave, fontSize: 11, textAlign: 'center' }}>{analytics.rotuloHistorico}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  segmento: { flexDirection: 'row', gap: 4, marginTop: 14, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 10, padding: 4 },
  opcao: { flex: 1, height: 32, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  lista: { padding: 16, gap: 10 },
});
