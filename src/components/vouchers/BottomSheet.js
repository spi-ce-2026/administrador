import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export default function BottomSheet({ visivel, aoFechar, children }) {
  const tema = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={aoFechar}>
      <KeyboardAvoidingView
        style={styles.raiz}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: tema.sobreposicao }]}
          onPress={aoFechar}
          accessibilityLabel="Fechar"
        />
        <View
          style={[styles.sheet, { backgroundColor: tema.card, paddingBottom: insets.bottom + 16 }]}
        >
          <View style={[styles.alca, { backgroundColor: tema.borda }]} />
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '90%',
  },
  alca: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: 14 },
});
