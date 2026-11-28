import { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import BottomSheet from '../common/BottomSheet';
import StatusTransition from '../common/StatusTransition';
import Botao from '../common/Botao';
import { MOTIVOS_SUSPENSAO } from '../../utils/format';

// Passo 4 do fluxo: "Confirme a ação". Status: ACTIVE → SUSPENDED
export default function SuspendSheet({ visivel, usuario, onFechar, onConfirmar }) {
  const tema = useTheme();
  const [motivo, setMotivo] = useState('NO_SHOW');
  const [observacao, setObservacao] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (visivel) {
      setMotivo(usuario?.noShows > 0 ? 'NO_SHOW' : 'RULES');
      setObservacao('');
    }
  }, [visivel, usuario]);

  async function confirmar() {
    setEnviando(true);
    try {
      await onConfirmar({ motivo, observacao: observacao.trim() });
    } finally {
      setEnviando(false);
    }
  }

  if (!usuario) return null;

  return (
    <BottomSheet visivel={visivel} onFechar={enviando ? undefined : onFechar}>
      <View style={styles.topo}>
        <View style={[styles.icone, { backgroundColor: tema.perigoFundo }]}>
          <Feather name="slash" size={22} color={tema.perigo} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.titulo, { color: tema.texto }]}>Suspender {usuario.nome}?</Text>
          <Text style={[styles.sub, { color: tema.textoSuave }]}>Perde o acesso ao app e às mentorias agendadas.</Text>
        </View>
      </View>

      <StatusTransition de="ACTIVE" para="SUSPENDED" />

      <View style={{ gap: 8 }} accessibilityRole="radiogroup">
        <Text style={[styles.rotulo, { color: tema.primaria }]}>MOTIVO</Text>
        {MOTIVOS_SUSPENSAO.map((m) => {
          const ativo = m.id === motivo;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMotivo(m.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: ativo }}
              style={[
                styles.opcao,
                { borderColor: ativo ? tema.primaria : tema.borda, backgroundColor: ativo ? tema.avatarFundo : tema.card },
              ]}
            >
              <View style={[styles.radio, { borderColor: ativo ? tema.primaria : tema.textoSuave, borderWidth: ativo ? 5 : 2 }]} />
              <Text style={{ color: tema.texto, fontSize: 14, fontWeight: ativo ? '600' : '400' }}>{m.rotulo}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ color: tema.texto, fontSize: 13, fontWeight: '500' }}>Observação (opcional)</Text>
        <TextInput
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Ex.: faltou a 3 mentorias sem aviso"
          placeholderTextColor={tema.textoSuave}
          multiline
          style={[styles.input, { borderColor: tema.borda, color: tema.texto }]}
        />
      </View>

      <View style={styles.botoes}>
        <Botao titulo="Cancelar" variante="secundario" onPress={onFechar} style={{ flex: 1 }} />
        <Botao titulo="Confirmar suspensão" variante="perigo" onPress={confirmar} carregando={enviando} style={{ flex: 1.4 }} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icone: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 18, fontWeight: '700' },
  sub: { fontSize: 13, marginTop: 2 },
  rotulo: { fontSize: 12, fontWeight: '700', letterSpacing: 0.7 },
  opcao: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  radio: { width: 16, height: 16, borderRadius: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minHeight: 64, fontSize: 14, textAlignVertical: 'top' },
  botoes: { flexDirection: 'row', gap: 10, marginTop: 4 },
});
