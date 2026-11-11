import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MentorCard from '../components/MentorCard';
import { getTheme } from '../theme/colors';
import { MENTORS } from '../mocks/mentorsData';

export default function MentorsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Carrega o tema do AsyncStorage ao abrir a tela
  useEffect(() => {
    carregarTemaSalvo();
  }, []);

  const carregarTemaSalvo = async () => {
    try {
      const temaSalvo = await AsyncStorage.getItem('@preferencia_tema');
      if (temaSalvo !== null) {
        setIsDarkMode(JSON.parse(temaSalvo));
      }
    } catch (e) {
      console.error('Erro ao ler tema', e);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Atualiza o useState e o AsyncStorage ao mesmo tempo
  const alternarTema = async (novoValor) => {
    setIsDarkMode(novoValor);
    try {
      await AsyncStorage.setItem('@preferencia_tema', JSON.stringify(novoValor));
    } catch (e) {
      console.error('Erro ao salvar tema', e);
    }
  };

  const theme = getTheme(isDarkMode);

  // Evita a tela piscar no modo claro antes de carregar o AsyncStorage
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.headerBg }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.headerBg }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSubtitle}>Gerenciamento</Text>
            <Text style={styles.headerTitle}>Mentores</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={alternarTema}
            trackColor={{ false: '#767577', true: '#B388FF' }}
            thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.activeTab}>
            <Text style={styles.activeTabText}>Pendentes • {MENTORS.length}</Text>
            <View style={styles.activeTabIndicator} />
          </View>
          <TouchableOpacity>
            <Text style={styles.inactiveTabText}>Aprovados</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.inactiveTabText}>Reprovados</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={[styles.mainContainer, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollPadding}
      >
        {MENTORS.map(mentor => (
          <MentorCard key={mentor.id} mentor={mentor} theme={theme} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#480CA8',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerSubtitle: {
    color: '#D1C4E9',
    fontSize: 14,
  },
  headerTitle: {
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  activeTabIndicator: {
    height: 3,
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  inactiveTabText: {
    color: '#B39DDB',
    fontSize: 14,
    marginBottom: 11,
  },
  mainContainer: {
    flex: 1,
  },
  scrollPadding: {
    padding: 20,
  },
});