export const getTheme = (isDarkMode) => ({
  background: isDarkMode ? '#0D0914' : '#F5F6FA',
  cardBackground: isDarkMode ? '#1E182D' : '#FFFFFF',
  textMain: isDarkMode ? '#FFFFFF' : '#1A1A1A',
  textSub: isDarkMode ? '#A09DB0' : '#666666',
  headerBg: '#480CA8',
  primary: '#480CA8',
  cardBorder: isDarkMode ? '#5E27C5' : '#480CA8',
  tagBg: isDarkMode ? '#2D1B4E' : '#F0E6FF',
  tagText: isDarkMode ? '#B388FF' : '#480CA8',
  avatarBg: isDarkMode ? '#480CA8' : '#F0E6FF',
});