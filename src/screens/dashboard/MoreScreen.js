import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import ScreenHeader from '../../components/dashboard/ScreenHeader';

const ITENS = [
  { rota: 'Vouchers', titulo: 'Vouchers', descricao: 'Gerar e gerenciar vouchers', icone: 'ticket-outline' },
  { rota: 'Tags', titulo: 'Tags', descricao: 'Organizar as tags das mentorias', icone: 'tag-outline' },
  { rota: 'Notificacoes', titulo: 'Notificações', descricao: 'Avisos da plataforma', icone: 'bell-outline' },
  { rota: 'Configuracoes', titulo: 'Configurações', descricao: 'Conta e preferências', icone: 'cog-outline' },
];

export default function MoreScreen({ navigation }) {
  const tema = useTheme();

  return (
    <View style={[styles.tela, { backgroundColor: tema.fundo }]}>
      <ScreenHeader titulo="Mais" />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={[styles.grupo, { backgroundColor: tema.card }]}>
          {ITENS.map((item, i) => (
            <Pressable
              key={item.rota}
              onPress={() => navigation.navigate(item.rota)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.item,
                i > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: tema.separador,
                },
                pressed && { opacity: 0.6 },
              ]}
            >
              <View style={[styles.iconeCaixa, { backgroundColor: tema.iconeFundo }]}>
                <MaterialCommunityIcons name={item.icone} size={22} color={tema.icone} />
              </View>
              <View style={styles.textos}>
                <Text style={[styles.itemTitulo, { color: tema.texto }]}>{item.titulo}</Text>
                <Text style={[styles.itemDescricao, { color: tema.textoSecundario }]}>
                  {item.descricao}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={tema.textoSecundario} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { padding: 16 },
  grupo: { borderRadius: 16, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  iconeCaixa: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1 },
  itemTitulo: { fontSize: 16, fontWeight: '600' },
  itemDescricao: { fontSize: 13, marginTop: 2 },
});