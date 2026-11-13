import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function LoadingSpinner() {
  const tema = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: tema.fundo }]}>
      <ActivityIndicator size="large" color={tema.numeroDestaque} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});