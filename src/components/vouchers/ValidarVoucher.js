import { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette, useTheme } from '../../theme';
import {
  PADRAO_CODIGO,
  ROTULOS_STATUS,
  dataCompleta,
  mascararCodigo,
  rotuloTipo,
} from '../../utils/vouchers';
import { fonteCodigo } from './CartaoVoucher';

function Linha({ rotulo, valor, cor }) {
  return (
    <View style={styles.linha}>
      <Text style={[styles.linhaRotulo, { color: cor }]}>{rotulo}</Text>
      <Text style={[styles.linhaValor, { color: cor }]}>{valor}</Text>
    </View>
  );
}

function descreverResultado(resultado, tema) {
  if (resultado.estado === 'encontrado' && resultado.voucher.status === 'active') {
    return { fundo: tema.sucessoFundo, cor: tema.sucessoTexto, icone: 'check-circle-outline', titulo: 'Código válido' };
  }
  const titulos = {
    redeemed: 'Código já resgatado',
    expired: 'Código expirado',
  };
  const titulo =
    resultado.estado === 'encontrado'
      ? titulos[resultado.voucher.status]
      : resultado.estado === 'invalido'
        ? 'Formato inválido'
        : 'Código não encontrado';
  return { fundo: tema.perigoFundo, cor: tema.perigo, icone: 'close-circle-outline', titulo };
}

export default function ValidarVoucher({ vouchers, codigoInicial, aoDesativar }) {
  const tema = useTheme();
  const [codigo, setCodigo] = useState(codigoInicial ?? '');

  const validar = (valor) => {
    if (!PADRAO_CODIGO.test(valor)) return { estado: 'invalido' };
    const voucher = vouchers.find((item) => item.code === valor);
    return voucher ? { estado: 'encontrado', voucher } : { estado: 'inexistente' };
  };

  const [resultado, setResultado] = useState(codigoInicial ? validar(codigoInicial) : null);

  const voucher = resultado?.estado === 'encontrado' ? resultado.voucher : null;
  const visual = resultado ? descreverResultado(resultado, tema) : null;

  return (
    <View>
      <Text style={[styles.titulo, { color: tema.texto }]}>Validar voucher</Text>

      <View style={[styles.campo, { borderColor: tema.icone, backgroundColor: tema.fundo }]}>
        <TextInput
          value={codigo}
          onChangeText={(texto) => {
            setCodigo(mascararCodigo(texto));
            setResultado(null);
          }}
          placeholder="xxxx-xxxx-xxxx"
          placeholderTextColor={tema.textoSecundario}
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel="Código do voucher"
          style={[styles.entrada, { color: tema.texto }]}
        />
      </View>

      <Pressable
        onPress={() => setResultado(validar(codigo))}
        accessibilityRole="button"
        style={({ pressed }) => [styles.botao, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.botaoTexto}>Validar</Text>
      </Pressable>

      {visual ? (
        <View style={[styles.resultado, { backgroundColor: visual.fundo }]}>
          <View style={styles.resultadoTitulo}>
            <MaterialCommunityIcons name={visual.icone} size={22} color={visual.cor} />
            <Text style={[styles.resultadoTexto, { color: visual.cor }]}>{visual.titulo}</Text>
          </View>
          {voucher ? (
            <>
              <Linha rotulo="Tipo" valor={rotuloTipo(voucher)} cor={visual.cor} />
              <Linha rotulo="Validade" valor={dataCompleta(voucher.expiresAt)} cor={visual.cor} />
              <Linha rotulo="Status" valor={ROTULOS_STATUS[voucher.status]} cor={visual.cor} />
            </>
          ) : null}
        </View>
      ) : null}

      {voucher?.status === 'active' ? (
        <Pressable
          onPress={() => aoDesativar(voucher)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.desativar,
            { borderColor: tema.perigo },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={[styles.desativarTexto, { color: tema.perigo }]}>Desativar este voucher</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  campo: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 52, justifyContent: 'center' },
  entrada: { fontFamily: fonteCodigo, fontSize: 17, letterSpacing: 1, paddingVertical: 0 },
  botao: {
    backgroundColor: palette.primaria,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  botaoTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  resultado: { borderRadius: 14, padding: 16, marginTop: 16 },
  resultadoTitulo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultadoTexto: { fontSize: 17, fontWeight: '700' },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  linhaRotulo: { fontSize: 13, opacity: 0.85 },
  linhaValor: { fontSize: 13, fontWeight: '600' },
  desativar: {
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  desativarTexto: { fontSize: 15, fontWeight: '500' },
});
