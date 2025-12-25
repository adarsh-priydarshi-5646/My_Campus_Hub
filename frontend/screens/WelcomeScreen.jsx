import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StatusBar, 
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { globalStyles, colors, spacing, responsiveTypography, isSmallScreen } from '../styles/globalStyles';
import { normalize, rs } from '../utils/responsive';
import AnimatedBackground from '../components/AnimatedBackground';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground variant="gradient">
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View style={styles.heroContainer}>
              <Animated.View 
                style={[
                  styles.logoWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <LinearGradient
                  colors={[colors.primary, '#8b5cf6']}
                  style={styles.logoGradient}
                >
                  <Ionicons name="school" size={70} color={colors.text.white} />
                </LinearGradient>
                <View style={styles.logoRing} />
              </Animated.View>

              <Animated.View 
                style={[
                  styles.textContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <Text style={styles.title}>MyCampusHub</Text>
                <Text style={styles.headline}>Your Academic Universe, Unified.</Text>
                <Text style={styles.description}>
                  The ultimate companion for students and faculty. Manage academics, events, and campus life with a premium digital experience.
                </Text>
              </Animated.View>
            </View>

            {/* Features Preview */}
            <View style={styles.featuresContainer}>
               <View style={styles.featureRow}>
                  <BlurView intensity={25} tint="dark" style={styles.featureCard}>
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(96, 165, 250, 0.2)' }]}>
                      <MaterialCommunityIcons name="book-open-page-variant" size={rs(24)} color="#60a5fa" />
                    </View>
                    <Text style={styles.cardTitle}>Academics</Text>
                    <Text style={styles.cardDesc}>Roadmaps & Syllabus</Text>
                  </BlurView>

                  <BlurView intensity={25} tint="dark" style={styles.featureCard}>
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(167, 139, 250, 0.2)' }]}>
                      <Ionicons name="people" size={rs(24)} color="#a78bfa" />
                    </View>
                    <Text style={styles.cardTitle}>Faculty</Text>
                    <Text style={styles.cardDesc}>Expert Mentorship</Text>
                  </BlurView>
               </View>

               <View style={styles.featureRow}>
                   <BlurView intensity={25} tint="dark" style={[styles.featureCard, styles.fullWidthCard]}>
                      <View style={styles.rowCenter}>
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(52, 211, 153, 0.2)' }]}>
                          <MaterialIcons name="event-available" size={rs(24)} color="#34d399" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardTitle}>Campus Lifestyle</Text>
                          <Text style={styles.cardDesc}>Events, Mess Menu & Updates</Text>
                        </View>
                        <Ionicons name="arrow-forward-circle" size={rs(32)} color="rgba(255,255,255,0.2)" />
                      </View>
                   </BlurView>
               </View>
            </View>

            {/* Bottom Section with Buttons */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity 
                activeOpacity={0.9}
                style={styles.mainButton}
                onPress={() => navigation.navigate('Login')}
              >
                <LinearGradient
                  colors={[colors.primary, '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.secondaryButtonText}>Create an account</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2024 MyCampusHub • Version 2.0</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </AnimatedBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  heroContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    transform: [{ rotate: '-10deg' }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  logoRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -1.5,
    marginBottom: 10,
  },
  headline: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryLight,
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    gap: rs(15),
    marginBottom: rs(15),
  },
  featureCard: {
    flex: 1,
    padding: rs(20),
    borderRadius: rs(24),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'flex-start',
  },
  fullWidthCard: {
    width: '100%',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(15),
  },
  iconCircle: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rs(12),
  },
  cardTitle: {
    fontSize: normalize(16),
    fontWeight: '800',
    color: colors.text.white,
    marginBottom: rs(4),
  },
  cardDesc: {
    fontSize: normalize(13),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    lineHeight: normalize(18),
  },
  ctaContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mainButton: {
    width: '100%',
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    marginBottom: 15,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.white,
    marginRight: 10,
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    fontWeight: '600',
    letterSpacing: 1,
  }
});

export default WelcomeScreen;
