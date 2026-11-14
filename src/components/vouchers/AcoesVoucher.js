import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { BadgeTipo, fonteCodigo } from './CartaoVoucher';

export default function AcoesVoucher({ voucher, aoValidar, aoCompartilhar, aoDesativar }) {
  const tema = useTheme();

  const acoes = [
    { chave: 'validar', rotulo: 'Validar', icone: 'qrcode-scan', aoPressionar: aoValidar },
    {
      chave: 'compartilhar',
      rotulo: 'Compartilhar',
      icone: 'share-variant-outline',
      aoPressionar: aoCompartilhar,
    },
  ];

  if (voucher.status === 'active') {
    acoes.push({
      chave: 'desativar',
      rotulo: 'Desativar',
      icone: 'cancel',
      aoPressionar: aoDesativar,
      perigo: true,
    });
  }

  return (
    <View>
      <Text style={[styles.codigo, { color: tema.texto }]}>{voucher.code}</Text>
      <View style={styles.tipo}>
        <BadgeTipo voucher={voucher} />
      </View>
      {acoes.map((acao, indice) => {
        const cor = acao.perigo ? tema.perigo : tema.texto;
        return (
          <Pressable
            key={acao.chave}
            onPress={() => acao.aoPressionar(voucher)}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.item,
              indice > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: tema.separador },
              pressed && { opacity: 0.6 },
            ]}
          >
            <MaterialCommunityIcons name={acao.icone} size={22} color={acao.perigo ? tema.perigo : tema.icone} />
            <Text style={[styles.rotulo, { color: cor }]}>{acao.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  codigo: { fontFamily: fonteCodigo, fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  tipo: { flexDirection: 'row', marginTop: 8, marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  rotulo: { fontSize: 16, fontWeight: '500' },
});
