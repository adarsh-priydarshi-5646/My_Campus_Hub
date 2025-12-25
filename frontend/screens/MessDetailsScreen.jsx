import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchMess } from '../services/api';
import { globalStyles, colors, spacing, typography } from '../styles/globalStyles';
import BackButton from '../components/BackButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { normalize, rs } from '../utils/responsive';

const MessDetailsScreen = ({ navigation }) => {
  const [messData, setMessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  const loadMessData = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);
      const res = await fetchMess();
      setMessData(res.data || []);
    } catch (err) {
      setError('Menu currently unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessData();
  }, []);

  const getCurrentMeal = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'Breakfast';
    if (hour >= 12 && hour < 15) return 'Lunch';
    if (hour >= 16 && hour < 18) return 'Snacks';
    if (hour >= 19 && hour < 22) return 'Dinner';
    return null;
  };

  const currentMealType = getCurrentMeal();
  const currentDayData = messData.find(d => d.day === selectedDay);

  const renderMealBox = (type, content, icon, color) => {
    const isLive = type === currentMealType && selectedDay === new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return (
      <BlurView intensity={25} tint="dark" style={[styles.mealCard, isLive && styles.liveCard]}>
        <View style={styles.mealHeader}>
          <View style={[styles.mealIcon, { backgroundColor: `${color}15` }]}>
            <MaterialCommunityIcons name={icon} size={rs(24)} color={color} />
          </View>
          <View style={styles.mealTitleBox}>
             <Text style={styles.mealType}>{type}</Text>
             {isLive && (
               <View style={styles.liveTag}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>CURRENTLY SERVING</Text>
               </View>
             )}
          </View>
        </View>
        <Text style={styles.mealContent}>{content || 'Not scheduled'}</Text>
      </BlurView>
    );
  };

  if (loading) {
     return (
       <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
       </View>
     );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground variant="gradient">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topNav}>
            <BackButton onPress={() => navigation.goBack()} color="#fff" />
            <Text style={styles.headerTitle}>Campus Dining</Text>
            <View style={{ width: rs(40) }} />
          </View>

          <View style={styles.daySelector}>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayBar}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <TouchableOpacity 
                    key={d} 
                    activeOpacity={0.8}
                    style={[styles.dayChip, selectedDay === d && styles.activeDayChip]}
                    onPress={() => setSelectedDay(d)}
                  >
                    <Text style={[styles.dayText, selectedDay === d && styles.activeDayText]}>{d.substring(0, 3)}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
             <View style={styles.todayBanner}>
                <Text style={styles.todayHeading}>{selectedDay}'s Menu</Text>
                <Text style={styles.todaySubheading}>Pure Vegetarian & Balanced Meals</Text>
             </View>

             {error ? (
               <View style={styles.errorContainer}>
                  <Ionicons name="fast-food-outline" size={rs(48)} color={colors.text.muted} />
                  <Text style={styles.errorText}>{error}</Text>
               </View>
             ) : (
               <>
                 {renderMealBox('Breakfast', currentDayData?.breakfast, 'weather-sunny', '#fbbf24')}
                 {renderMealBox('Lunch', currentDayData?.lunch, 'food-variant', '#3b82f6')}
                 {renderMealBox('Snacks', currentDayData?.snacks, 'coffee', '#10b981')}
                 {renderMealBox('Dinner', currentDayData?.dinner, 'weather-night', '#6366f1')}

                 <BlurView intensity={20} tint="dark" style={styles.infoBox}>
                    <Ionicons name="time" size={rs(20)} color={colors.primaryLight} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Kitchen Timings</Text>
                        <Text style={styles.infoText}>{currentDayData?.timing || '7:00 AM - 9:30 PM'}</Text>
                    </View>
                 </BlurView>
               </>
             )}
             
             <View style={{ height: rs(60) }} />
          </ScrollView>
        </SafeAreaView>
      </AnimatedBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rs(20),
    paddingVertical: rs(10),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -0.8,
  },
  daySelector: {
    marginVertical: rs(20),
  },
  dayBar: {
    paddingHorizontal: rs(20),
    gap: rs(14),
  },
  dayChip: {
    width: rs(65),
    height: rs(65),
    borderRadius: rs(24),
    backgroundColor: 'rgba(255,255,255,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activeDayChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  dayText: {
    fontSize: normalize(14),
    fontWeight: '800',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeDayText: {
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: rs(20),
    paddingBottom: rs(40),
  },
  todayBanner: {
    marginBottom: rs(30),
    marginTop: rs(10),
  },
  todayHeading: {
    fontSize: normalize(28),
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -1,
  },
  todaySubheading: {
    fontSize: normalize(15),
    color: colors.text.muted,
    fontWeight: '600',
    marginTop: rs(4),
  },
  mealCard: {
    borderRadius: rs(32),
    padding: rs(25),
    marginBottom: rs(18),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  liveCard: {
    borderColor: 'rgba(99,102,241,0.25)',
    backgroundColor: 'rgba(99,102,241,0.03)',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rs(20),
  },
  mealIcon: {
    width: rs(56),
    height: rs(56),
    borderRadius: rs(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(18),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  mealTitleBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    fontSize: normalize(20),
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -0.5,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.08)',
    paddingHorizontal: rs(12),
    paddingVertical: rs(7),
    borderRadius: rs(12),
    gap: rs(8),
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
  },
  liveDot: {
    width: rs(8),
    height: rs(8),
    borderRadius: rs(4),
    backgroundColor: colors.success,
  },
  liveText: {
    fontSize: normalize(10),
    fontWeight: '900',
    color: colors.success,
    letterSpacing: 0.5,
  },
  mealContent: {
    fontSize: normalize(16),
    color: colors.text.muted,
    lineHeight: normalize(26),
    fontWeight: '600',
    marginLeft: rs(74),
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rs(25),
    borderRadius: rs(28),
    marginTop: rs(20),
    gap: rs(18),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: normalize(12),
    color: colors.primaryLight,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: rs(4),
    letterSpacing: 1,
  },
  infoText: {
    fontSize: normalize(15),
    color: colors.text.white,
    fontWeight: '800',
  },
  errorContainer: {
    padding: rs(80),
    alignItems: 'center',
    gap: rs(20),
  },
  errorText: {
    color: colors.text.muted,
    fontWeight: '800',
    fontSize: normalize(16),
    letterSpacing: 0.5,
  }
});

export default MessDetailsScreen;
