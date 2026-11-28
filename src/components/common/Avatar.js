import { View, Text } from 'react-native';
import { useTheme } from '../../theme';
import { iniciais } from '../../utils/format';

export default function Avatar({ nome, tamanho = 40, apagado = false }) {
  const tema = useTheme();
  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        backgroundColor: apagado ? tema.divisor : tema.avatarFundo,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: apagado ? tema.textoSuave : tema.avatarTexto, fontWeight: '700', fontSize: tamanho * 0.35 }}>
        {iniciais(nome)}
      </Text>
    </View>
  );
}
