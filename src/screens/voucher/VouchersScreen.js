import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette, useTheme } from '../theme';
import ScreenHeader from '../components/dashboard/ScreenHeader';
import LoadingSpinner from '../components/dashboard/LoadingSpinner';
import ErrorDisplay from '../components/dashboard/ErrorDisplay';
import AcoesVoucher from '../components/vouchers/AcoesVoucher';
import Aviso from '../components/vouchers/Aviso';
import BottomSheet from '../components/vouchers/BottomSheet';
import CartaoVoucher from '../components/vouchers/CartaoVoucher';
import GerarVoucher from '../components/vouchers/GerarVoucher';
import ValidarVoucher from '../components/vouchers/ValidarVoucher';
import { buscarVouchers } from '../mocks/vouchers/vouchers';
import { ABAS, gerarCodigosUnicos, paraCsv } from '../utils/vouchers';

const FILTROS = [
  { chave: 'all', rotulo: 'Todos' },
  { chave: 'open', rotulo: 'Aberto' },
  { chave: 'restricted', rotulo: 'Restrito' },
];

const MENSAGENS_VAZIO = {
  active: 'Não há vouchers ativos com esse filtro. Toque em Gerar para criar um novo lote.',
  redeemed: 'Nenhum voucher resgatado com esse filtro até o momento.',
  expired: 'Nenhum voucher expirado com esse filtro.',
};

