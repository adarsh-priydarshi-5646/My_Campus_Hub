import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchSemesterDetails } from '../services/api';
import { colors, spacing, typography } from '../styles/globalStyles';
import BackButton from '../components/BackButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { normalize, rs } from '../utils/responsive';

const SemesterDetailsScreen = ({ route, navigation }) => {
  const { semesterId, semesterName } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSemesterDetails(semesterId);
      setDetails(res.data);
    } catch (err) {
      setError('Curriculum analysis failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [semesterId]);

  if (loading || !details) {
    return (
      <View style={styles.mainContainer}>
        <AnimatedBackground variant="gradient">
          <SafeAreaView style={styles.centerBox}>
             <ActivityIndicator size="large" color={colors.primary} />
             <Text style={styles.loadingText}>Syncing Academic Records...</Text>
          </SafeAreaView>
        </AnimatedBackground>
      </View>
    );
  }

  const renderSubject = (sub) => (
    <TouchableOpacity 
      key={sub.id} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('SubjectRoadmap', { 
        subjectId: sub.id, 
        subjectName: sub.name,
        semesterId,
        semesterName 
      })}
    >
      <BlurView intensity={25} tint="dark" style={styles.subjectCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: `${colors.primary}15` }]}>
            <MaterialCommunityIcons name="book-open-variant" size={rs(22)} color={colors.primaryLight} />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.subjectName}>{sub.name}</Text>
            <Text style={styles.instructorText}>Instructor: Prof. {sub.teacher?.name || 'Academic Lead'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={rs(16)} color={colors.text.muted} />
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <MaterialIcons name="local-library" size={rs(14)} color={colors.text.secondary} />
            <Text style={styles.metaBadgeText}>{sub.totalLectures || 40} Sessions</Text>
          </View>
          <View style={styles.metaBadge}>
            <MaterialIcons name="science" size={rs(14)} color={colors.text.secondary} />
            <Text style={styles.metaBadgeText}>{sub.totalLabs || 12} Labs</Text>
          </View>
          <View style={styles.metaBadge}>
            <MaterialCommunityIcons name="star-circle" size={rs(14)} color={colors.warning} />
            <Text style={styles.metaBadgeText}>4.0 Credits</Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground variant="gradient">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topNav}>
            <BackButton onPress={() => navigation.goBack()} color="#fff" />
            <Text style={styles.headerTitle}>{semesterName}</Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SubjectRoadmap', { semesterId, semesterName })}
              style={styles.actionBtn}
            >
               <BlurView intensity={40} tint="dark" style={styles.btnBlur}>
                  <Ionicons name="map" size={rs(20)} color={colors.primaryLight} />
               </BlurView>
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Overview Banner */}
            <View style={styles.bannerWrapper}>
               <BlurView intensity={30} tint="dark" style={styles.bannerCard}>
                  <View style={styles.bannerItem}>
                    <Text style={styles.bannerKey}>Curriculum Load</Text>
                    <Text style={styles.bannerVal}>24.0 Credits</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.bannerItem}>
                    <Text style={styles.bannerKey}>Core Subjects</Text>
                    <Text style={styles.bannerVal}>{details.subjects?.length || 0}</Text>
                  </View>
               </BlurView>
            </View>

            {/* Subjects Section */}
            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Syllabus Overview</Text>
               <MaterialCommunityIcons name="filter-variant" size={rs(20)} color={colors.text.muted} />
            </View>
            
            <View style={styles.subjectsList}>
              {details.subjects?.map(renderSubject)}
            </View>

            {/* Exams Section */}
            <Text style={[styles.sectionTitle, { marginTop: rs(30), marginBottom: rs(15) }]}>Examination Milestone</Text>
            <BlurView intensity={25} tint="dark" style={styles.milestoneCard}>
               {details.midSem ? (
                 <View style={styles.milestoneRow}>
                   <View style={[styles.statusIcon, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                     <MaterialCommunityIcons name="calendar-clock" size={rs(22)} color="#60a5fa" />
                   </View>
                   <View style={styles.milestoneInfo}>
                     <Text style={styles.milestoneType}>Mid-Term Assessment</Text>
                     <Text style={styles.milestoneDate}>{new Date(details.midSem.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                   </View>
                   <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeTxt}>Upcoming</Text>
                   </View>
                 </View>
               ) : null}

               {details.endSem ? (
                 <View style={[styles.milestoneRow, { borderTopWidth: 1, borderTopColor: colors.borderLight, marginTop: rs(15), paddingTop: rs(15) }]}>
                   <View style={[styles.statusIcon, { backgroundColor: 'rgba(139,92,246,0.1)' }]}>
                     <MaterialCommunityIcons name="trophy-outline" size={rs(22)} color="#a78bfa" />
                   </View>
                   <View style={styles.milestoneInfo}>
                     <Text style={styles.milestoneType}>Final Term Examination</Text>
                     <Text style={styles.milestoneDate}>{new Date(details.endSem.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                   </View>
                 </View>
               ) : null}

               {!details.midSem && !details.endSem && (
                 <View style={styles.emptyMilestone}>
                    <Ionicons name="notifications-outline" size={rs(32)} color={colors.text.muted} />
                    <Text style={styles.emptyMilestoneTxt}>Schedules are being finalized by the board.</Text>
                 </View>
               )}
            </BlurView>

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
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: rs(40),
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
  actionBtn: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(14),
    overflow: 'hidden',
  },
  btnBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: rs(20),
    paddingTop: rs(15),
  },
  bannerWrapper: {
    marginBottom: rs(40),
  },
  bannerCard: {
    flexDirection: 'row',
    borderRadius: rs(28),
    padding: rs(24),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bannerItem: {
    alignItems: 'center',
  },
  bannerKey: {
    fontSize: normalize(11),
    color: colors.text.muted,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: rs(6),
    letterSpacing: 0.5,
  },
  bannerVal: {
    fontSize: normalize(24),
    fontWeight: '900',
    color: colors.text.white,
  },
  divider: {
    width: 1,
    height: rs(40),
    backgroundColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(15),
  },
  sectionTitle: {
    fontSize: normalize(19),
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -0.5,
  },
  subjectsList: {
    gap: rs(14),
  },
  subjectCard: {
    borderRadius: rs(24),
    padding: rs(20),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rs(16),
  },
  iconBox: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  titleBox: {
    flex: 1,
  },
  subjectName: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: colors.text.white,
    marginBottom: rs(4),
  },
  instructorText: {
    fontSize: normalize(12),
    color: colors.text.secondary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: rs(10),
    flexWrap: 'wrap',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(6),
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: rs(10),
    paddingVertical: rs(5),
    borderRadius: rs(8),
  },
  metaBadgeText: {
    fontSize: normalize(11),
    color: colors.text.secondary,
    fontWeight: '700',
  },
  milestoneCard: {
    borderRadius: rs(28),
    padding: rs(20),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(15),
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneType: {
    fontSize: normalize(13),
    fontWeight: '800',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: rs(2),
  },
  milestoneDate: {
    fontSize: normalize(16),
    fontWeight: '900',
    color: colors.text.white,
  },
  statusBadge: {
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: rs(8),
    paddingVertical: rs(4),
    borderRadius: rs(6),
  },
  statusBadgeTxt: {
    fontSize: normalize(10),
    fontWeight: '900',
    color: colors.success,
    textTransform: 'uppercase',
  },
  emptyMilestone: {
    padding: rs(20),
    alignItems: 'center',
    gap: rs(10),
  },
  emptyMilestoneTxt: {
    textAlign: 'center',
    color: colors.text.muted,
    fontSize: normalize(14),
    fontWeight: '600',
    lineHeight: normalize(20),
  },
  loadingText: {
    marginTop: rs(15),
    color: colors.text.secondary,
    fontWeight: '800',
    fontSize: normalize(14),
  }
});

export default SemesterDetailsScreen;
