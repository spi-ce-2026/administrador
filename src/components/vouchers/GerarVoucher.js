import { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette, useTheme } from '../../theme';
import { AREAS, lerData, mascararData } from '../../utils/vouchers';

const QUANTIDADE_MAXIMA = 500;

const TIPOS = [
  { chave: 'open', rotulo: 'Aberto' },
  { chave: 'restricted', rotulo: 'Restrito' },
];

export default function GerarVoucher({ aoGerar }) {
  const tema = useTheme();
  const [tipo, setTipo] = useState('open');
  const [area, setArea] = useState(AREAS[0]);
  const [quantidade, setQuantidade] = useState('25');
  const [validade, setValidade] = useState('');
  const [erro, setErro] = useState('');

  const total = Math.min(QUANTIDADE_MAXIMA, Math.max(0, Number(quantidade) || 0));

  const ajustar = (delta) => {
    setQuantidade(String(Math.min(QUANTIDADE_MAXIMA, Math.max(1, total + delta))));
    setErro('');
  };

  const enviar = () => {
    if (total < 1) {
      setErro('Informe ao menos 1 voucher.');
      return;
    }
    let expiresAt = null;
    if (validade) {
      expiresAt = lerData(validade);
      if (!expiresAt) {
        setErro('Use uma data válida no formato dd/mm/aaaa.');
        return;
      }
    }
    aoGerar({ quantidade: total, type: tipo, area: tipo === 'restricted' ? area : null, expiresAt });
  };

  const campo = [styles.campo, { borderColor: tema.borda, backgroundColor: tema.fundo }];

  return (
    <View>
      <Text style={[styles.titulo, { color: tema.texto }]}>Gerar novos vouchers</Text>

      <Text style={[styles.rotulo, { color: tema.icone }]}>TIPO</Text>
      <View style={[styles.segmentado, { backgroundColor: tema.iconeFundo }]}>
        {TIPOS.map((opcao) => {
          const ativo = tipo === opcao.chave;
          return (
            <Pressable
              key={opcao.chave}
              onPress={() => setTipo(opcao.chave)}
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}
              style={[styles.segmento, ativo && { backgroundColor: palette.primaria }]}
            >
              <Text style={[styles.segmentoTexto, { color: ativo ? '#FFFFFF' : tema.icone }]}>
                {opcao.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={[styles.dica, { color: tema.textoSecundario }]}>
        {tipo === 'open'
          ? 'Qualquer trilha ou área pode resgatar.'
          : 'Só quem pertence à trilha ou área escolhida pode resgatar.'}
      </Text>

      {tipo === 'restricted' ? (
        <View style={styles.areas}>
          {AREAS.map((item) => {
            const ativo = area === item;
            return (
              <Pressable
                key={item}
                onPress={() => setArea(item)}
                accessibilityRole="button"
                accessibilityState={{ selected: ativo }}
                style={[styles.area, { backgroundColor: ativo ? palette.primaria : tema.iconeFundo }]}
              >
                <Text style={[styles.areaTexto, { color: ativo ? '#FFFFFF' : tema.icone }]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <Text style={[styles.rotulo, { color: tema.icone }]}>QUANTIDADE</Text>
      <View style={campo}>
        <Pressable onPress={() => ajustar(-1)} hitSlop={8} accessibilityLabel="Diminuir quantidade">
          <MaterialCommunityIcons name="minus" size={22} color={tema.icone} />
        </Pressable>
        <TextInput
          value={quantidade}
          onChangeText={(texto) => {
            setQuantidade(texto.replace(/\D/g, '').slice(0, 3));
            setErro('');
          }}
          keyboardType="number-pad"
          accessibilityLabel="Quantidade de vouchers"
          style={[styles.entrada, styles.entradaQuantidade, { color: tema.texto }]}
        />
        <Pressable onPress={() => ajustar(1)} hitSlop={8} accessibilityLabel="Aumentar quantidade">
          <MaterialCommunityIcons name="plus" size={22} color={tema.icone} />
        </Pressable>
      </View>

      <Text style={[styles.rotulo, { color: tema.icone }]}>VALIDADE (OPCIONAL)</Text>
      <View style={campo}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={20} color={tema.icone} />
        <TextInput
          value={validade}
          onChangeText={(texto) => {
            setValidade(mascararData(texto));
            setErro('');
          }}
          placeholder="dd/mm/aaaa"
          placeholderTextColor={tema.textoSecundario}
          keyboardType="number-pad"
          accessibilityLabel="Validade dos vouchers"
          style={[styles.entrada, { color: tema.texto }]}
        />
      </View>

      {erro ? <Text style={[styles.erro, { color: tema.perigo }]}>{erro}</Text> : null}

      <Pressable
        onPress={enviar}
        accessibilityRole="button"
        style={({ pressed }) => [styles.botao, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.botaoTexto}>
          {`Gerar ${total} ${total === 1 ? 'voucher' : 'vouchers'}`}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  rotulo: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginTop: 16, marginBottom: 6 },
  segmentado: { flexDirection: 'row', borderRadius: 12, padding: 3 },
  segmento: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  segmentoTexto: { fontSize: 14, fontWeight: '600' },
  dica: { fontSize: 12, marginTop: 6 },
  areas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  area: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  areaTexto: { fontSize: 13, fontWeight: '500' },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  entrada: { flex: 1, fontSize: 16, marginLeft: 10, paddingVertical: 0 },
  entradaQuantidade: { textAlign: 'center', fontWeight: '600', marginLeft: 0 },
  erro: { fontSize: 13, marginTop: 10 },
  botao: {
    backgroundColor: palette.primaria,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  botaoTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
