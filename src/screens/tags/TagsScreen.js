import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, useTheme, useThemeControls } from '../../theme';
import ScreenHeader from '../../components/dashboard/ScreenHeader';

const MOCK_TAGS = [
  {
    id: '1',
    nome: 'Marketing Digital',
    mentoresCount: 12,
    matchesMes: 38,
    categoria: 'Marketing',
    descricao: 'Estratégias de aquisição e crescimento em canais online.',
    mentores: [
      { id: 'm1', iniciais: 'CF', nome: 'Carla Freitas' },
      { id: 'm2', iniciais: 'JM', nome: 'Julia Melo' },
    ],
  },
  {
    id: '2',
    nome: 'Branding',
    mentoresCount: 5,
    matchesMes: 14,
    categoria: 'Marketing',
    descricao: 'Posicionamento, identidade verbal e gestão de marca.',
    mentores: [
      { id: 'm3', iniciais: 'RA', nome: 'Rafael Almeida' },
      { id: 'm4', iniciais: 'LS', nome: 'Larissa Souza' },
    ],
  },
  {
    id: '3',
    nome: 'SEO',
    mentoresCount: 3,
    matchesMes: 9,
    categoria: 'Marketing',
    descricao: 'Otimização orgânica para mecanismos de busca.',
    mentores: [{ id: 'm5', iniciais: 'BM', nome: 'Bruno Martins' }],
  },
  {
    id: '4',
    nome: 'Growth',
    mentoresCount: 7,
    matchesMes: 21,
    categoria: 'Marketing',
    descricao: 'Experimentação rápida focada em aquisição e retenção.',
    mentores: [
      { id: 'm6', iniciais: 'TP', nome: 'Thiago Pereira' },
      { id: 'm7', iniciais: 'AC', nome: 'Amanda Costa' },
    ],
  },
  {
    id: '5',
    nome: 'Back-end',
    mentoresCount: 8,
    matchesMes: 27,
    categoria: 'Tecnologia',
    descricao: 'Arquitetura de APIs, bancos de dados e microsserviços.',
    mentores: [
      { id: 'm8', iniciais: 'GS', nome: 'Gabriel Silva' },
      { id: 'm9', iniciais: 'LC', nome: 'Lucas Carvalho' },
    ],
  },
  {
    id: '6',
    nome: 'Mobile',
    mentoresCount: 4,
    matchesMes: 11,
    categoria: 'Tecnologia',
    descricao: 'Desenvolvimento de aplicativos nativos e multiplataforma.',
    mentores: [{ id: 'm10', iniciais: 'MR', nome: 'Mariana Rocha' }],
  },
  {
    id: '7',
    nome: 'UX/UI',
    mentoresCount: 0,
    matchesMes: 0,
    categoria: 'Tecnologia',
    descricao: 'Pesquisa com usuários, prototipação e design de interfaces.',
    mentores: [],
  },
  {
    id: '8',
    nome: 'Dados',
    mentoresCount: 6,
    matchesMes: 19,
    categoria: 'Tecnologia',
    descricao: 'Análise de dados, BI e engenharia de pipelines.',
    mentores: [
      { id: 'm11', iniciais: 'FN', nome: 'Fernanda Nogueira' },
      { id: 'm12', iniciais: 'PH', nome: 'Pedro Henrique' },
    ],
  },
  {
    id: '9',
    nome: 'Finanças',
    mentoresCount: 9,
    matchesMes: 24,
    categoria: 'Negócios',
    descricao: 'Planejamento financeiro, valuation e fluxo de caixa.',
    mentores: [
      { id: 'm13', iniciais: 'RL', nome: 'Renata Lima' },
      { id: 'm14', iniciais: 'DM', nome: 'Diego Mendes' },
    ],
  },
  {
    id: '10',
    nome: 'Vendas B2B',
    mentoresCount: 2,
    matchesMes: 6,
    categoria: 'Negócios',
    descricao: 'Prospecção outbound, negociação e fechamento corporativo.',
    mentores: [{ id: 'm15', iniciais: 'CA', nome: 'Camila Araújo' }],
  },
  {
    id: '11',
    nome: 'Captação',
    mentoresCount: 5,
    matchesMes: 15,
    categoria: 'Negócios',
    descricao: 'Pitch, relacionamento com investidores e rodadas.',
    mentores: [
      { id: 'm16', iniciais: 'VR', nome: 'Vinícius Ribeiro' },
      { id: 'm17', iniciais: 'SB', nome: 'Sofia Barros' },
    ],
  },
];

