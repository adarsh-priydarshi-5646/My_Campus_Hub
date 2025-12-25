import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchEvents } from '../services/api';
import { globalStyles, colors, spacing, typography } from '../styles/globalStyles';
import BackButton from '../components/BackButton';
import AnimatedBackground from '../components/AnimatedBackground';
import { normalize, rs } from '../utils/responsive';

const EventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const loadEvents = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      const res = await fetchEvents();
      // Sort by date (descending)
      const sortedEvents = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(sortedEvents);
    } catch (err) {
      setError('Failed to sync campus events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventCategory = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('tech') || lowerTitle.includes('hackathon') || lowerTitle.includes('code')) {
      return { icon: 'code-braces', color: colors.primary, label: 'Technical' };
    } else if (lowerTitle.includes('cultural') || lowerTitle.includes('fest') || lowerTitle.includes('music')) {
      return { icon: 'music-note', color: colors.accent, label: 'Cultural' };
    } else if (lowerTitle.includes('sports') || lowerTitle.includes('cricket') || lowerTitle.includes('football')) {
      return { icon: 'trophy', color: colors.success, label: 'Sports' };
    }
    return { icon: 'calendar-star', color: colors.secondary, label: 'Special' };
  };

  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(e => getEventCategory(e.title).label === activeFilter);

  const renderEventItem = ({ item }) => {
    const category = getEventCategory(item.title);
    return (
      <TouchableOpacity activeOpacity={0.85} style={styles.eventWrapper}>
        <BlurView intensity={25} tint="dark" style={styles.eventCard}>
          <View style={styles.cardTop}>
             <View style={[styles.catIcon, { backgroundColor: `${category.color}15` }]}>
                <MaterialCommunityIcons name={category.icon} size={rs(22)} color={category.color} />
             </View>
             <View style={styles.dateBox}>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
             </View>
          </View>

          <Text style={styles.eventTitle}>{item.title}</Text>
          
          <View style={styles.locRow}>
             <View style={styles.infoBadge}>
                <Ionicons name="location" size={rs(14)} color={colors.text.secondary} />
                <Text style={styles.infoBadgeText}>{item.venue || 'Main Auditorium'}</Text>
             </View>
             <View style={styles.infoBadge}>
                <Ionicons name="time" size={rs(14)} color={colors.text.secondary} />
                <Text style={styles.infoBadgeText}>{item.time || '10:00 AM'}</Text>
             </View>
          </View>

          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.cardFooter}>
             <View style={styles.organizerRow}>
                <LinearGradient
                  colors={[`${colors.primary}40`, `${colors.secondary}40`]}
                  style={styles.smallAvatar}
                >
                   <Text style={styles.avatarTxt}>{(item.organizer || 'A')[0]}</Text>
                </LinearGradient>
                <Text style={styles.organizerName}>{item.organizer || 'College Admin'}</Text>
             </View>
             <TouchableOpacity style={styles.detailsBtn}>
                <Text style={styles.detailsBtnText}>View Details</Text>
             </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground variant="gradient">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topNav}>
            <BackButton onPress={() => navigation.goBack()} color="#fff" />
            <Text style={styles.headerTitle}>Campus Highlights</Text>
            <TouchableOpacity onPress={() => loadEvents(true)} style={styles.refreshBtn}>
               <Ionicons name="refresh" size={rs(20)} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
                {['All', 'Technical', 'Cultural', 'Sports', 'Special'].map((f) => (
                  <TouchableOpacity 
                    key={f} 
                    activeOpacity={0.7}
                    onPress={() => setActiveFilter(f)}
                    style={[styles.filterChip, activeFilter === f && styles.activeChip]}
                  >
                    <Text style={[styles.filterText, activeFilter === f && styles.activeFilterText]}>{f}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
          </View>

          {loading ? (
             <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Syncing latest events...</Text>
             </View>
          ) : error ? (
            <View style={styles.center}>
                <Ionicons name="cloud-offline" size={rs(48)} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={globalStyles.button} onPress={() => loadEvents()}>
                    <Text style={globalStyles.buttonText}>Retry Sync</Text>
                </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredEvents}
              keyExtractor={item => item.id.toString()}
              renderItem={renderEventItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="calendar-blank" size={rs(64)} color={colors.text.muted} />
                  <Text style={styles.emptyText}>No events found in this category</Text>
                </View>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => loadEvents(true)} tintColor={colors.primary} />
              }
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rs(20),
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
  filterSection: {
    marginVertical: rs(15),
  },
  filterBar: {
    paddingHorizontal: rs(20),
    gap: rs(10),
  },
  filterChip: {
    paddingHorizontal: rs(18),
    paddingVertical: rs(10),
    borderRadius: rs(14),
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  filterText: {
    fontSize: normalize(13),
    fontWeight: '800',
    color: colors.text.secondary,
  },
  activeFilterText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: rs(20),
    paddingBottom: rs(40),
  },
  eventWrapper: {
    marginBottom: rs(16),
  },
  eventCard: {
    borderRadius: rs(28),
    padding: rs(20),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(15),
  },
  catIcon: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(14),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: rs(12),
    paddingVertical: rs(6),
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateText: {
    fontSize: normalize(12),
    fontWeight: '900',
    color: colors.primaryLight,
  },
  eventTitle: {
    fontSize: normalize(19),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(10),
    letterSpacing: -0.3,
    flexWrap: 'wrap',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(10),
    marginBottom: rs(12),
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(4),
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: rs(8),
    paddingVertical: rs(4),
    borderRadius: rs(8),
    flexShrink: 1,
    maxWidth: '48%',
  },
  infoBadgeText: {
    fontSize: normalize(12),
    color: colors.text.secondary,
    fontWeight: '600',
    flex: 1,
  },
  description: {
    fontSize: normalize(14),
    color: colors.text.secondary,
    lineHeight: normalize(22),
    marginBottom: rs(20),
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: rs(15),
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(8),
    flex: 1,
    paddingRight: rs(10),
  },
  smallAvatar: {
    width: rs(28),
    height: rs(28),
    borderRadius: rs(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarTxt: {
    fontSize: normalize(12),
    fontWeight: '900',
    color: '#fff',
  },
  organizerName: {
    fontSize: normalize(13),
    fontWeight: '700',
    color: colors.text.secondary,
    flexShrink: 1,
  },
  detailsBtn: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: rs(16),
    paddingVertical: rs(8),
    borderRadius: rs(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsBtnText: {
    fontSize: normalize(12),
    fontWeight: '800',
    color: colors.text.white,
  },
  loadingText: {
    marginTop: rs(15),
    color: colors.text.secondary,
    fontWeight: '800',
    fontSize: normalize(14),
  },
  errorText: {
    color: colors.danger,
    fontWeight: '800',
    fontSize: normalize(16),
    marginVertical: rs(15),
    textAlign: 'center',
  },
  emptyContainer: {
    padding: rs(60),
    alignItems: 'center',
    gap: rs(15),
  },
  emptyText: {
    color: colors.text.muted,
    fontWeight: '700',
    fontSize: normalize(15),
    textAlign: 'center',
  }
});

export default EventsScreen;
