import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { rotuloData, rotuloTipo } from '../../utils/vouchers';

export const fonteCodigo = Platform.select({ ios: 'Menlo', default: 'monospace' });

// Badge "Restrito": no modo escuro usa tons claros para destacar sobre o fundo roxo escuro.
const RESTRITO_CLARO = { fundo: '#FFF1D6', texto: '#7A4B00' };
const RESTRITO_ESCURO = { fundo: '#FFE2A8', texto: '#3D2600' };

function coresRestrito(tema) {
  if (tema.modoEscuro) return RESTRITO_ESCURO;
  return {
    fundo: tema.restritoFundo ?? RESTRITO_CLARO.fundo,
    texto: tema.restritoTexto ?? RESTRITO_CLARO.texto,
  };
}

export function BadgeTipo({ voucher }) {
  const tema = useTheme();
  const restrito = voucher.type === 'restricted';
  const coresR = coresRestrito(tema);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: restrito ? coresR.fundo : tema.iconeFundo },
      ]}
    >
      <Text style={[styles.badgeTexto, { color: restrito ? coresR.texto : tema.icone }]}>
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
