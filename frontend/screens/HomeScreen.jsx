import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  RefreshControl,
  Animated,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchSemesters } from '../services/api';
import { colors, typography, spacing, isSmallScreen } from '../styles/globalStyles';
import { normalize, rs } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  const loadSemesters = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      const res = await fetchSemesters();
      
      const sortedSemesters = res.data.sort((a, b) => {
        const aNum = parseInt(a.name.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.name.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
      });
      setSemesters(sortedSemesters);
    } catch (err) {
      if (err.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again.', [{ text: 'OK', onPress: logout }]);
        return;
      }
      setError('Curriculum currently unavailable');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSemesters();
  }, []);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout }
    ]);
  };

  const renderQuickAccess = (title, icon, color, onPress, badge) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.cardWrapper} 
      onPress={onPress}
    >
      <BlurView intensity={30} tint="dark" style={styles.quickAccessCard}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          {React.cloneElement(icon, { size: rs(24), color: color })}
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        {badge && (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground variant="gradient">
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => loadSemesters(true)} tintColor={colors.primary} />
            }
          >
            {/* Custom Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greetingText}>Welcome back,</Text>
                <View style={styles.userNameContainer}>
                   <Text style={styles.userNameText}>{user?.name?.split(' ')[0] || 'Explorer'}</Text>
                   <MaterialCommunityIcons name="hand-wave" size={rs(28)} color="#fcd34d" style={styles.waveIcon} />
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.headerIconBtn}
                  onPress={() => navigation.navigate('Profile')}
                >
                  <BlurView intensity={40} tint="dark" style={styles.iconBlur}>
                    <Ionicons name="person" size={rs(20)} color={colors.text.white} />
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerIconBtn}
                  onPress={handleLogout}
                >
                  <BlurView intensity={40} tint="dark" style={styles.iconBlur}>
                    <Ionicons name="log-out" size={rs(20)} color={colors.danger} />
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>

            {/* Banner/Status Card */}
            <TouchableOpacity activeOpacity={0.9} style={styles.bannerContainer}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerGradient}
              >
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>Term Finals Approaching</Text>
                  <Text style={styles.bannerSubtitle}>Access roadmap and key subjects to stay prepared.</Text>
                  <View style={styles.bannerBtn}>
                    <Text style={styles.bannerBtnText}>View Schedule</Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                  </View>
                </View>
                <View style={styles.bannerIconBox}>
                  <MaterialCommunityIcons name="calendar-clock" size={rs(90)} color="rgba(255,255,255,0.15)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Access Grid */}
            <Text style={styles.sectionHeading}>Campus Essentials</Text>
            <View style={styles.grid}>
              {renderQuickAccess('Faculty', <FontAwesome5 name="chalkboard-teacher" />, '#60a5fa', () => navigation.navigate('Faculty'), 'Verified')}
              {renderQuickAccess('Events', <MaterialIcons name="event" />, '#34d399', () => navigation.navigate('Events'), 'New')}
              {renderQuickAccess('Mess', <MaterialIcons name="restaurant" />, '#fbbf24', () => navigation.navigate('MessDetails'), 'Live')}
              {renderQuickAccess('College', <MaterialCommunityIcons name="school" />, '#a78bfa', () => navigation.navigate('CollegeDetails'), 'Info')}
            </View>

            {/* Semesters Section */}
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Academic Roadmap</Text>
                <TouchableOpacity onPress={() => loadSemesters(true)}>
                    <Ionicons name="refresh" size={rs(20)} color={colors.primaryLight} />
                </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingText}>Loading curriculum...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorBox}>
                <Ionicons name="cloud-offline" size={rs(32)} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => loadSemesters()}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.semesterList}>
                {semesters.map((item, index) => (
                  <TouchableOpacity 
                    key={item.id} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('SemesterDetails', { semesterId: item.id, semesterName: item.name })}
                  >
                    <BlurView intensity={25} tint="dark" style={styles.semesterCard}>
                      <View style={styles.semesterInfo}>
                        <LinearGradient
                          colors={[`${colors.primary}40`, `${colors.secondary}40`]}
                          style={styles.semesterNumberBox}
                        >
                          <Text style={styles.semesterNumberText}>{index + 1}</Text>
                        </LinearGradient>
                        <View>
                          <Text style={styles.semesterNameText}>{item.name}</Text>
                          <Text style={styles.semesterStatusText}>Foundation & Core Subjects</Text>
                        </View>
                      </View>
                      <View style={styles.chevronBox}>
                        <Ionicons name="chevron-forward" size={rs(18)} color="rgba(255,255,255,0.4)" />
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.footerSpace} />
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
  scrollContent: {
    paddingHorizontal: rs(20),
    paddingTop: rs(10),
    paddingBottom: rs(100),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(30),
    marginTop: rs(10),
  },
  greetingText: {
    fontSize: normalize(14),
    color: colors.text.muted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(10),
    marginTop: rs(4),
  },
  userNameText: {
    fontSize: normalize(28),
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -1,
  },
  waveIcon: {
    marginTop: rs(2),
  },
  headerActions: {
    flexDirection: 'row',
    gap: rs(12),
  },
  headerIconBtn: {
    width: rs(50),
    height: rs(50),
    borderRadius: rs(18),
    overflow: 'hidden',
  },
  iconBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bannerContainer: {
    marginBottom: rs(40),
    borderRadius: rs(32),
    overflow: 'hidden',
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bannerGradient: {
    flexDirection: 'row',
    padding: rs(25),
    minHeight: rs(180),
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: normalize(24),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(10),
    letterSpacing: -0.8,
  },
  bannerSubtitle: {
    fontSize: normalize(15),
    color: 'rgba(255,255,255,0.7)',
    marginBottom: rs(25),
    lineHeight: normalize(22),
    fontWeight: '500',
  },
  bannerBtn: {
    backgroundColor: colors.text.white,
    paddingHorizontal: rs(20),
    paddingVertical: rs(12),
    borderRadius: rs(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(8),
    alignSelf: 'flex-start',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bannerBtnText: {
    fontSize: normalize(14),
    fontWeight: '900',
    color: colors.primary,
  },
  bannerIconBox: {
    position: 'absolute',
    right: rs(-20),
    bottom: rs(-20),
    opacity: 0.2,
  },
  sectionHeading: {
    fontSize: normalize(22),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(20),
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: rs(35),
  },
  cardWrapper: {
    width: '48%',
    marginBottom: rs(16),
  },
  quickAccessCard: {
    borderRadius: rs(30),
    padding: rs(22),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  iconContainer: {
    width: rs(60),
    height: rs(60),
    borderRadius: rs(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rs(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTitle: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: colors.text.white,
    letterSpacing: -0.3,
  },
  badge: {
    position: 'absolute',
    top: rs(15),
    right: rs(15),
    paddingHorizontal: rs(10),
    paddingVertical: rs(5),
    borderRadius: rs(10),
  },
  badgeText: {
    fontSize: normalize(10),
    fontWeight: '900',
    color: colors.text.white,
    textTransform: 'uppercase',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(20),
  },
  semesterList: {
    gap: rs(14),
  },
  semesterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rs(20),
    borderRadius: rs(28),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  semesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  semesterNumberBox: {
    width: rs(52),
    height: rs(52),
    borderRadius: rs(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(18),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  semesterNumberText: {
    fontSize: normalize(22),
    fontWeight: '900',
    color: colors.text.white,
  },
  semesterNameText: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: colors.text.white,
    marginBottom: rs(4),
    letterSpacing: -0.4,
  },
  semesterStatusText: {
    fontSize: normalize(13),
    color: colors.text.muted,
    fontWeight: '600',
  },
  chevronBox: {
    width: rs(36),
    height: rs(36),
    borderRadius: rs(12),
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  loadingBox: {
    padding: rs(80),
    alignItems: 'center',
    gap: rs(20),
  },
  loadingText: {
    color: colors.text.muted,
    fontWeight: '800',
    fontSize: normalize(15),
    letterSpacing: 0.5,
  },
  errorBox: {
    padding: rs(40),
    backgroundColor: 'rgba(239,68,68,0.05)',
    borderRadius: rs(32),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
  },
  errorText: {
    color: colors.danger,
    fontWeight: '800',
    fontSize: normalize(16),
    marginVertical: rs(15),
    textAlign: 'center',
    lineHeight: normalize(24),
  },
  retryBtn: {
    paddingHorizontal: rs(25),
    paddingVertical: rs(12),
    backgroundColor: colors.danger,
    borderRadius: rs(14),
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: normalize(14),
    textTransform: 'uppercase',
  },
  footerSpace: {
    height: rs(60),
  }
});

export default HomeScreen;
