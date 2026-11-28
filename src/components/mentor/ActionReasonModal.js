import  { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function ActionReasonModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  confirmColor = '#7C4DFF',
  requireReason = false,
  placeholder = 'Informe o motivo ou observação...',
  theme,
  onCancel,
  onConfirm,
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setReason('');
      setError('');
    }
  }, [visible]);

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError('Por favor, informe o motivo antes de continuar.');
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.dialog, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.title, { color: theme.textMain }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.textSub }]}>{message}</Text>

          <Text style={[styles.inputLabel, { color: theme.textMain }]}>
            {requireReason ? 'Motivo (obrigatório)' : 'Observação / Motivo (opcional)'}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textMain,
                borderColor: error ? '#E57373' : theme.cardBorder || 'rgba(150,150,150,0.3)',
                backgroundColor: theme.background,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={theme.textSub}
            value={reason}
            onChangeText={(text) => {
              setReason(text);
              if (error) setError('');
            }}
            multiline
            numberOfLines={3}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={[styles.cancelText, { color: theme.textSub }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: confirmColor }]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  errorText: {
    color: '#E57373',
    fontSize: 12,
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 14,
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});