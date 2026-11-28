import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import BottomSheet from '../common/BottomSheet';
import StatusTransition from '../common/StatusTransition';
import Botao from '../common/Botao';
import Avatar from '../common/Avatar';
import { dataLonga, rotuloMotivo } from '../../utils/format';

// Reativar · passo 3. Status: SUSPENDED → ACTIVE
export default function ReactivateSheet({ visivel, usuario, onFechar, onConfirmar }) {
  const tema = useTheme();
  const [enviando, setEnviando] = useState(false);

  async function confirmar() {
    setEnviando(true);
    try {
      await onConfirmar();
    } finally {
      setEnviando(false);
    }
  }

  if (!usuario) return null;
  const s = usuario.suspensao;

  const Linha = ({ rotulo, valor }) => (
    <View style={styles.linha}>
      <Text style={{ color: tema.textoSuave, fontSize: 13 }}>{rotulo}</Text>
      <Text style={{ color: tema.texto, fontSize: 13, fontWeight: '600' }}>{valor}</Text>
    </View>
  );

  return (
    <BottomSheet visivel={visivel} onFechar={enviando ? undefined : onFechar}>
      <View style={styles.topo}>
        <Avatar nome={usuario.nome} tamanho={44} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.titulo, { color: tema.texto }]}>Reativar {usuario.nome}?</Text>
          <Text style={{ color: tema.textoSuave, fontSize: 13, marginTop: 2 }}>Volta a acessar o app e pode agendar mentorias.</Text>
        </View>
      </View>

      {s ? (
        <View style={[styles.resumo, { backgroundColor: tema.fundo }]}>
          <Linha rotulo="Motivo da suspensão" valor={rotuloMotivo(s.motivo)} />
          <Linha rotulo="Suspenso desde" valor={dataLonga(s.data)} />
          <Linha rotulo="Suspenso por" valor={s.por || '—'} />
          {s.observacao ? <Text style={{ color: tema.textoSuave, fontSize: 12 }}>“{s.observacao}”</Text> : null}
        </View>
      ) : null}

      <StatusTransition de="SUSPENDED" para="ACTIVE" />

      <View style={styles.botoes}>
        <Botao titulo="Cancelar" variante="secundario" onPress={onFechar} style={{ flex: 1 }} />
        <Botao titulo="Reativar" onPress={confirmar} carregando={enviando} style={{ flex: 1 }} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titulo: { fontSize: 18, fontWeight: '700' },
  resumo: { borderRadius: 12, padding: 14, gap: 6 },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  botoes: { flexDirection: 'row', gap: 10, marginTop: 4 },
});
