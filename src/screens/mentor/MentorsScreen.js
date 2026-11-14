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

export default function MentorsScreen() {
  const theme = useTheme();

  return (
    // 1. O fundo da tela inteira agora é a cor principal (cinza no claro, escuro no dark)
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      
      {/* 2. O SafeAreaView agora envolve APENAS o cabeçalho roxo, protegendo apenas o topo */}
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
            <View style={styles.activeTab}>
              <Text style={[styles.activeTabText, { color: '#FFFFFF' }]}>
                Pendentes • {MENTORS.length}
              </Text>
              <View style={[styles.activeTabIndicator, { backgroundColor: '#FFFFFF' }]} />
            </View>
            <TouchableOpacity>
              <Text style={[styles.inactiveTabText, { color: theme.textSub }]}>
                Aprovados
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.inactiveTabText, { color: theme.textSub }]}>
                Reprovados
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* 3. O ScrollView rola em cima do fundo da View principal, eliminando a linha roxa inferior */}
      <ScrollView 
        style={[styles.mainContainer, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollPadding}
      >
        {MENTORS.map(mentor => (
          <MentorCard key={mentor.id} mentor={mentor} theme={theme} />
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