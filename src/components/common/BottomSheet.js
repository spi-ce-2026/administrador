import { Modal, View, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

// Bottom sheet simples com Modal. Se o seu components/vouchers/BottomSheet.js
// já faz isso, pode usar o seu no lugar.
export default function BottomSheet({ visivel, onFechar, children }) {
  const tema = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar} statusBarTranslucent>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: tema.overlay }]} onPress={onFechar} accessibilityLabel="Fechar" />
        <View style={[styles.sheet, { backgroundColor: tema.card, paddingBottom: insets.bottom + 20 }]}>
          <View style={[styles.alca, { backgroundColor: tema.borda }]} />
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { marginTop: 'auto', borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 20, paddingTop: 10, gap: 14 },
  alca: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2 },
});
