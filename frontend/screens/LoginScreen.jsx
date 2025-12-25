import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { globalStyles, colors, typography, spacing, responsiveTypography, isSmallScreen } from '../styles/globalStyles';
import { normalize, rs } from '../utils/responsive';
import BackButton from '../components/BackButton';
import AnimatedBackground from '../components/AnimatedBackground';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrors({});
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ visible: true, message: Object.values(newErrors)[0], type: 'error' });
      return;
    }

    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);

    if (result.success) {
      setToast({ visible: true, message: 'Welcome back to MyCampusHub!', type: 'success' });
      setTimeout(() => navigation.replace('Home'), 1500);
    } else {
      setToast({ visible: true, message: result.error || 'Invalid credentials. Please try again.', type: 'error' });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground variant="gradient">
        <SafeAreaView style={styles.safeArea}>
        <Toast 
          visible={toast.visible} 
          message={toast.message} 
          type={toast.type}
          onHide={() => setToast({ ...toast, visible: false })}
        />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            centerContent={true}
          >
            <View style={styles.topNav}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate('Welcome')}
              >
                <Ionicons name="chevron-back" size={24} color={colors.text.white} />
              </TouchableOpacity>
              <Text style={styles.navTitle}>Sign In</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[colors.primary, '#8b5cf6']}
                  style={styles.logoGradient}
                >
                  <MaterialCommunityIcons name="school-outline" size={50} color={colors.text.white} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>MyCampusHub</Text>
              <Text style={styles.subtitle}>Your Digital Campus companion</Text>
            </View>

            <BlurView intensity={Platform.OS === 'ios' ? 20 : 100} tint="dark" style={styles.glassCard}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>University Email</Text>
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'email' && styles.inputFocused,
                    errors.email && styles.inputError
                  ]}>
                    <Ionicons name="mail-outline" size={20} color={focusedInput === 'email' ? colors.primary : '#94a3b8'} />
                    <TextInput
                      style={styles.input}
                      placeholder="name@university.edu"
                      placeholderTextColor="#94a3b8"
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Password</Text>
                    <TouchableOpacity>
                      <Text style={styles.forgotText}>Forgot?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'password' && styles.inputFocused,
                    errors.password && styles.inputError
                  ]}>
                    <Ionicons name="lock-closed-outline" size={20} color={focusedInput === 'password' ? colors.primary : '#94a3b8'} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#94a3b8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[colors.primary, '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>{loading ? 'Authenticating...' : 'Sign In'}</Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>New to MyCampusHub? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signUpLink}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>

            <View style={styles.bottomFeatures}>
              <View style={styles.featurePill}>
                <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
                <Text style={styles.featurePillText}>End-to-end Secure</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 24,
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
    transform: [{ rotate: '45deg' }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.white,
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  glassCard: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primaryLight,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text.white,
    fontWeight: '500',
  },
  primaryButton: {
    height: 60,
    borderRadius: 18,
    marginTop: 10,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.white,
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 15,
  },
  signUpLink: {
    color: colors.text.white,
    fontWeight: '700',
    fontSize: 15,
  },
  bottomFeatures: {
    alignItems: 'center',
    marginTop: 30,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  featurePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryLight,
    marginLeft: 6,
  }
});

export default LoginScreen;
