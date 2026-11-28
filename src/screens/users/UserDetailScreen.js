import { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import Avatar from '../../components/common/Avatar';
import StatusPill from '../../components/common/StatusPill';
import Botao from '../../components/common/Botao';
import SuspendSheet from '../../components/users/SuspendSheet';
import { suspenderUsuario } from '../../services/usersService';
import { dataCurta, mesAno, rotuloPapel } from '../../utils/format';

// Passo 3 do fluxo: abre o usuário e mostra o botão "Suspender".
export default function UserDetailScreen({ navigation, route }) {
  const tema = useTheme();
  const { usuario } = route.params;
  const [confirmando, setConfirmando] = useState(false);

  async function suspender(dados) {
    try {
      await suspenderUsuario(usuario.id, dados);
      setConfirmando(false);
      const params = { usuarioSuspenso: { id: usuario.id, nome: usuario.nome } };
      // React Navigation 7 usa popTo; versões anteriores, navigate.
      if (navigation.popTo) navigation.popTo('UsersList', params);
      else navigation.navigate('UsersList', params);
    } catch (e) {
      Alert.alert('Não foi possível suspender', e.message);
    }
  }

  const Estatistica = ({ valor, rotulo, cor }) => (
    <View style={[styles.stat, { backgroundColor: tema.card }]}>
      <Text style={[styles.statValor, { color: cor || tema.texto }]}>{valor}</Text>
      <Text style={{ color: tema.textoSuave, fontSize: 12 }}>{rotulo}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: tema.fundo }}>
      {/* O header fica dentro do ScrollView para o card de perfil poder sobrepor o roxo. */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <AppHeader titulo="Usuário" onVoltar={() => navigation.goBack()} espacoInferior={64} />
        <View style={[styles.perfil, { backgroundColor: tema.card }]}>
          <Avatar nome={usuario.nome} tamanho={64} />
          <Text style={[styles.nome, { color: tema.texto }]}>{usuario.nome}</Text>
          <Text style={{ color: tema.textoSuave, fontSize: 13, marginTop: 2 }}>
            {usuario.email} · {rotuloPapel(usuario.papel)}
          </Text>
          <View style={{ marginTop: 10 }}>
            <StatusPill status={usuario.status} />
          </View>
        </View>

        <View style={styles.stats}>
          <Estatistica valor={usuario.mentorias} rotulo="Mentorias" cor={tema.primaria} />
          <Estatistica valor={usuario.noShows} rotulo="No-shows" cor={usuario.noShows > 0 ? tema.perigo : undefined} />
          <Estatistica valor={mesAno(usuario.criadoEm)} rotulo="Cadastro" />
        </View>

        <Text style={[styles.secao, { color: tema.primaria }]}>HISTÓRICO RECENTE</Text>
        <View style={[styles.historico, { backgroundColor: tema.card }]}>
          {usuario.historico?.length ? (
            usuario.historico.map((h, i) => {
              const falta = h.status === 'NO_SHOW';
              return (
                <View key={h.id} style={[styles.itemHist, i > 0 && { borderTopWidth: 1, borderTopColor: tema.divisor }]}>
                  <View style={[styles.ponto, { backgroundColor: falta ? tema.contador : '#2E9E5B' }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: tema.texto, fontSize: 14, fontWeight: '500' }}>Mentoria com {h.mentor}</Text>
                    <Text style={{ color: tema.textoSuave, fontSize: 12 }}>{dataCurta(h.data)} · {h.tema}</Text>
                  </View>
                  <Text style={{ color: falta ? tema.perigo : tema.sucesso, fontSize: 12, fontWeight: '600' }}>{falta ? 'No-show' : 'Realizada'}</Text>
                </View>
              );
            })
          ) : (
            <Text style={{ color: tema.textoSuave, fontSize: 13, padding: 14 }}>Nenhuma mentoria ainda.</Text>
          )}
        </View>
      </ScrollView>

      {usuario.status === 'ACTIVE' ? (
        <View style={[styles.rodape, { backgroundColor: tema.fundo }]}>
          <Botao
            titulo="Suspender usuário"
            variante="contornoPerigo"
            icone={<Feather name="slash" size={18} color={tema.perigo} />}
            onPress={() => setConfirmando(true)}
          />
        </View>
      ) : null}

      <SuspendSheet visivel={confirmando} usuario={usuario} onFechar={() => setConfirmando(false)} onConfirmar={suspender} />
    </View>
  );
}

const styles = StyleSheet.create({
  perfil: { marginTop: -48, marginHorizontal: 16, borderRadius: 16, padding: 20, alignItems: 'center' },
  nome: { fontSize: 19, fontWeight: '700', marginTop: 10 },
  stats: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 12 },
  stat: { flex: 1, borderRadius: 14, padding: 12 },
  statValor: { fontSize: 22, fontWeight: '700' },
  secao: { fontSize: 12, fontWeight: '700', letterSpacing: 0.7, marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  historico: { marginHorizontal: 16, borderRadius: 14 },
  itemHist: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  ponto: { width: 8, height: 8, borderRadius: 4 },
  rodape: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingVertical: 12 },
});
