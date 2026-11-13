import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_TAGS = [
  { id: '1', nome: 'Marketing Digital', mentoresCount: 12, categoria: 'Marketing' },
  { id: '2', nome: 'Branding', mentoresCount: 5, categoria: 'Marketing' },
  { id: '3', nome: 'SEO', mentoresCount: 3, categoria: 'Marketing' },
  { id: '4', nome: 'Growth', mentoresCount: 7, categoria: 'Marketing' },
  { id: '5', nome: 'Back-end', mentoresCount: 8, categoria: 'Tecnologia' },
  { id: '6', nome: 'Mobile', mentoresCount: 4, categoria: 'Tecnologia' },
  { id: '7', nome: 'UX/UI', mentoresCount: 0, categoria: 'Tecnologia' },
  { id: '8', nome: 'Dados', mentoresCount: 6, categoria: 'Tecnologia' },
  { id: '9', nome: 'Finanças', mentoresCount: 9, categoria: 'Negócios' },
  { id: '10', nome: 'Vendas B2B', mentoresCount: 2, categoria: 'Negócios' },
  { id: '11', nome: 'Captação', mentoresCount: 5, categoria: 'Negócios' },
];

const CATEGORIAS = ['Marketing', 'Tecnologia', 'Negócios'];

const TEMAS = {
  escuro: {
    fundo: '#120726',
    titulo: '#FFFFFF',
    buscaFundo: '#21113F',
    buscaBorda: '#3A0F8A',
    buscaTexto: '#EFE6FF',
    buscaPlaceholder: '#A77BFF',
    categoriaTitulo: '#A77BFF',
    chipFundo: '#21113F',
    chipTexto: '#EFE6FF',
    badgeFundo: '#3A0F8A',
    badgeTexto: '#A77BFF',
    chipSemUsoFundo: '#21113F',
    chipSemUsoTexto: '#8E859E',
    badgeSemUsoFundo: '#120726',
    badgeSemUsoTexto: '#8E859E',
    rodapeTexto: '#A77BFF',
  },
  claro: {
    fundo: '#FFFFFF',
    titulo: '#1E0A3C',
    buscaFundo: '#FFFFFF',
    buscaBorda: '#EFE6FF',
    buscaTexto: '#1E0A3C',
    buscaPlaceholder: '#1E0A3C',
    categoriaTitulo: '#5000B7',
    chipFundo: '#EFE6FF',
    chipTexto: '#5000B7',
    badgeFundo: '#FFFFFF',
    badgeTexto: '#5000B7',
    chipSemUsoFundo: '#FFF3DC',
    chipSemUsoTexto: '#1E0A3C',
    badgeSemUsoFundo: '#FFFFFF',
    badgeSemUsoTexto: '#1E0A3C',
    rodapeTexto: '#1E0A3C',
  },
};

export default function TagsScreen() {
  const [busca, setBusca] = useState('');
  const [modoEscuro, setModoEscuro] = useState(true);

  const cores = modoEscuro ? TEMAS.escuro : TEMAS.claro;

  const tagsFiltradas = MOCK_TAGS.filter((tag) =>
    tag.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleLongPressTag = (tag) => {
    Alert.alert('Editar Tag', `Você segurou a tag "${tag.nome}". Aqui abrirá a tela de edição.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <StatusBar
        barStyle={modoEscuro ? 'light-content' : 'dark-content'}
        backgroundColor={cores.fundo}
      />

      <View style={styles.header}>
        <Text style={[styles.titulo, { color: cores.titulo }]}>Tags</Text>

        <View style={styles.acoesTopo}>
          <View style={styles.switchWrapper}>
            <Ionicons
              name={modoEscuro ? 'moon' : 'sunny'}
              size={16}
              color={cores.categoriaTitulo}
            />
            <Switch
              value={modoEscuro}
              onValueChange={setModoEscuro}
              trackColor={{ false: '#EFE6FF', true: '#3A0F8A' }}
              thumbColor={modoEscuro ? '#A77BFF' : '#5000B7'}
            />
          </View>

          <TouchableOpacity style={styles.botaoNova} activeOpacity={0.8}>
            <Text style={styles.textoBotaoNova}>+ Nova</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          placeholderTextColor={modoEscuro ? 'rgba(167, 123, 255, 0.6)' : 'rgba(30, 10, 60, 0.45)'}
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={18} color={cores.buscaPlaceholder} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.conteudo} contentContainerStyle={{ paddingBottom: 24 }}>
        {CATEGORIAS.map((categoria) => {
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
                      onLongPress={() => handleLongPressTag(tag)}
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
      </ScrollView>

      <View style={styles.rodape}>
        <Text
          style={[
            styles.textoRodape,
            { color: cores.rodapeTexto, opacity: 0.6 },
          ]}
        >
          Toque e segure uma tag para editar
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 16 : 54,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  acoesTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  botaoNova: {
    backgroundColor: '#5000B7',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  textoBotaoNova: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 56 : 28,
    alignItems: 'center',
  },
  textoRodape: {
    fontSize: 13,
  },
});