export default function VouchersScreen({ navigation }) {
  const tema = useTheme();
  const [vouchers, setVouchers] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [aba, setAba] = useState('active');
  const [filtro, setFiltro] = useState('all');
  const [sheet, setSheet] = useState(null);
  const [sheetAberto, setSheetAberto] = useState(false);
  const [chaveSheet, setChaveSheet] = useState(0);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      setVouchers(await buscarVouchers());
    } catch {
      setErro('Não foi possível carregar os vouchers.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const contagens = useMemo(
    () =>
      ABAS.reduce(
        (acc, item) => ({ ...acc, [item.chave]: vouchers.filter((v) => v.status === item.chave).length }),
        {}
      ),
    [vouchers]
  );

  const visiveis = useMemo(
    () =>
      vouchers.filter(
        (voucher) => voucher.status === aba && (filtro === 'all' || voucher.type === filtro)
      ),
    [vouchers, aba, filtro]
  );

  const abrirSheet = (conteudo) => {
    setSheet(conteudo);
    setChaveSheet((chave) => chave + 1);
    setSheetAberto(true);
  };

  const fecharSheet = () => setSheetAberto(false);

  const limparAviso = useCallback(() => setAviso(''), []);

  const compartilhar = (voucher) => {
    fecharSheet();
    Share.share({ message: voucher.code }).catch(() => setAviso('Não foi possível compartilhar.'));
  };

  const exportar = () => {
    if (visiveis.length === 0) {
      setAviso('Nenhum voucher para exportar.');
      return;
    }
    Share.share({ title: 'vouchers.csv', message: paraCsv(visiveis) }).catch(() =>
      setAviso('Não foi possível exportar.')
    );
  };

  const gerar = ({ quantidade, type, area, expiresAt }) => {
    const codigos = gerarCodigosUnicos(
      quantidade,
      vouchers.map((voucher) => voucher.code)
    );
    const marca = Date.now();
    const criados = codigos.map((code, indice) => ({
      id: `${marca}-${indice}`,
      code,
      type,
      area,
      status: 'active',
      expiresAt,
      redeemedAt: null,
    }));
    setVouchers((atuais) => [...criados, ...atuais]);
    setAba('active');
    setFiltro('all');
    fecharSheet();
    setAviso(quantidade === 1 ? '1 voucher gerado.' : `${quantidade} vouchers gerados.`);
  };

  const pedirDesativacao = (voucher) => {
    Alert.alert(
      'Desativar voucher?',
      `O código ${voucher.code} deixará de poder ser resgatado. Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: () => {
            setVouchers((atuais) => atuais.filter((item) => item.id !== voucher.id));
            fecharSheet();
            setAviso('Voucher desativado.');
          },
        },
      ]
    );
  };

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

  const acoesHeader = (
    <>
      <Pressable
        onPress={() => abrirSheet({ tipo: 'validar', codigo: '' })}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Validar voucher"
      >
        <MaterialCommunityIcons name="qrcode-scan" size={24} color={tema.headerTexto} />
      </Pressable>
      <Pressable
        onPress={exportar}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Exportar vouchers"
      >
        <MaterialCommunityIcons name="download" size={24} color={tema.headerTexto} />
      </Pressable>
    </>
  );

  return (
    <View style={[styles.tela, { backgroundColor: tema.fundo }]}>
      <ScreenHeader titulo="Vouchers" onVoltar={() => navigation.goBack()} direita={acoesHeader}>
        <View style={styles.abas}>
          {ABAS.map((item) => {
            const ativa = aba === item.chave;
            return (
              <Pressable
                key={item.chave}
                onPress={() => setAba(item.chave)}
                accessibilityRole="tab"
                accessibilityState={{ selected: ativa }}
                style={styles.aba}
              >
                <Text
                  style={[
                    styles.abaTexto,
                    {
                      color: ativa ? tema.headerTexto : tema.headerSubtexto,
                      fontWeight: ativa ? '700' : '500',
                    },
                  ]}
                >
                  {ativa ? `${item.rotulo} · ${contagens[item.chave]}` : item.rotulo}
                </Text>
                <View
                  style={[
                    styles.abaIndicador,
                    { backgroundColor: ativa ? tema.headerTexto : 'transparent' },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </ScreenHeader>

      <View style={styles.filtros}>
        {FILTROS.map((item) => {
          const ativo = filtro === item.chave;
          return (
            <Pressable
              key={item.chave}
              onPress={() => setFiltro(item.chave)}
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}
              style={[
                styles.chip,
                { backgroundColor: ativo ? tema.iconeFundo : tema.card, borderColor: tema.borda },
              ]}
            >
              <Text
                style={[
                  styles.chipTexto,
                  {
                    color: ativo ? tema.icone : tema.textoSecundario,
                    fontWeight: ativo ? '700' : '500',
                  },
                ]}
              >
                {item.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {visiveis.length === 0 ? (
        <View style={styles.vazio}>
          <MaterialCommunityIcons name="ticket-outline" size={48} color={tema.textoSecundario} />
          <Text style={[styles.vazioTitulo, { color: tema.texto }]}>Nenhum voucher</Text>
          <Text style={[styles.vazioTexto, { color: tema.textoSecundario }]}>
            {MENSAGENS_VAZIO[aba]}
          </Text>
        </View>
      ) : (
        <FlatList
          data={visiveis}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <CartaoVoucher
              voucher={item}
              aoAbrirMenu={(voucher) => abrirSheet({ tipo: 'acoes', voucher })}
            />
          )}
        />
      )}

      <Pressable
        onPress={() => abrirSheet({ tipo: 'gerar' })}
        accessibilityRole="button"
        accessibilityLabel="Gerar vouchers"
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
      >
        <MaterialCommunityIcons name="plus" size={22} color="#FFFFFF" />
        <Text style={styles.fabTexto}>Gerar</Text>
      </Pressable>

      <Aviso mensagem={aviso} aoSumir={limparAviso} />

      <BottomSheet visivel={sheetAberto} aoFechar={fecharSheet}>
        {sheet?.tipo === 'gerar' ? <GerarVoucher key={chaveSheet} aoGerar={gerar} /> : null}
        {sheet?.tipo === 'validar' ? (
          <ValidarVoucher
            key={chaveSheet}
            vouchers={vouchers}
            codigoInicial={sheet.codigo}
            aoDesativar={pedirDesativacao}
          />
        ) : null}
        {sheet?.tipo === 'acoes' ? (
          <AcoesVoucher
            key={chaveSheet}
            voucher={sheet.voucher}
            aoValidar={(voucher) => abrirSheet({ tipo: 'validar', codigo: voucher.code })}
            aoCompartilhar={compartilhar}
            aoDesativar={pedirDesativacao}
          />
        ) : null}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  abas: { flexDirection: 'row', gap: 22, marginTop: 14 },
  aba: { paddingTop: 6 },
  abaTexto: { fontSize: 14, paddingBottom: 8 },
  abaIndicador: { height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  filtros: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  chip: { borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 6 },
  chipTexto: { fontSize: 13 },
  lista: { padding: 16, paddingBottom: 100 },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  vazioTitulo: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  vazioTexto: { fontSize: 14, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.primaria,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  fabTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
