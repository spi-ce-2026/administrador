import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme';
import AppHeader from '../components/common/AppHeader';
import Toast from '../components/common/Toast';
import UserCard from '../components/users/UserCard';
import SuspendedUserCard from '../components/users/SuspendedUserCard';
import ReactivateSheet from '../components/users/ReactivateSheet';
import { Carregando, Erro, Vazio } from '../components/common/Estados';
import { listarUsuarios, reativarUsuario } from '../services/usersService';

const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'mentorados', rotulo: 'Mentorados' },
  { id: 'noshow', rotulo: 'Com no-show' },
];

// Usuários → Listar (aba Ativos) e Usuários → Suspensos.
// Recebe params opcionais:
//   usuarioSuspenso: { id, nome }  -> vindo do detalhe, abre "Suspensos" com aviso
//   filtro: 'noshow'               -> vindo do Analytics
export default function UsersScreen({ navigation, route }) {
  const tema = useTheme();
  const [aba, setAba] = useState('ACTIVE');
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [ativos, setAtivos] = useState([]);
  const [suspensos, setSuspensos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);
  const [toast, setToast] = useState(null); // { mensagem, usuarioId }
  const [paraReativar, setParaReativar] = useState(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const [a, s] = await Promise.all([listarUsuarios({ status: 'ACTIVE' }), listarUsuarios({ status: 'SUSPENDED' })]);
      setAtivos(a);
      setSuspensos(s);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  // Recarrega sempre que a tela volta a ficar visível (ex.: depois de suspender).
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  useEffect(() => {
    const p = route.params;
    if (!p) return;
    if (p.usuarioSuspenso) {
      setAba('SUSPENDED');
      setToast({ mensagem: `${p.usuarioSuspenso.nome} foi suspenso`, usuarioId: p.usuarioSuspenso.id });
    }
    if (p.filtro) {
      setAba('ACTIVE');
      setFiltro(p.filtro);
    }
    if (p.usuarioSuspenso || p.filtro) {
      navigation.setParams({ usuarioSuspenso: undefined, filtro: undefined });
    }
  }, [route.params, navigation]);

  const termo = busca.trim().toLowerCase();
  const casaBusca = (u) => !termo || u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo);

  const listaAtivos = useMemo(
    () =>
      ativos.filter(casaBusca).filter((u) => {
        if (filtro === 'mentorados') return u.papel === 'MENTORADO';
        if (filtro === 'noshow') return u.noShows > 0;
        return true;
      }),
    [ativos, termo, filtro]
  );
  const listaSuspensos = useMemo(() => suspensos.filter(casaBusca), [suspensos, termo]);
  const totalNoShow = ativos.filter((u) => u.noShows > 0).length;

  async function desfazer() {
    const id = toast?.usuarioId;
    setToast(null);
    if (!id) return;
    await reativarUsuario(id);
    carregar();
  }

  async function confirmarReativacao() {
    try {
      await reativarUsuario(paraReativar.id);
      setToast({ mensagem: `${paraReativar.nome} foi reativado` });
      setParaReativar(null);
      carregar();
    } catch (e) {
      setToast({ mensagem: `Não foi possível reativar: ${e.message}` });
    }
  }

  const Aba = ({ id, rotulo, total }) => {
    const ativa = aba === id;
    return (
      <Pressable
        onPress={() => setAba(id)}
        accessibilityRole="tab"
        accessibilityState={{ selected: ativa }}
        style={[styles.aba, { borderBottomColor: ativa ? tema.headerTexto : 'transparent' }]}
      >
        <Text style={{ color: ativa ? tema.headerTexto : tema.headerTextoSuave, fontWeight: ativa ? '600' : '400', fontSize: 14 }}>
          {rotulo} · {total}
        </Text>
      </Pressable>
    );
  };

  const dados = aba === 'ACTIVE' ? listaAtivos : listaSuspensos;

  return (
    <View style={{ flex: 1, backgroundColor: tema.fundo }}>
      <AppHeader titulo="Usuários" sobretitulo={`${ativos.length + suspensos.length} cadastrados`}>
        <View style={styles.abas} accessibilityRole="tablist">
          <Aba id="ACTIVE" rotulo="Ativos" total={ativos.length} />
          <Aba id="SUSPENDED" rotulo="Suspensos" total={suspensos.length} />
        </View>
      </AppHeader>

      <Toast mensagem={toast?.mensagem} acao={toast?.usuarioId ? 'Desfazer' : undefined} onAcao={desfazer} onSumir={() => setToast(null)} />

      <View style={styles.topo}>
        <View style={[styles.busca, { backgroundColor: tema.card, borderColor: tema.borda }]}>
          <Feather name="search" size={18} color={tema.textoSuave} />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder={aba === 'ACTIVE' ? 'Buscar por nome ou e-mail' : 'Buscar entre suspensos'}
            placeholderTextColor={tema.textoSuave}
            accessibilityLabel="Buscar usuário"
            style={[styles.input, { color: tema.texto }]}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {busca ? (
            <Pressable onPress={() => setBusca('')} hitSlop={10} accessibilityLabel="Limpar busca">
              <Feather name="x" size={18} color={tema.textoSuave} />
            </Pressable>
          ) : null}
        </View>

        {aba === 'ACTIVE' ? (
          <View style={styles.chips}>
            {FILTROS.map((f) => {
              const ativo = filtro === f.id;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => setFiltro(f.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: ativo }}
                  style={[
                    styles.chip,
                    ativo ? { backgroundColor: tema.chipAtivoFundo, borderColor: tema.chipAtivoFundo } : { backgroundColor: tema.card, borderColor: tema.borda },
                  ]}
                >
                  <Text style={{ color: ativo ? tema.chipAtivoTexto : tema.botaoSecundarioTexto, fontWeight: ativo ? '600' : '400', fontSize: 13 }}>{f.rotulo}</Text>
                  {f.id === 'noshow' && totalNoShow > 0 ? (
                    <Text style={[styles.contador, { color: tema.perigo, backgroundColor: tema.perigoFundo }]}>{totalNoShow}</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      {carregando ? (
        <Carregando />
      ) : erro ? (
        <Erro mensagem={erro} onTentarDeNovo={carregar} />
      ) : (
        <FlatList
          data={dados}
          keyExtractor={(u) => u.id}
          contentContainerStyle={styles.lista}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={() => { setAtualizando(true); carregar(); }} tintColor={tema.primaria} />
          }
          ListEmptyComponent={<Vazio texto={aba === 'ACTIVE' ? 'Nenhum usuário encontrado.' : 'Nenhum usuário suspenso.'} />}
          renderItem={({ item }) =>
            aba === 'ACTIVE' ? (
              <UserCard usuario={item} onPress={() => navigation.navigate('UserDetail', { usuario: item })} />
            ) : (
              <SuspendedUserCard usuario={item} onReativar={() => setParaReativar(item)} />
            )
          }
        />
      )}

      <ReactivateSheet
        visivel={!!paraReativar}
        usuario={paraReativar}
        onFechar={() => setParaReativar(null)}
        onConfirmar={confirmarReativacao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  abas: { flexDirection: 'row', gap: 24, marginTop: 16 },
  aba: { paddingBottom: 10, borderBottomWidth: 3 },
  topo: { paddingHorizontal: 16, paddingTop: 14, gap: 12 },
  busca: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 46 },
  input: { flex: 1, fontSize: 14, height: '100%' },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  contador: { fontSize: 12, fontWeight: '700', borderRadius: 999, paddingHorizontal: 6, overflow: 'hidden' },
  lista: { padding: 16, paddingTop: 14, flexGrow: 1 },
});
