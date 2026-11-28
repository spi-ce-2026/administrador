import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import ActionReasonModal from './ActionReasonModal';

export default function MentorCard({
  mentor,
  theme,
  onApprove,
  onReject,
}) {
  const [expanded, setExpanded] = useState(mentor.isExpandedDefault ?? false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: null, // 'APPROVE' | 'REJECT'
  });

  const handleOpenLink = async () => {
    if (!mentor.link) return;
    const url = mentor.link.startsWith('http')
      ? mentor.link
      : `https://${mentor.link}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o link de agendamento.');
    }
  };

  const handleConfirmModal = (reason) => {
    const actionType = modalConfig.type;
    setModalConfig({ visible: false, type: null });

    if (actionType === 'APPROVE') {
      onApprove(reason);
    } else if (actionType === 'REJECT') {
      onReject(reason);
    }
  };

  const isPending = !mentor.status || mentor.status === 'PENDENTE';
  const isRejected = mentor.status === 'REPROVADO';

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
        style={[
          styles.card,
          { backgroundColor: theme.cardBackground },
          expanded ? { borderColor: theme.cardBorder } : { borderColor: 'transparent' },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.avatarBg }]}>
            <Text style={[styles.avatarText, { color: '#B388FF' }]}>{mentor.initials}</Text>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={[styles.mentorName, { color: theme.textMain }]}>{mentor.name}</Text>
            <Text style={[styles.mentorRole, { color: theme.textSub }]}>{mentor.role}</Text>
          </View>
          <Text style={{ color: theme.textSub, fontSize: 16 }}>
            {expanded ? '︿' : '﹀'}
          </Text>
        </View>

        {expanded && (
          <View style={styles.expandedContent}>
            {mentor.bio ? (
              <>
                <Text style={[styles.sectionTitle, { color: '#B388FF' }]}>MINIBIO</Text>
                <Text style={[styles.bioText, { color: theme.textMain }]}>{mentor.bio}</Text>
              </>
            ) : null}

            {mentor.tags?.length > 0 && (
              <View style={styles.tagsContainer}>
                {mentor.tags.map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: theme.tagBg }]}>
                    <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {mentor.link ? (
              <TouchableOpacity style={styles.linkContainer} onPress={handleOpenLink}>
                <Text style={styles.linkIcon}>📅</Text>
                <Text style={[styles.linkText, { color: '#B388FF' }]}>{mentor.link}</Text>
              </TouchableOpacity>
            ) : null}

            {isRejected && mentor.rejectionReason ? (
              <View style={styles.rejectionBox}>
                <Text style={styles.rejectionTitle}>MOTIVO DA RECUSA</Text>
                <Text style={[styles.rejectionText, { color: theme.textMain }]}>
                  {mentor.rejectionReason}
                </Text>
              </View>
            ) : null}

            {isPending && (
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
                  <Text style={styles.txtAprovar}>Aprovar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      <ActionReasonModal
        visible={modalConfig.visible}
        title={modalConfig.type === 'APPROVE' ? 'Aprovar Mentor' : 'Reprovar Mentor'}
        message={
          modalConfig.type === 'APPROVE'
            ? `Deseja aprovar o cadastro de ${mentor.name}?`
            : `Informe o motivo da recusa do cadastro de ${mentor.name}:`
        }
        confirmLabel={modalConfig.type === 'APPROVE' ? 'Aprovar' : 'Reprovar'}
        confirmColor={modalConfig.type === 'APPROVE' ? theme.primary : '#E57373'}
        requireReason={modalConfig.type === 'REJECT'}
        placeholder={
          modalConfig.type === 'APPROVE'
            ? 'Ex: Perfil validado com sucesso (opcional)...'
            : 'Ex: Faltam informações na minibio ou link inválido...'
        }
        theme={theme}
        onCancel={() => setModalConfig({ visible: false, type: null })}
        onConfirm={handleConfirmModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mentorRole: {
    fontSize: 14,
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  linkIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rejectionBox: {
    backgroundColor: 'rgba(229, 115, 115, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#E57373',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  rejectionTitle: {
    color: '#E57373',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    lineHeight: 18,
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
    marginRight: 6,
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
    marginLeft: 6,
  },
  txtAprovar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});