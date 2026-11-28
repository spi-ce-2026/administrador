import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import Avatar from '../common/Avatar';
import StatusPill from '../common/StatusPill';
import Botao from '../common/Botao';
import { dataCurta, rotuloMotivo } from '../../utils/format';

// Card da aba "Suspensos". O selo fica na linha de baixo para nomes longos não quebrarem.
export default function SuspendedUserCard({ usuario, onReativar }) {
  const tema = useTheme();
  const { nome, suspensao } = usuario;

  return (
    <View style={[styles.card, { backgroundColor: tema.card }]}>
      <Avatar nome={nome} apagado />
      <View style={{ flex: 1 }}>
        <Text style={[styles.nome, { color: tema.texto }]} numberOfLines={1}>{nome}</Text>
        <View style={styles.linha}>
          <StatusPill status="SUSPENDED" pequeno />
          <Text style={[styles.sub, { color: tema.textoSuave }]} numberOfLines={1}>
            {rotuloMotivo(suspensao?.motivo)} · {suspensao ? dataCurta(suspensao.data) : ''}
          </Text>
        </View>
      </View>
      <Botao titulo="Reativar" variante="contornoPrimario" pequeno onPress={onReativar} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  nome: { fontSize: 15, fontWeight: '600' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  sub: { fontSize: 12, flexShrink: 1 },
});
