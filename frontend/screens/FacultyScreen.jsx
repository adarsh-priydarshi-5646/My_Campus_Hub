import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { fetchFaculty } from '../services/api';
import { globalStyles, colors, spacing, typography } from '../styles/globalStyles';
import { normalize, rs } from '../utils/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';
import AnimatedBackground from '../components/AnimatedBackground';

const FacultyScreen = ({ navigation }) => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchFaculty();
      setFaculty(res.data);
    } catch (err) {
      setError('Failed to sync faculty records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  const renderFacultyItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.85}
      onPress={() => navigation.navigate('FacultyDetail', { teacherId: item.id })}
    >
      <BlurView intensity={25} tint="dark" style={styles.facultyCard}>
        <View style={styles.facultyHeader}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </LinearGradient>
          </View>
          <View style={styles.facultyInfo}>
            <Text style={styles.facultyName}>{item.name}</Text>
            <View style={styles.designationBadge}>
               <Text style={styles.facultyDesignation}>{item.designation}</Text>
            </View>
          </View>
          <View style={styles.chevronBox}>
             <Ionicons name="chevron-forward" size={rs(16)} color={colors.text.muted} />
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaInfo}>
            <MaterialIcons name="business" size={rs(14)} color={colors.primaryLight} />
            <Text style={styles.metaText}>{item.department}</Text>
          </View>
          {item.email && (
            <View style={styles.metaInfo}>
               <Ionicons name="mail" size={rs(14)} color={colors.primaryLight} />
               <Text style={styles.metaText} numberOfLines={1}>{item.email.toLowerCase()}</Text>
            </View>
          )}
        </View>

        {item.subjects && item.subjects.length > 0 && (
          <View style={styles.tagGrid}>
            {item.subjects.slice(0, 2).map((sub, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{sub.name}</Text>
              </View>
            ))}
            {item.subjects.length > 2 && (
              <View style={[styles.tag, styles.moreTag]}>
                <Text style={styles.tagText}>+{item.subjects.length - 2} Specialties</Text>
              </View>
            )}
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
          <View style={styles.topNav}>
            <BackButton onPress={() => navigation.goBack()} color="#fff" />
            <Text style={styles.screenTitle}>Faculty Portal</Text>
            <TouchableOpacity onPress={loadFaculty} style={styles.refreshBtn}>
              <Ionicons name="refresh" size={rs(20)} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Syncing faculty directories...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerBox}>
              <Ionicons name="cloud-offline" size={rs(48)} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={globalStyles.button} onPress={loadFaculty}>
                <Text style={globalStyles.buttonText}>Retry Connection</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={faculty}
              keyExtractor={item => item.id.toString()}
              renderItem={renderFacultyItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.centerBox}>
                  <Ionicons name="people-outline" size={rs(60)} color={colors.text.muted} />
                  <Text style={styles.emptyText}>No members documented yet.</Text>
                </View>
              )}
            />
          )}
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
  screenTitle: {
    fontSize: normalize(20),
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -0.5,
  },
  refreshBtn: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(14),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  listContent: {
    paddingHorizontal: rs(20),
    paddingTop: rs(10),
    paddingBottom: rs(40),
  },
  facultyCard: {
    borderRadius: rs(28),
    padding: rs(20),
    marginBottom: rs(16),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
  },
  facultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rs(18),
  },
  avatarContainer: {
    width: rs(60),
    height: rs(60),
    borderRadius: rs(20),
    overflow: 'hidden',
    marginRight: rs(15),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: normalize(24),
    fontWeight: '900',
    color: '#fff',
  },
  facultyInfo: {
    flex: 1,
  },
  facultyName: {
    fontSize: normalize(18),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(4),
    letterSpacing: -0.3,
  },
  designationBadge: {
    backgroundColor: 'rgba(99,102,241,0.1)',
    paddingHorizontal: rs(8),
    paddingVertical: rs(2),
    borderRadius: rs(6),
    alignSelf: 'flex-start',
  },
  facultyDesignation: {
    fontSize: normalize(12),
    color: colors.primaryLight,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chevronBox: {
    width: rs(32),
    height: rs(32),
    borderRadius: rs(10),
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: rs(18),
    gap: rs(15),
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(6),
    flex: 1,
  },
  metaText: {
    fontSize: normalize(12),
    color: colors.text.secondary,
    fontWeight: '600',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs(8),
    paddingTop: rs(15),
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: rs(12),
    paddingVertical: rs(6),
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  moreTag: {
    backgroundColor: 'rgba(99,102,241,0.05)',
    borderColor: 'rgba(99,102,241,0.1)',
  },
  tagText: {
    fontSize: normalize(11),
    color: colors.text.secondary,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: rs(40),
  },
  loadingText: {
    marginTop: rs(15),
    fontSize: normalize(14),
    color: colors.text.secondary,
    fontWeight: '800',
  },
  errorText: {
    marginVertical: rs(15),
    fontSize: normalize(15),
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '800',
  },
  emptyText: {
    marginTop: rs(15),
    fontSize: normalize(15),
    color: colors.text.muted,
    fontWeight: '700',
  }
});

export default FacultyScreen;
