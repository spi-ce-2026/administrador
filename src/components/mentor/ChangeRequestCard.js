import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ActionReasonModal from './ActionReasonModal';

export default function ChangeRequestCard({
  request,
  theme,
  onApprove,
  onReject,
}) {
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: null, // 'APPROVE' | 'REJECT'
  });

  const handleConfirm = (reason) => {
    const type = modalConfig.type;
    setModalConfig({ visible: false, type: null });

    if (type === 'APPROVE') {
      onApprove(reason);
    } else if (type === 'REJECT') {
      onReject(reason);
    }
  };

  return (
    <>
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: '#B388FF' }]}>MENTORADO</Text>
            <Text style={[styles.title, { color: theme.textMain }]}>
              {request.menteeName}
            </Text>
          </View>
          {request.createdAt ? (
            <Text style={[styles.dateText, { color: theme.textSub }]}>
              {request.createdAt}
            </Text>
          ) : null}
        </View>

        <View style={styles.mentorRow}>
          <Text style={[styles.subLabel, { color: theme.textSub }]}>
            Mentor atual:{' '}
            <Text style={{ color: theme.textMain, fontWeight: '600' }}>
              {request.currentMentorName}
            </Text>
          </Text>
        </View>

        <View style={styles.reasonBox}>
          <Text style={[styles.label, { color: '#B388FF' }]}>
            JUSTIFICATIVA DO MENTORADO
          </Text>
          <Text style={[styles.reasonText, { color: theme.textMain }]}>
            {request.reason}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.btnReprovar}
            onPress={() => setModalConfig({ visible: true, type: 'REJECT' })}
          >
            <Text style={styles.txtReprovar}>Reprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnAprovar, { backgroundColor: theme.primary }]}
            onPress={() => setModalConfig({ visible: true, type: 'APPROVE' })}
          >
            <Text style={styles.txtAprovar}>Aprovar Troca</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ActionReasonModal
        visible={modalConfig.visible}
        title={
          modalConfig.type === 'APPROVE'
            ? 'Aprovar Solicitação de Troca'
            : 'Reprovar Solicitação de Troca'
        }
        message={
          modalConfig.type === 'APPROVE'
            ? `Ao aprovar, o sistema executará um novo matchmaking para ${request.menteeName}.`
            : `Informe o motivo da recusa da troca para ${request.menteeName}:`
        }
        confirmLabel={modalConfig.type === 'APPROVE' ? 'Aprovar e Iniciar Matchmaking' : 'Reprovar'}
        confirmColor={modalConfig.type === 'APPROVE' ? theme.primary : '#E57373'}
        requireReason={modalConfig.type === 'REJECT'}
        theme={theme}
        onCancel={() => setModalConfig({ visible: false, type: null })}
        onConfirm={handleConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
  },
  mentorRow: {
    marginBottom: 14,
  },
  subLabel: {
    fontSize: 14,
  },
  reasonBox: {
    backgroundColor: 'rgba(179, 136, 255, 0.08)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btnReprovar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E57373',
    alignItems: 'center',
  },
  txtReprovar: {
    color: '#E57373',
    fontWeight: 'bold',
  },
  btnAprovar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  txtAprovar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});