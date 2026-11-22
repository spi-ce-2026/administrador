import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';

function confirmAction(title, message, onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: onConfirm },
    ]);
  }
}

export default function MentorCard({
  mentor,
  theme,
  onApprove,
  onReject,
  onResetToPending,
}) {
  const [expanded, setExpanded] = useState(mentor.isExpandedDefault ?? false);

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

  const confirmApprove = () => {
    confirmAction(
      'Aprovar Mentor',
      `Deseja aprovar o cadastro de ${mentor.name}?`,
      onApprove
    );
  };

  const confirmReject = () => {
    confirmAction(
      'Reprovar Mentor',
      `Deseja reprovar o cadastro de ${mentor.name}?`,
      onReject
    );
  };

  const isPending = !mentor.status || mentor.status === 'PENDENTE';

  return (
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

      {expanded && mentor.bio ? (
        <View style={styles.expandedContent}>
          <Text style={[styles.sectionTitle, { color: '#B388FF' }]}>MINIBIO</Text>
          <Text style={[styles.bioText, { color: theme.textMain }]}>{mentor.bio}</Text>

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

          {isPending ? (
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.btnReprovar} onPress={confirmReject}>
                <Text style={styles.txtReprovar}>Reprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnAprovar, { backgroundColor: theme.primary }]}
                onPress={confirmApprove}
              >
                <Text style={styles.txtAprovar}>Aprovar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.btnVoltarPendente, { borderColor: theme.cardBorder }]}
                onPress={onResetToPending}
              >
                <Text style={[styles.txtVoltarPendente, { color: theme.textMain }]}>
                  Voltar para pendente
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}
    </TouchableOpacity>
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
  btnVoltarPendente: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  txtVoltarPendente: {
    fontWeight: 'bold',
  },
});