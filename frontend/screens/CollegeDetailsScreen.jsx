import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchCollegeDetails } from '../services/api';
import { globalStyles, colors, spacing, typography } from '../styles/globalStyles';
import BackButton from '../components/BackButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { normalize, rs } from '../utils/responsive';

const { width } = Dimensions.get('window');

const CollegeDetailsScreen = ({ navigation }) => {
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchCollegeDetails();
        
        let data = res.data;
        // Parse JSON fields if they are strings
        if (typeof data.stats === 'string') data.stats = JSON.parse(data.stats);
        if (typeof data.facilities === 'string') data.facilities = JSON.parse(data.facilities);
        if (typeof data.contactInfo === 'string') data.contactInfo = JSON.parse(data.contactInfo);
        
        setCollege(data);
      } catch (err) {
        setError('Failed to load institute profile');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLink = (type, val) => {
    if (!val) return;
    const url = type === 'tel' ? `tel:${val}` : type === 'url' ? (val.startsWith('http') ? val : `https://${val}`) : `mailto:${val}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link'));
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
            <Text style={styles.headerTitle}>Institute Profile</Text>
            <View style={{ width: rs(40) }} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
               <View style={styles.logoBox}>
                  <MaterialCommunityIcons name="school" size={rs(40)} color={colors.primaryLight} />
               </View>
               <Text style={styles.collegeName}>{college?.name}</Text>
               <Text style={styles.tagline}>{college?.tagline}</Text>
               
               <View style={styles.locRow}>
                  <Ionicons name="location" size={rs(14)} color={colors.text.secondary} />
                  <Text style={styles.locText}>{college?.location}</Text>
               </View>
            </View>

            {/* Stats Row */}
            {college?.stats && (
              <View style={styles.statsRow}>
                {college.stats.map((s, i) => (
                  <BlurView key={i} intensity={30} tint="dark" style={styles.statCard}>
                      <MaterialCommunityIcons name={s.icon} size={rs(22)} color={colors.primaryLight} />
                      <Text style={styles.statVal}>{s.value}</Text>
                      <Text style={styles.statLbl}>{s.label}</Text>
                  </BlurView>
                ))}
              </View>
            )}

            {/* About Section */}
            <BlurView intensity={25} tint="dark" style={styles.sectionCard}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="information-circle" size={rs(20)} color={colors.primaryLight} />
                  <Text style={styles.sectionTitle}>About Institution</Text>
               </View>
               <Text style={styles.sectionBody}>{college?.about}</Text>
            </BlurView>

            {/* Facilities */}
            {college?.facilities && (
              <>
                <Text style={styles.subheading}>World-Class Facilities</Text>
                <View style={styles.facilityGrid}>
                  {college.facilities.map((f, i) => (
                    <BlurView key={i} intensity={20} tint="dark" style={styles.facilityCard}>
                        <MaterialCommunityIcons name={f.icon} size={rs(28)} color={colors.primaryLight} />
                        <Text style={styles.facilityName}>{f.name}</Text>
                    </BlurView>
                  ))}
                </View>
              </>
            )}

            {/* Contact Grid */}
            {college?.contactInfo && (
              <>
                <Text style={styles.subheading}>Get in Touch</Text>
                <View style={styles.contactSection}>
                  <TouchableOpacity 
                      style={styles.contactBtn} 
                      onPress={() => handleLink('tel', college.contactInfo.phone)}
                  >
                      <BlurView intensity={40} tint="dark" style={styles.contactBlur}>
                        <Ionicons name="call" size={rs(20)} color={colors.success} />
                        <Text style={styles.contactTxt}>Call Us</Text>
                      </BlurView>
                  </TouchableOpacity>

                  <TouchableOpacity 
                      style={styles.contactBtn} 
                      onPress={() => handleLink('mail', college.contactInfo.email)}
                  >
                      <BlurView intensity={40} tint="dark" style={styles.contactBlur}>
                        <Ionicons name="mail" size={rs(20)} color={colors.primaryLight} />
                        <Text style={[styles.contactTxt, { color: colors.primaryLight }]}>Email</Text>
                      </BlurView>
                  </TouchableOpacity>

                  <TouchableOpacity 
                      style={styles.contactBtn} 
                      onPress={() => handleLink('url', college.contactInfo.website)}
                  >
                      <BlurView intensity={40} tint="dark" style={styles.contactBlur}>
                        <Ionicons name="globe" size={rs(20)} color={colors.secondary} />
                        <Text style={[styles.contactTxt, { color: colors.secondary }]}>Website</Text>
                      </BlurView>
                  </TouchableOpacity>
                </View>
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
    fontSize: normalize(18),
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: rs(20),
    paddingTop: rs(10),
    paddingBottom: rs(40),
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: rs(40),
    marginBottom: rs(20),
  },
  logoBox: {
    width: rs(110),
    height: rs(110),
    borderRadius: rs(35),
    backgroundColor: 'rgba(99,102,241,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rs(25),
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.15)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  collegeName: {
    fontSize: normalize(28),
    fontWeight: '900',
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: rs(10),
    letterSpacing: -1,
  },
  tagline: {
    fontSize: normalize(16),
    color: colors.primaryLight,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: rs(15),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(8),
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: rs(14),
    paddingVertical: rs(8),
    borderRadius: rs(12),
  },
  locText: {
    fontSize: normalize(13),
    color: colors.text.muted,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rs(35),
    gap: rs(10),
  },
  statCard: {
    flex: 1,
    borderRadius: rs(28),
    paddingVertical: rs(12),
    paddingHorizontal: rs(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  statVal: {
    fontSize: normalize(18),
    fontWeight: '900',
    color: colors.text.white,
    marginTop: rs(10),
    marginBottom: rs(4),
  },
  statLbl: {
    fontSize: normalize(10),
    color: colors.text.muted,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: rs(32),
    padding: rs(25),
    marginBottom: rs(35),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(12),
    marginBottom: rs(18),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '800',
    color: colors.text.white,
    letterSpacing: -0.3,
  },
  sectionBody: {
    fontSize: normalize(15),
    color: colors.text.muted,
    lineHeight: normalize(24),
    fontWeight: '500',
  },
  subheading: {
    fontSize: normalize(22),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(20),
    letterSpacing: -0.5,
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: rs(14),
    marginBottom: rs(35),
  },
  facilityCard: {
    width: '48%',
    borderRadius: rs(28),
    padding: rs(20),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  facilityName: {
    fontSize: normalize(15),
    fontWeight: '800',
    color: colors.text.white,
    marginTop: rs(15),
    letterSpacing: -0.2,
  },
  contactSection: {
    flexDirection: 'row',
    gap: rs(12),
  },
  contactBtn: {
    flex: 1,
    borderRadius: rs(22),
    overflow: 'hidden',
  },
  contactBlur: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rs(20),
    gap: rs(8),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  contactTxt: {
    fontSize: normalize(12),
    fontWeight: '900',
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});

export default CollegeDetailsScreen;
