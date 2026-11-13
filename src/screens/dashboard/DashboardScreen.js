import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, palette } from '../../theme';
import StatCard from '../../components/dashboard/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import ThemeToggleButton from '../../components/dashboard/ThemeToggleButton';
import { buscarDashboard } from '../../mocks/dashboard/dashboard';

export default function DashboardScreen() {
  const tema = useTheme();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const resposta = await buscarDashboard();
      setDados(resposta);
    } catch (e) {
      setErro('Não foi possível carregar o dashboard.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) return <LoadingSpinner />;

  if (erro) {
    return (
      <ErrorDisplay
        mensagem={erro}
        onTentarNovamente={() => {
          setCarregando(true);
          carregar();
        }}
      />
    );
  }

  const variacao = dados.variacaoMentorias;
  const subiu = variacao >= 0;
  const corTendencia = subiu ? tema.tendencia : '#E5484D';

  return (
    <View style={[styles.tela, { backgroundColor: tema.fundo }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              setAtualizando(true);
              carregar();
            }}
          />
        }
      >
        {/* Cabeçalho roxo */}
        <View style={[styles.header, { backgroundColor: tema.header }]}>
          <View style={styles.headerLinha}>
            <View>
              <Text style={[styles.saudacao, { color: tema.headerSubtexto }]}>Olá, Admin</Text>
              <Text style={[styles.titulo, { color: tema.headerTexto }]}>Dashboard</Text>
            </View>
            <ThemeToggleButton />
          </View>
        </View>

        {/* Card grande: mentorias no mês */}
        <View style={[styles.cardPrincipal, { backgroundColor: tema.card }]}>
          <Text style={[styles.cardPrincipalRotulo, { color: tema.textoSecundario }]}>
            Mentorias realizadas no mês
          </Text>
          <Text style={[styles.cardPrincipalValor, { color: tema.numeroDestaque }]}>
            {dados.mentoriasNoMes}
          </Text>
          <View style={styles.tendencia}>
            <MaterialCommunityIcons
              name={subiu ? 'trending-up' : 'trending-down'}
              size={18}
              color={corTendencia}
            />
            <Text style={[styles.tendenciaTexto, { color: corTendencia }]}>
              {subiu ? '+' : ''}
              {variacao}% vs. mês anterior
            </Text>
          </View>
        </View>

        {/* Grade 2x2 */}
        <View style={styles.grade}>
          <View style={styles.linha}>
            <StatCard
              icone="account-plus-outline"
              valor={dados.novosCadastros}
              rotulo="Novos cadastros"
            />
            <StatCard
              icone="clock-outline"
              corIcone={palette.alerta}
              valor={dados.mentoriasPendentes}
              rotulo="Mentorias pend."
            />
          </View>
          <View style={styles.linha}>
            <StatCard
              icone="account-check-outline"
              corIcone={palette.alerta}
              valor={dados.mentoresPendentes}
              rotulo="Mentores pend."
            />
            <StatCard
              icone="ticket-outline"
              valor={dados.vouchersAtivos}
              rotulo="Vouchers ativos"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { paddingBottom: 24 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 70 },
  headerLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saudacao: { fontSize: 14 },
  titulo: { fontSize: 26, fontWeight: '700', marginTop: 2 },
  cardPrincipal: {
    marginHorizontal: 16,
    marginTop: -50,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardPrincipalRotulo: { fontSize: 14 },
  cardPrincipalValor: { fontSize: 44, fontWeight: '800', marginTop: 4 },
  tendencia: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  tendenciaTexto: { fontSize: 14, fontWeight: '500' },
  grade: { padding: 16, gap: 12 },
  linha: { flexDirection: 'row', gap: 12 },
});