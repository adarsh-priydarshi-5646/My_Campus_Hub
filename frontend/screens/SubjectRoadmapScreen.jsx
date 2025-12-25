import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchSubjects } from '../services/api';
import { globalStyles, colors, spacing, typography } from '../styles/globalStyles';
import BackButton from '../components/BackButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { normalize, rs } from '../utils/responsive';

const SubjectRoadmapScreen = ({ route, navigation }) => {
  const { semesterId, semesterName } = route.params;
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSubjects(semesterId);
      setSubjects(res.data);
    } catch (err) {
      setError('Curriculum pathways unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [semesterId]);

  const semesterStats = subjects.reduce(
    (acc, subject) => ({
      totalLectures: acc.totalLectures + (subject.totalLectures || 0),
      totalLabs: acc.totalLabs + (subject.totalLabs || 0),
      totalCredits: acc.totalCredits + (subject.credits || 0),
      totalSubjects: acc.totalSubjects + 1,
    }),
    { totalLectures: 0, totalLabs: 0, totalCredits: 0, totalSubjects: 0 }
  );

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <AnimatedBackground variant="gradient">
          <SafeAreaView style={styles.centerBox}>
             <ActivityIndicator size="large" color={colors.primary} />
             <Text style={styles.loadingText}>Architecting Roadmap...</Text>
          </SafeAreaView>
        </AnimatedBackground>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mainContainer}>
        <AnimatedBackground variant="gradient">
          <SafeAreaView style={styles.centerBox}>
            <Ionicons name="alert-circle" size={rs(60)} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={globalStyles.button} onPress={loadSubjects}>
              <Text style={globalStyles.buttonText}>Retry Sequence</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </AnimatedBackground>
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
            <Text style={styles.headerTitle}>Expert Roadmap</Text>
            <View style={{ width: rs(44) }} />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Stats */}
            <View style={styles.heroSection}>
                <Text style={styles.heroSubtitle}>{semesterName}</Text>
                <Text style={styles.heroTitle}>Strategic Academic Path</Text>
                
                <BlurView intensity={30} tint="dark" style={styles.statsStrip}>
                   <View style={styles.statBox}>
                      <Text style={styles.statValue}>{semesterStats.totalSubjects}</Text>
                      <Text style={styles.statLabel}>Subjects</Text>
                   </View>
                   <View style={styles.stripDivider} />
                   <View style={styles.statBox}>
                      <Text style={styles.statValue}>{semesterStats.totalCredits || '24.0'}</Text>
                      <Text style={styles.statLabel}>Credits</Text>
                   </View>
                   <View style={styles.stripDivider} />
                   <View style={styles.statBox}>
                      <Text style={styles.statValue}>{semesterStats.totalLectures || '160'}</Text>
                      <Text style={styles.statLabel}>Exp. Hours</Text>
                   </View>
                </BlurView>
            </View>

            <View style={styles.roadmapFlow}>
              {subjects
                .filter(subject => !route.params.subjectId || subject.id === route.params.subjectId)
                .map((subject, index, arr) => (
                <View key={subject.id} style={styles.timelineWrapper}>
                  {/* Vertical Connector Line */}
                  {index !== arr.length - 1 && (
                     <View style={styles.roadmapConnector} />
                  )}
                  
                  <View style={styles.cardContainer}>
                    <BlurView intensity={25} tint="dark" style={styles.roadmapCard}>
                      <View style={styles.cardHeader}>
                         <LinearGradient
                            colors={['#4f46e5', '#ec4899']} 
                            start={[0, 0]}
                            end={[1, 1]}
                            style={styles.indexCircle}
                         >
                            <Text style={styles.indexText}>{index + 1}</Text>
                         </LinearGradient>
                         <View style={styles.titleArea}>
                            <Text style={styles.subjectTitle}>{subject.name}</Text>
                            <View style={styles.badgeRow}>
                               <View style={styles.creditBadge}>
                                  <Text style={styles.creditBadgeTxt}>{subject.credits || 4} Credits</Text>
                               </View>
                               <View style={styles.deptBadge}>
                                  <Text style={styles.deptBadgeTxt}>Core</Text>
                               </View>
                            </View>
                         </View>
                      </View>

                    {subject.description && (
                      <Text style={styles.descText}>{subject.description}</Text>
                    )}

                    {/* Faculty Preview */}
                    {(subject.teacher || subject.labTeacher) && (
                      <View style={styles.mentorStrip}>
                        <View style={styles.mentorIcons}>
                           <MaterialCommunityIcons name="account-tie-voice" size={rs(16)} color={colors.primaryLight} />
                        </View>
                        <Text style={styles.mentorText} numberOfLines={1}>
                          Assigned Mentors: {subject.teacher?.name || 'Faculty'}{subject.labTeacher ? ` • ${subject.labTeacher.name}` : ''}
                        </Text>
                      </View>
                    )}

                    {/* Roadmap Steps */}
                    {subject.roadmap && (
                      <View style={styles.roadmapSection}>
                        <View style={styles.sectionHeader}>
                           <View style={styles.sectionIconBox}>
                             <FontAwesome5 name="route" size={rs(14)} color={colors.warning} />
                           </View>
                           <Text style={styles.sectionTitle}>Learning Milestones</Text>
                        </View>
                        
                        <View style={styles.timelineContainer}>
                          {subject.roadmap.split('\n').filter(l => l.trim()).map((step, sIdx, arr) => (
                            <View key={sIdx} style={styles.timelineItem}>
                              {/* Left Timeline Visual */}
                              <View style={styles.timelineLeft}>
                                 <View style={[styles.timelineDot, { backgroundColor: sIdx === 0 ? colors.success : colors.borderLight }]} />
                                 {sIdx !== arr.length - 1 && (
                                   <LinearGradient
                                      colors={[sIdx === 0 ? colors.success : colors.borderLight, 'transparent']}
                                      style={styles.timelineLine}
                                   />
                                 )}
                              </View>
                              
                              {/* Right Content */}
                              <View style={styles.timelineContent}>
                                 <BlurView intensity={10} tint="light" style={styles.milestoneCard}>
                                   <Text style={styles.milestoneText}>{step.replace(/^\d+\.|^[•\-✓]/, '').trim()}</Text>
                                 </BlurView>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </BlurView>
                </View>
              </View>
              ))}
            </View>

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
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: rs(40),
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
  },
  heroSection: {
    paddingVertical: rs(20),
    alignItems: 'center',
    marginBottom: rs(40),
  },
  heroSubtitle: {
    fontSize: normalize(14),
    color: colors.primaryLight,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: rs(8),
  },
  heroTitle: {
    fontSize: normalize(28),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(25),
    textAlign: 'center',
    letterSpacing: -1,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: rs(24),
    paddingHorizontal: rs(25),
    paddingVertical: rs(18),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
    overflow: 'hidden',
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: rs(5),
  },
  statValue: {
    fontSize: normalize(20),
    fontWeight: '900',
    color: colors.text.white,
  },
  statLabel: {
    fontSize: normalize(10),
    color: colors.text.muted,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: rs(2),
  },
  stripDivider: {
    width: 1,
    height: rs(30),
    backgroundColor: colors.border,
    marginHorizontal: rs(20),
  },
  roadmapFlow: {
    paddingLeft: rs(10),
    paddingRight: rs(10),
  },
  timelineWrapper: {
    position: 'relative',
    marginBottom: rs(20),
  },
  roadmapConnector: {
    position: 'absolute',
    left: rs(44), // Center of the 88px circle (approx) -> indexCircle width is 52. Left margin? 
    // Actual: indexCircle is inside card. Card has padding 24. 
    // Circle width 52. Center = 24 + 26 = 50.
    // Line should be at left: 50. Top: 50. Height: 100%.
    // wait, layout is tricky.
    // Let's rely on the circle being consistent.
    // Better strategy: Put line OUTSIDE card?
    // Current structure: Wrapper -> [Line, Card].
    // Line needs to go from Center of Circle (Row 1) to Center of Circle (Row 2).
    // This is hard with variable height cards.
    // Alternative: Just put a line sticking out the bottom of the Circle, extending down.
    // Let's try: Absolute line inside wrapper.
    left: rs(50), 
    top: rs(40),
    bottom: rs(-25), // Extend to next card
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: -1,
  },
  cardContainer: {
    // marginBottom removed, handled by wrapper
  },
  roadmapCard: {
    borderRadius: rs(28),
    padding: rs(24),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rs(20),
  },
  indexCircle: {
    width: rs(52),
    height: rs(52),
    borderRadius: rs(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(18),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  indexText: {
    fontSize: normalize(22),
    fontWeight: '900',
    color: '#fff',
  },
  titleArea: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: normalize(19),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(6),
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: rs(8),
  },
  creditBadge: {
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: rs(8),
    paddingVertical: rs(4),
    borderRadius: rs(8),
  },
  creditBadgeTxt: {
    fontSize: normalize(10),
    color: colors.success,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  deptBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: rs(8),
    paddingVertical: rs(4),
    borderRadius: rs(8),
  },
  deptBadgeTxt: {
    fontSize: normalize(10),
    color: colors.text.secondary,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  descText: {
    fontSize: normalize(14),
    color: colors.text.secondary,
    lineHeight: normalize(22),
    marginBottom: rs(20),
    fontWeight: '500',
  },
  mentorStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(10),
    marginBottom: rs(25),
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignSelf: 'flex-start',
    paddingHorizontal: rs(14),
    paddingVertical: rs(8),
    borderRadius: rs(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  mentorIcons: {
    width: rs(24),
    height: rs(24),
    borderRadius: rs(8),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorText: {
    fontSize: normalize(12),
    color: colors.text.secondary,
    fontWeight: '700',
  },
  roadmapSection: {
    marginTop: rs(5),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(10),
    marginBottom: rs(20),
  },
  sectionIconBox: {
    width: rs(28),
    height: rs(28),
    borderRadius: rs(8),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: normalize(13),
    fontWeight: '800',
    color: colors.text.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineContainer: {
    paddingLeft: rs(10),
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: rs(4),
  },
  timelineLeft: {
    alignItems: 'center',
    width: rs(20),
    marginRight: rs(15),
  },
  timelineDot: {
    width: rs(12),
    height: rs(12),
    borderRadius: rs(6),
    marginTop: rs(6),
    zIndex: 10,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -rs(2),
  },
  timelineContent: {
    flex: 1,
    paddingBottom: rs(20),
  },
  milestoneCard: {
    borderRadius: rs(16),
    padding: rs(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  milestoneText: {
    fontSize: normalize(14),
    color: colors.text.secondary,
    lineHeight: normalize(22),
    fontWeight: '600',
  },
  loadingText: {
    marginTop: rs(15),
    color: colors.text.secondary,
    fontWeight: '800',
    fontSize: normalize(14),
  },
  errorText: {
    fontSize: normalize(16),
    color: colors.danger,
    fontWeight: '900',
    marginTop: rs(15),
    textAlign: 'center',
  }
});

export default SubjectRoadmapScreen;
