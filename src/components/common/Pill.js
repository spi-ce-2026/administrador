import { Text } from 'react-native';
import { useTheme } from '../../theme';

// tipo: 'sucesso' | 'perigo' | 'alerta'
export default function Pill({ texto, tipo = 'sucesso', pequeno = false, caixaAlta = false }) {
  const tema = useTheme();
  const cores = {
    sucesso: [tema.sucesso, tema.sucessoFundo],
    perigo: [tema.perigo, tema.perigoFundo],
    alerta: [tema.alerta, tema.alertaFundo],
  }[tipo];

  return (
    <Text
      style={{
        color: cores[0],
        backgroundColor: cores[1],
        fontSize: pequeno ? 10 : 12,
        fontWeight: '700',
        letterSpacing: caixaAlta ? 0.4 : 0,
        borderRadius: 999,
        paddingHorizontal: pequeno ? 7 : 9,
        paddingVertical: pequeno ? 2 : 3,
        overflow: 'hidden',
        alignSelf: 'flex-start',
        flexShrink: 0,
      }}
    >
      {texto}
    </Text>
  );
}
