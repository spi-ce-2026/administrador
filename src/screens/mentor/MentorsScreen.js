import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import MentorCard from '../../components/mentor/MentorCard';
import ThemeToggleButton from '../../components/ThemeToggleButton'; 
import { MENTORS } from '../../mocks/mentor/mentorsData';
import { mentorService } from '../../services/mentor/mentorService';

const TABS = [
  { key: 'PENDENTE', label: 'Pendentes' },
  { key: 'APROVADO', label: 'Aprovados' },
  { key: 'REPROVADO', label: 'Reprovados' },
];

export default function MentorsScreen() {
  const theme = useTheme();
  const [mentors, setMentors] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDENTE');

  useEffect(() => {
    loadMentors();
  }, []);

  async function loadMentors() {
    try {
      const data = await mentorService.getMentors();
      setMentors(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os mentores.');
    }
  }

  async function handleApprove(id) {
    try {
      await mentorService.approveMentor(id);
      setMentors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'APROVADO' } : m))
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aprovar o mentor.');
    }
  }

  async function handleReject(id) {
    try {
      await mentorService.rejectMentor(id);
      setMentors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'REPROVADO' } : m))
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reprovar o mentor.');
    }
  }

  async function handleResetToPending(id) {
    try {
      await mentorService.resetMentorToPending(id);
      setMentors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'PENDENTE' } : m))
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível retornar o mentor para pendente.');
    }
  }

  const filteredMentors = mentors.filter((m) => m.status === activeTab);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />

      <SafeAreaView style={{ backgroundColor: theme.headerBg }} edges={['top']}>
        <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerSubtitle, { color: theme.textSub }]}>
                Gerenciamento
              </Text>
              <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
                Mentores
              </Text>
            </View>

            <ThemeToggleButton />
          </View>

          <View style={styles.tabsContainer}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = mentors.filter((m) => m.status === tab.key).length;

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
                        : [styles.inactiveTabText, { color: theme.textSub }]
                    }
                  >
                    {isActive ? `${tab.label} • ${count}` : tab.label}
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
        {filteredMentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            theme={theme}
            onApprove={() => handleApprove(mentor.id)}
            onReject={() => handleReject(mentor.id)}
            onResetToPending={() => handleResetToPending(mentor.id)}
          />
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
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});