import { View } from 'react-native';
import { useTheme } from '../../theme';

// Mini gráfico de barras; a última barra (período atual) fica destacada.
export default function TrendBars({ valores = [], altura = 38 }) {
  const tema = useTheme();
  if (!valores.length) return null;
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const escala = (v) => (max === min ? altura * 0.6 : 10 + ((v - min) / (max - min)) * (altura - 10));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: altura }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {valores.map((v, i) => (
        <View
          key={i}
          style={{ width: 7, height: escala(v), borderRadius: 2, backgroundColor: i === valores.length - 1 ? tema.primaria : tema.barraSuave }}
        />
      ))}
    </View>
  );
}
