import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import Avatar from '../common/Avatar';
import Pill from '../common/Pill';
import { rotuloPapel } from '../../utils/format';

// Card da aba "Ativos".
export default function UserCard({ usuario, onPress }) {
  const tema = useTheme();
  const { nome, papel, mentorias, noShows } = usuario;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${nome}, ${rotuloPapel(papel)}, ${mentorias} mentorias${noShows ? `, ${noShows} no-shows` : ''}`}
      style={({ pressed }) => [styles.card, { backgroundColor: tema.card, opacity: pressed ? 0.8 : 1 }]}
    >
      <Avatar nome={nome} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.nome, { color: tema.texto }]} numberOfLines={1}>{nome}</Text>
        <Text style={[styles.sub, { color: tema.textoSuave }]}>
          {rotuloPapel(papel)} · {mentorias} {mentorias === 1 ? 'mentoria' : 'mentorias'}
        </Text>
      </View>
      {noShows > 0 ? <Pill texto={`${noShows} no-show${noShows > 1 ? 's' : ''}`} tipo="alerta" /> : null}
      <Feather name="chevron-right" size={18} color={tema.textoSuave} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  nome: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 2 },
});
