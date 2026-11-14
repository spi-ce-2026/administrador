import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { rotuloData, rotuloTipo } from '../../utils/vouchers';

export const fonteCodigo = Platform.select({ ios: 'Menlo', default: 'monospace' });

export function BadgeTipo({ voucher }) {
  const tema = useTheme();
  const restrito = voucher.type === 'restricted';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: restrito ? tema.restritoFundo : tema.iconeFundo },
      ]}
    >
      <Text style={[styles.badgeTexto, { color: restrito ? tema.restritoTexto : tema.icone }]}>
        {rotuloTipo(voucher)}
      </Text>
    </View>
  );
}

export default function CartaoVoucher({ voucher, aoAbrirMenu }) {
  const tema = useTheme();
  const expirado = voucher.status === 'expired';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: tema.card, borderColor: tema.borda },
        expirado && styles.esmaecido,
      ]}
    >
      <View style={styles.linha}>
        <Text style={[styles.codigo, { color: tema.texto }]}>{voucher.code}</Text>
        <Pressable
          onPress={() => aoAbrirMenu(voucher)}
          hitSlop={8}
          style={styles.menu}
          accessibilityRole="button"
          accessibilityLabel={`Ações do voucher ${voucher.code}`}
        >
          <MaterialCommunityIcons name="dots-vertical" size={22} color={tema.textoSecundario} />
        </Pressable>
      </View>
      <View style={styles.meta}>
        <BadgeTipo voucher={voucher} />
        <Text style={[styles.metaTexto, { color: tema.textoSecundario }]}>
          {rotuloData(voucher)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 8,
    marginBottom: 10,
  },
  esmaecido: { opacity: 0.6 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codigo: { fontFamily: fonteCodigo, fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  menu: { padding: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  metaTexto: { fontSize: 12 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeTexto: { fontSize: 12, fontWeight: '500' },
});