const CATEGORIAS_INICIAIS = ['Marketing', 'Tecnologia', 'Negócios'];

export default function TagsScreen({ navigation }) {
  const [tags, setTags] = useState(MOCK_TAGS);
  const [categorias, setCategorias] = useState(CATEGORIAS_INICIAIS);
  const [busca, setBusca] = useState('');

  const [modalGavetaVisivel, setModalGavetaVisivel] = useState(false);
  const [tagEmEdicao, setTagEmEdicao] = useState(null);
  const [nomeTag, setNomeTag] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Marketing');
  const [descricaoTag, setDescricaoTag] = useState('');
  const [criandoCategoria, setCriandoCategoria] = useState(false);
  const [novaCategoriaTexto, setNovaCategoriaTexto] = useState('');

  const [tagDetalheId, setTagDetalheId] = useState(null);

  const [modalRemocaoVisivel, setModalRemocaoVisivel] = useState(false);
  const [tagSubstitutaId, setTagSubstitutaId] = useState('');
  const [seletorSubstitutaAberto, setSeletorSubstitutaAberto] = useState(false);

  const tema = useTheme();
  const { modoEscuro } = useThemeControls();

  const cores = {
    fundo: tema.fundo || (modoEscuro ? '#120726' : '#FFFFFF'),
    titulo: tema.texto || (modoEscuro ? '#FFFFFF' : '#1E0A3C'),
    textoSecundario: tema.textoSecundario || (modoEscuro ? 'rgba(239, 230, 255, 0.72)' : 'rgba(30, 10, 60, 0.68)'),
    buscaFundo: tema.card || (modoEscuro ? '#21113F' : '#FFFFFF'),
    buscaBorda: modoEscuro ? '#3A0F8A' : '#EFE6FF',
    buscaTexto: tema.texto || (modoEscuro ? '#EFE6FF' : '#1E0A3C'),
    buscaPlaceholder: modoEscuro ? '#A77BFF' : '#1E0A3C',
    categoriaTitulo: modoEscuro ? '#A77BFF' : '#5000B7',
    chipFundo: tema.card || (modoEscuro ? '#21113F' : '#EFE6FF'),
    chipTexto: modoEscuro ? '#EFE6FF' : '#5000B7',
    badgeFundo: modoEscuro ? '#3A0F8A' : '#FFFFFF',
    badgeTexto: modoEscuro ? '#A77BFF' : '#5000B7',
    chipSemUsoFundo: modoEscuro ? '#21113F' : '#FFF3DC',
    chipSemUsoTexto: modoEscuro ? '#8E859E' : '#1E0A3C',
    badgeSemUsoFundo: modoEscuro ? '#120726' : '#FFFFFF',
    badgeSemUsoTexto: modoEscuro ? '#8E859E' : '#1E0A3C',
    rodapeTexto: modoEscuro ? '#A77BFF' : '#1E0A3C',
    gavetaFundo: modoEscuro ? '#1B0B36' : '#FFFFFF',
    gavetaHandle: modoEscuro ? '#3A0F8A' : '#E2D6F8',
    cardFundo: tema.card || (modoEscuro ? '#21113F' : '#FFFFFF'),
    cardBorda: modoEscuro ? '#3A0F8A' : '#EFE6FF',
    inputFundo: modoEscuro ? '#21113F' : '#FFFFFF',
    inputBorda: modoEscuro ? '#3A0F8A' : '#D5C4F7',
    inputBordaAtiva: '#5000B7',
    chipNovaCatBorda: modoEscuro ? '#A77BFF' : '#B79CED',
    previaTexto: modoEscuro ? 'rgba(239, 230, 255, 0.7)' : 'rgba(30, 10, 60, 0.7)',
    alertaFundo: modoEscuro ? '#3D1522' : '#FDECEC',
    alertaTexto: modoEscuro ? '#F7A1A1' : '#A32D2D',
    alertaBorda: modoEscuro ? '#6E2236' : '#F5C2C2',
    botaoCancelarFundo: modoEscuro ? '#2A164F' : '#F2ECFC',
    botaoCancelarTexto: modoEscuro ? '#EFE6FF' : '#1E0A3C',
  };

  const tagDetalhe = tags.find((t) => t.id === tagDetalheId) || null;

  const tagsFiltradas = tags.filter((tag) =>
    tag.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirGavetaNovaTag = () => {
    setTagEmEdicao(null);
    setNomeTag('');
    setCategoriaSelecionada(categorias[0] || 'Marketing');
    setDescricaoTag('');
    setCriandoCategoria(false);
    setNovaCategoriaTexto('');
    setModalGavetaVisivel(true);
  };

  const abrirGavetaEditarTag = (tag) => {
    setTagEmEdicao(tag);
    setNomeTag(tag.nome);
    setCategoriaSelecionada(tag.categoria);
    setDescricaoTag(tag.descricao || '');
    setCriandoCategoria(false);
    setNovaCategoriaTexto('');
    setModalGavetaVisivel(true);
  };

  const handleAdicionarCategoria = () => {
    const trimmed = novaCategoriaTexto.trim();
    if (!trimmed) {
      setCriandoCategoria(false);
      return;
    }
    const jaExiste = categorias.find(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (jaExiste) {
      setCategoriaSelecionada(jaExiste);
    } else {
      setCategorias([...categorias, trimmed]);
      setCategoriaSelecionada(trimmed);
    }
    setNovaCategoriaTexto('');
    setCriandoCategoria(false);
  };

  const handleSalvarTag = () => {
    const nomeLimpo = nomeTag.trim();
    if (!nomeLimpo) {
      Alert.alert('Campo obrigatório', 'Informe o nome da tag.');
      return;
    }

    const duplicada = tags.some(
      (t) =>
        t.id !== tagEmEdicao?.id &&
        t.nome.trim().toLowerCase() === nomeLimpo.toLowerCase()
    );
    if (duplicada) {
      Alert.alert('Tag já existente', `A tag "${nomeLimpo}" já está cadastrada.`);
      return;
    }

    if (tagEmEdicao) {
      setTags(
        tags.map((t) =>
          t.id === tagEmEdicao.id
            ? {
                ...t,
                nome: nomeLimpo,
                categoria: categoriaSelecionada,
                descricao: descricaoTag.trim(),
              }
            : t
        )
      );
    } else {
      const novaTag = {
        id: Date.now().toString(),
        nome: nomeLimpo,
        categoria: categoriaSelecionada,
        descricao: descricaoTag.trim(),
        mentoresCount: 0,
        matchesMes: 0,
        mentores: [],
      };
      setTags([...tags, novaTag]);
    }

    setModalGavetaVisivel(false);
  };

  const abrirModalRemocao = () => {
    if (!tagDetalhe) return;
    const opcoesMesmaCategoria = tags.filter(
      (t) => t.id !== tagDetalhe.id && t.categoria === tagDetalhe.categoria
    );
    const outrasOpcoes = tags.filter((t) => t.id !== tagDetalhe.id);
    const padrao = opcoesMesmaCategoria[0] || outrasOpcoes[0];

    setTagSubstitutaId(tagDetalhe.mentoresCount > 0 && padrao ? padrao.id : '');
    setSeletorSubstitutaAberto(false);
    setModalRemocaoVisivel(true);
  };

  const confirmarRemocao = () => {
    if (!tagDetalhe) return;

    const atualizadas = tags
      .filter((t) => t.id !== tagDetalhe.id)
      .map((t) => {
        if (tagSubstitutaId && t.id === tagSubstitutaId) {
          return {
            ...t,
            mentoresCount: t.mentoresCount + tagDetalhe.mentoresCount,
            matchesMes: t.matchesMes + tagDetalhe.matchesMes,
          };
        }
        return t;
      });

    setTags(atualizadas);
    setModalRemocaoVisivel(false);
    setTagDetalheId(null);
  };

  const outrasTagsDisponiveis = tagDetalhe
    ? tags.filter((t) => t.id !== tagDetalhe.id)
    : [];
  const tagSubstitutaSelecionada = outrasTagsDisponiveis.find(
    (t) => t.id === tagSubstitutaId
  );

  if (tagDetalhe) {
    const excedenteMentores = Math.max(
      0,
      tagDetalhe.mentoresCount - (tagDetalhe.mentores?.length || 0)
    );

    return (
      <View style={[styles.container, { backgroundColor: cores.fundo }]}>
        <ScreenHeader
          titulo={tagDetalhe.nome}
          onVoltar={() => setTagDetalheId(null)}
          direita={
            <TouchableOpacity
              onPress={() => abrirGavetaEditarTag(tagDetalhe)}
              style={styles.botaoEditarHeader}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
              <Text style={styles.textoEditarHeader}>Editar</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView style={styles.corpo} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={styles.detalheTopoInfo}>
            <View style={[styles.pilulaDestaque, { backgroundColor: palette.primaria || '#5000B7' }]}>
              <Text style={styles.pilulaDestaqueTexto}>{tagDetalhe.nome}</Text>
            </View>
            <Text style={[styles.categoriaSubtitulo, { color: cores.textoSecundario }]}>
              Categoria: {tagDetalhe.categoria}
            </Text>
          </View>

          <Text style={[styles.detalheDescricao, { color: cores.titulo }]}>
            {tagDetalhe.descricao || 'Nenhuma descrição informada para esta tag.'}
          </Text>

          <View style={styles.metricasRow}>
            <View
              style={[
                styles.metricaCard,
                { backgroundColor: cores.cardFundo, borderColor: cores.cardBorda },
              ]}
            >
              <Text style={[styles.metricaNumero, { color: cores.titulo }]}>
                {tagDetalhe.mentoresCount}
              </Text>
              <Text style={[styles.metricaLabel, { color: cores.textoSecundario }]}>
                Mentores
              </Text>
            </View>

            <View
              style={[
                styles.metricaCard,
                { backgroundColor: cores.cardFundo, borderColor: cores.cardBorda },
              ]}
            >
              <Text style={[styles.metricaNumero, { color: cores.titulo }]}>
                {tagDetalhe.matchesMes}
              </Text>
              <Text style={[styles.metricaLabel, { color: cores.textoSecundario }]}>
                Matches no mês
              </Text>
            </View>
          </View>

          <Text style={[styles.categoriaTitulo, { color: cores.categoriaTitulo }]}>
            MENTORES COM ESTA TAG
          </Text>

          {tagDetalhe.mentoresCount === 0 ? (
            <View
              style={[
                styles.mentoresCard,
                {
                  backgroundColor: cores.cardFundo,
                  borderColor: cores.cardBorda,
                  paddingVertical: 20,
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={{ color: cores.textoSecundario, fontSize: 14 }}>
                Nenhum mentor vinculado a esta tag ainda.
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.mentoresCard,
                { backgroundColor: cores.cardFundo, borderColor: cores.cardBorda },
              ]}
            >
              {(tagDetalhe.mentores || []).map((mentor, index) => {
                const isLast = index === tagDetalhe.mentores.length - 1;
                return (
                  <View
                    key={mentor.id}
                    style={[
                      styles.mentorItem,
                      !isLast && {
                        borderBottomWidth: 1,
                        borderBottomColor: cores.cardBorda,
                      },
                    ]}
                  >
                    <View style={styles.mentorInfo}>
                      <View
                        style={[
                          styles.mentorAvatar,
                          { backgroundColor: cores.chipFundo },
                        ]}
                      >
                        <Text
                          style={[
                            styles.mentorAvatarTexto,
                            { color: cores.chipTexto },
                          ]}
                        >
                          {mentor.iniciais}
                        </Text>
                      </View>
                      <Text style={[styles.mentorNome, { color: cores.titulo }]}>
                        {mentor.nome}
                      </Text>
                    </View>

                    {isLast && excedenteMentores > 0 && (
                      <Text
                        style={[
                          styles.excedenteTexto,
                          { color: cores.textoSecundario },
                        ]}
                      >
                        +{excedenteMentores}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        <View style={styles.rodapeDetalhe}>
          <TouchableOpacity
            style={[
              styles.botaoRemoverTag,
              {
                borderColor: cores.alertaBorda,
                backgroundColor: modoEscuro ? 'rgba(163, 45, 45, 0.14)' : '#FFF8F8',
              },
            ]}
            onPress={abrirModalRemocao}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={18} color={cores.alertaTexto} />
            <Text style={[styles.textoBotaoRemover, { color: cores.alertaTexto }]}>
              Remover tag
            </Text>
          </TouchableOpacity>
        </View>

        {renderModalGaveta()}
        {renderModalRemocao()}
      </View>
    );
  }

  function renderModalGaveta() {
    return (
      <Modal
        visible={modalGavetaVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalGavetaVisivel(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalGavetaVisivel(false)}
          />

          <View style={[styles.gavetaContainer, { backgroundColor: cores.gavetaFundo }]}>
            <View style={[styles.gavetaHandle, { backgroundColor: cores.gavetaHandle }]} />

            <Text style={[styles.gavetaTitulo, { color: cores.titulo }]}>
              {tagEmEdicao ? 'Editar tag' : 'Nova tag'}
            </Text>

            <Text style={[styles.labelCampo, { color: cores.categoriaTitulo }]}>NOME</Text>
            <TextInput
              style={[
                styles.inputGaveta,
                {
                  backgroundColor: cores.inputFundo,
                  borderColor: nomeTag.trim() ? cores.inputBordaAtiva : cores.inputBorda,
                  color: cores.buscaTexto,
                },
              ]}
              placeholder="Ex.: Marketing Digital"
              placeholderTextColor={
                modoEscuro ? 'rgba(167, 123, 255, 0.45)' : 'rgba(30, 10, 60, 0.35)'
              }
              value={nomeTag}
              onChangeText={setNomeTag}
            />

            <Text style={[styles.labelCampo, { color: cores.categoriaTitulo }]}>CATEGORIA</Text>
            <View style={styles.categoriasChipsWrapper}>
              {categorias.map((cat) => {
                const selecionada = categoriaSelecionada === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoriaChip,
                      {
                        backgroundColor: selecionada ? '#5000B7' : cores.chipFundo,
                      },
                    ]}
                    onPress={() => setCategoriaSelecionada(cat)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.categoriaChipTexto,
                        { color: selecionada ? '#FFFFFF' : cores.chipTexto },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {criandoCategoria ? (
                <View
                  style={[
                    styles.novaCategoriaInputBox,
                    {
                      borderColor: cores.inputBordaAtiva,
                      backgroundColor: cores.inputFundo,
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.novaCategoriaInput, { color: cores.buscaTexto }]}
                    placeholder="Nome..."
                    placeholderTextColor={
                      modoEscuro ? 'rgba(167, 123, 255, 0.5)' : 'rgba(30, 10, 60, 0.4)'
                    }
                    value={novaCategoriaTexto}
                    onChangeText={setNovaCategoriaTexto}
                    onSubmitEditing={handleAdicionarCategoria}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleAdicionarCategoria}>
                    <Ionicons name="checkmark" size={18} color="#5000B7" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.categoriaChipNova,
                    { borderColor: cores.chipNovaCatBorda },
                  ]}
                  onPress={() => setCriandoCategoria(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoriaChipNovaTexto, { color: cores.rodapeTexto }]}>
                    + Nova
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.labelCampo, { color: cores.categoriaTitulo }]}>
              DESCRIÇÃO (OPCIONAL)
            </Text>
            <TextInput
              style={[
                styles.inputGaveta,
                {
                  backgroundColor: cores.inputFundo,
                  borderColor: cores.inputBorda,
                  color: cores.buscaTexto,
                },
              ]}
              placeholder="Estratégias de aquisição online..."
              placeholderTextColor={
                modoEscuro ? 'rgba(167, 123, 255, 0.45)' : 'rgba(30, 10, 60, 0.35)'
              }
              value={descricaoTag}
              onChangeText={setDescricaoTag}
            />

            <View style={styles.previaContainer}>
              <Text style={[styles.previaLabel, { color: cores.previaTexto }]}>Prévia:</Text>
              <View style={[styles.previaChip, { backgroundColor: cores.chipFundo }]}>
                <Text style={[styles.previaChipTexto, { color: cores.chipTexto }]}>
                  {nomeTag.trim() || 'Marketing Digital'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.botaoSalvarTag}
              onPress={handleSalvarTag}
              activeOpacity={0.85}
            >
              <Text style={styles.textoBotaoSalvar}>
                {tagEmEdicao ? 'Salvar alterações' : 'Salvar tag'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderModalRemocao() {
    if (!tagDetalhe) return null;
    const temMentores = tagDetalhe.mentoresCount > 0;

    return (
      <Modal
        visible={modalRemocaoVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalRemocaoVisivel(false)}
      >
        <View style={styles.modalCentralOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalRemocaoVisivel(false)}
          />

          <View style={[styles.dialogRemocao, { backgroundColor: cores.gavetaFundo }]}>
            <View style={[styles.iconeAlertaCirculo, { backgroundColor: cores.alertaFundo }]}>
              <Ionicons name="warning-outline" size={26} color={cores.alertaTexto} />
            </View>

            <Text style={[styles.dialogTitulo, { color: cores.titulo }]}>
              Remover “{tagDetalhe.nome}”?
            </Text>

            {temMentores ? (
              <Text style={[styles.dialogSubtitulo, { color: cores.textoSecundario }]}>
                <Text style={{ color: cores.alertaTexto, fontWeight: '700' }}>
                  {tagDetalhe.mentoresCount}{' '}
                  {tagDetalhe.mentoresCount === 1 ? 'mentor usa' : 'mentores usam'}
                </Text>{' '}
                esta tag e deixarão de aparecer no matchmaking para ela.
              </Text>
            ) : (
              <Text style={[styles.dialogSubtitulo, { color: cores.textoSecundario }]}>
                Nenhum mentor está usando esta tag no momento. Esta ação não pode ser desfeita.
              </Text>
            )}

            {temMentores && outrasTagsDisponiveis.length > 0 && (
              <View style={styles.substituirBloco}>
                <Text style={[styles.labelCampo, { color: cores.categoriaTitulo }]}>
                  SUBSTITUIR POR (OPCIONAL)
                </Text>

                <TouchableOpacity
                  style={[
                    styles.selectBox,
                    {
                      backgroundColor: cores.inputFundo,
                      borderColor: cores.inputBorda,
                    },
                  ]}
                  onPress={() => setSeletorSubstitutaAberto(!seletorSubstitutaAberto)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.selectTexto, { color: cores.titulo }]}>
                    {tagSubstitutaSelecionada
                      ? tagSubstitutaSelecionada.nome
                      : 'Nenhuma (apenas remover)'}
                  </Text>
                  <Ionicons
                    name={seletorSubstitutaAberto ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={cores.textoSecundario}
                  />
                </TouchableOpacity>

                {seletorSubstitutaAberto && (
                  <View
                    style={[
                      styles.selectDropdown,
                      {
                        backgroundColor: cores.inputFundo,
                        borderColor: cores.inputBorda,
                      },
                    ]}
                  >
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                      <TouchableOpacity
                        style={styles.selectOpcao}
                        onPress={() => {
                          setTagSubstitutaId('');
                          setSeletorSubstitutaAberto(false);
                        }}
                      >
                        <Text style={{ color: cores.textoSecundario, fontSize: 14 }}>
                          Nenhuma (apenas remover)
                        </Text>
                      </TouchableOpacity>

                      {outrasTagsDisponiveis.map((opcao) => (
                        <TouchableOpacity
                          key={opcao.id}
                          style={styles.selectOpcao}
                          onPress={() => {
                            setTagSubstitutaId(opcao.id);
                            setSeletorSubstitutaAberto(false);
                          }}
                        >
                          <Text
                            style={{
                              color: cores.titulo,
                              fontSize: 14,
                              fontWeight: opcao.id === tagSubstitutaId ? '700' : '400',
                            }}
                          >
                            {opcao.nome}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            <View style={styles.dialogBotoesRow}>
              <TouchableOpacity
                style={[
                  styles.dialogBotao,
                  { backgroundColor: cores.botaoCancelarFundo },
                ]}
                onPress={() => setModalRemocaoVisivel(false)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dialogBotaoTexto,
                    { color: cores.botaoCancelarTexto },
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dialogBotao, { backgroundColor: '#A32D2D' }]}
                onPress={confirmarRemocao}
                activeOpacity={0.85}
              >
                <Text style={[styles.dialogBotaoTexto, { color: '#FFFFFF' }]}>
                  Remover
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <ScreenHeader
        titulo="Tags"
        onVoltar={() => navigation?.goBack()}
      />

      <View style={styles.corpo}>
        <View
          style={[
            styles.buscaContainer,
            { backgroundColor: cores.buscaFundo, borderColor: cores.buscaBorda },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={cores.buscaPlaceholder}
            style={[styles.iconeBusca, !modoEscuro && { opacity: 0.5 }]}
          />
          <TextInput
            style={[styles.inputBusca, { color: cores.buscaTexto }]}
            placeholder="Buscar tag"
            placeholderTextColor={
              modoEscuro ? 'rgba(167, 123, 255, 0.6)' : 'rgba(30, 10, 60, 0.45)'
            }
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={18} color={cores.buscaPlaceholder} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.conteudo} contentContainerStyle={{ paddingBottom: 100 }}>
          {categorias.map((categoria) => {
            const tagsDaCategoria = tagsFiltradas.filter((t) => t.categoria === categoria);

            if (tagsDaCategoria.length === 0) return null;

            return (
              <View key={categoria} style={styles.secaoCategoria}>
                <Text style={[styles.categoriaTitulo, { color: cores.categoriaTitulo }]}>
                  {categoria.toUpperCase()}
                </Text>

                <View style={styles.chipsWrapper}>
                  {tagsDaCategoria.map((tag) => {
                    const semUso = tag.mentoresCount === 0;

                    return (
                      <TouchableOpacity
                        key={tag.id}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: semUso ? cores.chipSemUsoFundo : cores.chipFundo,
                            opacity: modoEscuro && semUso ? 0.65 : 1,
                          },
                        ]}
                        onPress={() => setTagDetalheId(tag.id)}
                        onLongPress={() => abrirGavetaEditarTag(tag)}
                        delayLongPress={350}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            styles.chipTexto,
                            { color: semUso ? cores.chipSemUsoTexto : cores.chipTexto },
                          ]}
                        >
                          {tag.nome}
                        </Text>

                        <View
                          style={[
                            styles.contadorBadge,
                            {
                              backgroundColor: semUso
                                ? cores.badgeSemUsoFundo
                                : cores.badgeFundo,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.contadorTexto,
                              {
                                color: semUso ? cores.badgeSemUsoTexto : cores.badgeTexto,
                              },
                            ]}
                          >
                            {tag.mentoresCount}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}

          <View style={styles.rodape}>
            <Text
              style={[
                styles.textoRodape,
                { color: cores.rodapeTexto, opacity: 0.6 },
              ]}
            >
              Toque para ver detalhes ou segure para editar
            </Text>
          </View>
        </ScrollView>
      </View>

      <Pressable
        onPress={abrirGavetaNovaTag}
        accessibilityRole="button"
        accessibilityLabel="Nova tag"
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <Text style={styles.fabTexto}>Nova</Text>
      </Pressable>

      {renderModalGaveta()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  corpo: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 20,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  iconeBusca: {
    marginRight: 10,
  },
  inputBusca: {
    flex: 1,
    fontSize: 15,
  },
  conteudo: {
    flex: 1,
  },
  secaoCategoria: {
    marginBottom: 24,
  },
  categoriaTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: 20,
    gap: 8,
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
  contadorBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  contadorTexto: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rodape: {
    marginTop: 8,
    alignItems: 'center',
  },
  textoRodape: {
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.primaria || '#5000B7',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  fabTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  botaoEditarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  textoEditarHeader: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  detalheTopoInfo: {
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  pilulaDestaque: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  pilulaDestaqueTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  categoriaSubtitulo: {
    fontSize: 14,
  },
  detalheDescricao: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  metricasRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  metricaCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
  },
  metricaNumero: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricaLabel: {
    fontSize: 13,
  },
  mentoresCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  mentorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mentorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorAvatarTexto: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  mentorNome: {
    fontSize: 15,
    fontWeight: '500',
  },
  excedenteTexto: {
    fontSize: 14,
    fontWeight: '600',
  },
  rodapeDetalhe: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 24 : 20,
  },
  botaoRemoverTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  textoBotaoRemover: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(10, 4, 22, 0.65)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  gavetaContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 40 : 34,
  },
  gavetaHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  gavetaTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  labelCampo: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputGaveta: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 18,
  },
  categoriasChipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  categoriaChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  categoriaChipTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriaChipNova: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  categoriaChipNovaTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
  novaCategoriaInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    gap: 6,
  },
  novaCategoriaInput: {
    fontSize: 14,
    minWidth: 80,
    paddingVertical: 0,
  },
  previaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
    marginBottom: 22,
  },
  previaLabel: {
    fontSize: 14,
  },
  previaChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  previaChipTexto: {
    fontSize: 13,
    fontWeight: '600',
  },
  botaoSalvarTag: {
    backgroundColor: '#5000B7',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCentralOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(10, 4, 22, 0.7)',
  },
  dialogRemocao: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  iconeAlertaCirculo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dialogTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  dialogSubtitulo: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  substituirBloco: {
    width: '100%',
    marginBottom: 22,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
  },
  selectTexto: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectDropdown: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  selectOpcao: {
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  dialogBotoesRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dialogBotao: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBotaoTexto: {
    fontSize: 15,
    fontWeight: '600',
  },
});