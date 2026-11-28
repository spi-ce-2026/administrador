import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import MentorCard from '../../components/mentor/MentorCard';
import ChangeRequestCard from '../../components/mentor/ChangeRequestCard';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { mentorService } from '../../services/mentor/mentorService';

const MENTOR_TABS = [
  { key: 'PENDENTE', label: 'Pendentes' },
  { key: 'APROVADO', label: 'Aprovados' },
  { key: 'REPROVADO', label: 'Reprovados' },
];

const MENTORSHIP_TABS = [
  { key: 'TROCAS', label: 'Solicitações de Troca' },
  { key: 'EXPIRADAS', label: 'Expiradas' },
];

export default function MentorsScreen() {
  const theme = useTheme();
  const [mentors, setMentors] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [expiredMentorships, setExpiredMentorships] = useState([]);

  // Menu principal: 'MENTORES' | 'MENTORIAS'
  const [mainSection, setMainSection] = useState('MENTORES');
  // Sub-aba ativa dentro da seção selecionada
  const [activeTab, setActiveTab] = useState('PENDENTE');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [mentorsData, requestsData, expiredData] = await Promise.all([
        mentorService.getMentors(),
        mentorService.getChangeRequests(),
        mentorService.getExpiredMentorships(),
      ]);
      setMentors(mentorsData);
      setChangeRequests(requestsData);
      setExpiredMentorships(expiredData);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os dados de mentorias.');
    }
  }

  function handleSelectSection(section) {
    setMainSection(section);
    if (section === 'MENTORES') {
      setActiveTab('PENDENTE');
    } else {
      setActiveTab('TROCAS');
    }
  }

  async function handleApproveMentor(id, motivo) {
    try {
      await mentorService.approveMentor(id, motivo);
      setMentors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'APROVADO' } : m))
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível aprovar o mentor.');
    }
  }

  async function handleRejectMentor(id, motivo) {
    try {
      await mentorService.rejectMentor(id, motivo);
      setMentors((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status: 'REPROVADO',
                rejectionReason: motivo || 'Reprovado pelo administrador',
              }
            : m
        )
      );
    } catch  {
      Alert.alert('Erro', 'Não foi possível reprovar o mentor.');
    }
  }

  async function handleApproveChangeRequest(id, motivo) {
    try {
      await mentorService.handleChangeRequest(id, true, motivo);
      setChangeRequests((prev) => prev.filter((req) => req.id !== id));
      Alert.alert(
        'Solicitação Aprovada',
        'O sistema iniciou um novo matchmaking para o mentorado.'
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível aprovar a solicitação de troca.');
    }
  }

  async function handleRejectChangeRequest(id, motivo) {
    try {
      await mentorService.handleChangeRequest(id, false, motivo);
      setChangeRequests((prev) => prev.filter((req) => req.id !== id));
    } catch  {
      Alert.alert('Erro', 'Não foi possível reprovar a solicitação de troca.');
    }
  }

  function getTabCount(tabKey) {
    if (tabKey === 'TROCAS') return changeRequests.length;
    if (tabKey === 'EXPIRADAS') return expiredMentorships.length;
    return mentors.filter((m) => m.status === tabKey).length;
  }

  const currentTabs = mainSection === 'MENTORES' ? MENTOR_TABS : MENTORSHIP_TABS;
  const filteredMentors = mentors.filter((m) => m.status === activeTab);

  // Badges totais do menu principal
  const pendingMentorsCount = mentors.filter((m) => m.status === 'PENDENTE').length;
  const mentorshipsAlertsCount = changeRequests.length + expiredMentorships.length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />

      <SafeAreaView style={{ backgroundColor: theme.headerBg }} edges={['top']}>
        <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
          {/* Topo do Header */}
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerSubtitle, { color: '#eae9f3',}]}>
                Gerenciamento
              </Text>
              <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
                Mentorias
              </Text>
            </View>

            <ThemeToggleButton />
          </View>

          {/* Menu Principal (Mentores | Mentorias) */}
          <View style={styles.sectionMenu}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.sectionMenuItem,
                mainSection === 'MENTORES' && styles.sectionMenuItemActive,
              ]}
              onPress={() => handleSelectSection('MENTORES')}
            >
              <Text
                style={[
                  styles.sectionMenuText,
                  mainSection === 'MENTORES'
                    ? styles.sectionMenuTextActive
                    : { color: '#eae9f3', },
                ]}
              >
                Mentores
              </Text>
              {pendingMentorsCount > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{pendingMentorsCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.sectionMenuItem,
                mainSection === 'MENTORIAS' && styles.sectionMenuItemActive,
              ]}
              onPress={() => handleSelectSection('MENTORIAS')}
            >
              <Text
                style={[
                  styles.sectionMenuText,
                  mainSection === 'MENTORIAS'
                    ? styles.sectionMenuTextActive
                    : { color: '#eae9f3', },
                ]}
              >
                Mentorias
              </Text>
              {mentorshipsAlertsCount > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{mentorshipsAlertsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Sub-abas da seção selecionada */}
          <View style={styles.tabsContainer}>
            {currentTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = getTabCount(tab.key);

              return (
                <TouchableOpacity
                  key={tab.key}
                  style={isActive ? styles.activeTab : undefined}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text
                    style={
                      isActive
                        ? [styles.activeTabText, { color: '#FFFFFF' }]
                        : [styles.inactiveTabText, { color: '#eae9f3', }]
                    }
                  >
                    {isActive ? `${tab.label} • ${count}` : `${tab.label} (${count})`}
                  </Text>
                  {isActive && (
                    <View
                      style={[
                        styles.activeTabIndicator,
                        { backgroundColor: '#FFFFFF' },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={[styles.mainContainer, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollPadding}
      >
        {/* Conteúdo da seção MENTORES */}
        {mainSection === 'MENTORES' &&
          (filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                theme={theme}
                onApprove={(motivo) => handleApproveMentor(mentor.id, motivo)}
                onReject={(motivo) => handleRejectMentor(mentor.id, motivo)}
              />
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSub }]}>
              Nenhum mentor encontrado nesta aba.
            </Text>
          ))}

        {/* Conteúdo da seção MENTORIAS -> Solicitações de Troca */}
        {mainSection === 'MENTORIAS' &&
          activeTab === 'TROCAS' &&
          (changeRequests.length > 0 ? (
            changeRequests.map((req) => (
              <ChangeRequestCard
                key={req.id}
                request={req}
                theme={theme}
                onApprove={(motivo) => handleApproveChangeRequest(req.id, motivo)}
                onReject={(motivo) => handleRejectChangeRequest(req.id, motivo)}
              />
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSub }]}>
              Nenhuma solicitação de troca pendente.
            </Text>
          ))}

        {/* Conteúdo da seção MENTORIAS -> Expiradas */}
        {mainSection === 'MENTORIAS' &&
          activeTab === 'EXPIRADAS' &&
          (expiredMentorships.length > 0 ? (
            expiredMentorships.map((item) => (
              <View
                key={item.id}
                style={[styles.expiredCard, { backgroundColor: theme.cardBackground }]}
              >
                <View style={styles.expiredHeader}>
                  <Text style={[styles.expiredTitle, { color: theme.textMain }]}>
                    {item.menteeName} ↔ {item.mentorName}
                  </Text>
                  <View style={styles.expiredBadge}>
                    <Text style={styles.expiredBadgeText}>
                      {item.daysWithoutSchedule} dias sem agendamento
                    </Text>
                  </View>
                </View>
                <Text style={[styles.expiredSub, { color: theme.textSub }]}>
                  Match realizado em: {item.createdAt}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSub }]}>
              Nenhuma mentoria expirada no momento.
            </Text>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionMenu: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  sectionMenuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 8,
  },
  sectionMenuItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  sectionMenuText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionMenuTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuBadge: {
    backgroundColor: '#B388FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  menuBadgeText: {
    color: '#1A1A2E',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activeTab: {
    alignItems: 'center',
  },
  activeTabText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  activeTabIndicator: {
    height: 3,
    width: '100%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  inactiveTabText: {
    fontSize: 14,
    marginBottom: 11,
  },
  mainContainer: {
    flex: 1,
  },
  scrollPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  expiredCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  expiredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  expiredTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  expiredBadge: {
    backgroundColor: 'rgba(229, 115, 115, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredBadgeText: {
    color: '#E57373',
    fontSize: 12,
    fontWeight: '600',
  },
  expiredSub: {
    fontSize: 13,
  },
});