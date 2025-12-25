import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchTeacherById } from '../services/api';
import { colors, spacing, typography } from '../styles/globalStyles';
import BackButton from '../components/BackButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { normalize, rs } from '../utils/responsive';

const { width } = Dimensions.get('window');

const FacultyDetailScreen = ({ route, navigation }) => {
  const { teacherId } = route.params;
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTeacherDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchTeacherById(teacherId);
      setTeacher(res.data);
    } catch (err) {
      console.error('Error loading teacher details:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherDetails();
  }, [teacherId]);

  const handleLinkedInPress = () => {
    if (teacher?.linkedin) {
      Linking.openURL(teacher.linkedin).catch(() => Alert.alert('Error', 'Could not open LinkedIn'));
    }
  };

  const handleEmailPress = () => {
    if (teacher?.email || teacher?.contact) {
      Linking.openURL(`mailto:${teacher.email || teacher.contact}`).catch(() => Alert.alert('Error', 'Could not open email client'));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <AnimatedBackground variant="gradient">
          <SafeAreaView style={styles.center}>
             <ActivityIndicator size="large" color={colors.primary} />
             <Text style={styles.loadingText}>Loading Profile...</Text>
          </SafeAreaView>
        </AnimatedBackground>
      </View>
    );
  }

  if (error || !teacher) {
    return (
      <View style={styles.mainContainer}>
        <AnimatedBackground variant="gradient">
          <SafeAreaView style={styles.center}>
            <Ionicons name="alert-circle" size={60} color="#f87171" />
            <Text style={styles.errorText}>{error || "Faculty not found"}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.retryText}>Go Back</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </AnimatedBackground>
      </View>
    );
  }

  const renderSection = (title, icon, content) => (
    <BlurView intensity={20} tint="dark" style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconBox}>
          {icon}
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </BlurView>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground variant="gradient">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topNav}>
            <BackButton onPress={() => navigation.goBack()} color="#fff" />
            <Text style={styles.headerTitle}>Profile Details</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Header */}
            <View style={styles.profileHero}>
              <View style={styles.imageCard}>
                <Image
                  source={{ uri: teacher.image || 'https://via.placeholder.com/300' }}
                  style={styles.profileImg}
                />
                <LinearGradient
                   colors={['transparent', 'rgba(15, 23, 42, 0.8)']}
                   style={styles.imgOverlay}
                />
              </View>
              
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Text style={styles.teacherDesignation}>{teacher.designation}</Text>
              <Text style={styles.teacherDept}>{teacher.department}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleEmailPress}>
                  <LinearGradient colors={[colors.primary, '#6366f1']} style={styles.actionGradient}>
                    <Ionicons name="mail" size={20} color="#fff" />
                    <Text style={styles.actionText}>Email</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {teacher.linkedin && (
                  <TouchableOpacity style={styles.actionBtn} onPress={handleLinkedInPress}>
                    <BlurView intensity={30} tint="dark" style={styles.linkedinBlur}>
                      <Ionicons name="logo-linkedin" size={20} color="#60a5fa" />
                      <Text style={[styles.actionText, { color: '#60a5fa' }]}>LinkedIn</Text>
                    </BlurView>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Info Sections */}
            <View style={styles.infoContainer}>
              {teacher.bio && renderSection('About', <Ionicons name="information-circle" size={20} color="#fbbf24" />, teacher.bio)}
              
              <View style={styles.statsRow}>
                 <BlurView intensity={20} tint="dark" style={styles.statCard}>
                    <Text style={styles.statVal}>{teacher.experience || "10+"}</Text>
                    <Text style={styles.statLbl}>Exp. Years</Text>
                 </BlurView>
                 <BlurView intensity={20} tint="dark" style={styles.statCard}>
                    <Text style={styles.statVal}>{teacher.subjects?.length || "0"}</Text>
                    <Text style={styles.statLbl}>Subjects</Text>
                 </BlurView>
              </View>

              {teacher.education && renderSection('Education', <Ionicons name="school" size={20} color="#a78bfa" />, teacher.education)}
              
              {/* Subjects List */}
              <Text style={styles.listHeading}>Teaching Portfolio</Text>
              {teacher.subjects && teacher.subjects.length > 0 ? (
                teacher.subjects.map((sub, idx) => (
                  <BlurView key={idx} intensity={15} tint="dark" style={styles.subjectCard}>
                    <View style={styles.subIcon}>
                      <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primaryLight} />
                    </View>
                    <View style={styles.subInfo}>
                      <Text style={styles.subName}>{sub.name}</Text>
                      <Text style={styles.subStats}>
                        {sub.totalLectures} Lectures • {sub.credits} Credits
                      </Text>
                    </View>
                  </BlurView>
                ))
              ) : (
                <Text style={styles.noData}>No active subjects assigned.</Text>
              )}
            </View>

            <View style={{ height: 40 }} />
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
  loadingContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: rs(40),
  },
  profileHero: {
    alignItems: 'center',
    paddingTop: rs(25),
    marginBottom: rs(35),
  },
  imageCard: {
    width: rs(160),
    height: rs(160),
    borderRadius: rs(80),
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: rs(25),
    elevation: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  imgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  teacherName: {
    fontSize: normalize(28),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(6),
    letterSpacing: -1,
  },
  teacherDesignation: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: colors.primaryLight,
    marginBottom: rs(4),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  teacherDept: {
    fontSize: normalize(14),
    color: colors.text.muted,
    fontWeight: '700',
    marginBottom: rs(30),
  },
  actionRow: {
    flexDirection: 'row',
    gap: rs(15),
  },
  actionBtn: {
    borderRadius: rs(18),
    overflow: 'hidden',
    minWidth: rs(130),
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rs(14),
    gap: rs(10),
  },
  linkedinBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rs(14),
    gap: rs(10),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actionText: {
    fontSize: normalize(14),
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoContainer: {
    paddingHorizontal: rs(20),
  },
  sectionCard: {
    borderRadius: rs(28),
    padding: rs(22),
    marginBottom: rs(18),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rs(15),
  },
  sectionIconBox: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(12),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    fontSize: normalize(17),
    fontWeight: '800',
    color: colors.text.white,
    letterSpacing: -0.3,
  },
  sectionContent: {
    fontSize: normalize(15),
    color: colors.text.muted,
    lineHeight: normalize(24),
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rs(18),
  },
  statCard: {
    width: '48%',
    borderRadius: rs(24),
    padding: rs(20),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  statVal: {
    fontSize: normalize(24),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(5),
  },
  statLbl: {
    fontSize: normalize(12),
    color: colors.text.muted,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listHeading: {
    fontSize: normalize(20),
    fontWeight: '900',
    color: colors.text.white,
    marginTop: rs(15),
    marginBottom: rs(20),
    letterSpacing: -0.5,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rs(18),
    borderRadius: rs(24),
    marginBottom: rs(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  subIcon: {
    width: rs(50),
    height: rs(50),
    borderRadius: rs(16),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(18),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  subInfo: {
    flex: 1,
  },
  subName: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: colors.text.white,
    marginBottom: rs(4),
    letterSpacing: -0.3,
  },
  subStats: {
    fontSize: normalize(13),
    color: colors.text.muted,
    fontWeight: '700',
  },
  noData: {
    textAlign: 'center',
    color: colors.text.muted,
    marginTop: rs(10),
    fontStyle: 'italic',
    fontSize: normalize(14),
  },
  loadingText: {
    marginTop: rs(20),
    color: colors.text.muted,
    fontWeight: '800',
    fontSize: normalize(15),
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: normalize(16),
    color: colors.danger,
    fontWeight: '800',
    marginTop: rs(20),
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: rs(25),
    paddingHorizontal: rs(25),
    paddingVertical: rs(12),
    backgroundColor: colors.primary,
    borderRadius: rs(14),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: normalize(14),
    textTransform: 'uppercase',
  }
});

export default FacultyDetailScreen;
