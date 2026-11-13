import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import ScreenHeader from '../components/ScreenHeader';

export default function PlaceholderScreen({ navigation, route }) {
  const tema = useTheme();
  const titulo = route.params?.titulo ?? route.name;
  const podeVoltar = route.params?.voltar;

  return (
    <View style={[styles.tela, { backgroundColor: tema.fundo }]}>
      <ScreenHeader
        titulo={titulo}
        onVoltar={podeVoltar ? () => navigation.goBack() : undefined}
      />
      <View style={styles.corpo}>
        <MaterialCommunityIcons name="hammer-wrench" size={48} color={tema.textoSecundario} />
        <Text style={[styles.texto, { color: tema.textoSecundario }]}>Tela em construção</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  corpo: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  texto: { fontSize: 16 },
});