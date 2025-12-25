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

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [idNumber, setIdNumber] = useState('');
  
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const { register } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    setErrors({});
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!idNumber.trim()) newErrors.idNumber = 'Student/Faculty ID is required';
    if (!department.trim()) newErrors.department = 'Department is required';
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ visible: true, message: Object.values(newErrors)[0], type: 'error' });
      return;
    }

    setLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      department: department.trim(),
      idNumber: idNumber.trim()
    });
    setLoading(false);

    if (result.success) {
      setToast({ visible: true, message: 'Account created! Welcome to the hub!', type: 'success' });
      setTimeout(() => navigation.replace('Home'), 1500);
    } else {
      setToast({ visible: true, message: result.error || 'Failed to create account.', type: 'error' });
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
          >
            <View style={styles.topNav}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate('Welcome')}
              >
                <Ionicons name="chevron-back" size={24} color={colors.text.white} />
              </TouchableOpacity>
              <Text style={styles.navTitle}>Create Account</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Join the Hub</Text>
              <Text style={styles.subtitle}>Connect with your campus community</Text>
            </View>

            <BlurView intensity={Platform.OS === 'ios' ? 20 : 100} tint="dark" style={styles.glassCard}>
              <View style={styles.form}>
                
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={[
                    styles.inputWrapper,
                    focusedInput === 'name' && styles.inputFocused,
                    errors.name && styles.inputError
                  ]}>
                    <Ionicons name="person-outline" size={20} color={focusedInput === 'name' ? colors.primary : '#94a3b8'} />
                    <TextInput
                      style={styles.input}
                      placeholder="John Doe"
                      placeholderTextColor="#94a3b8"
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                {/* ID Number & Department Row */}
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>ID Number</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedInput === 'idNumber' && styles.inputFocused,
                      errors.idNumber && styles.inputError
                    ]}>
                      <TextInput
                        style={[styles.input, { marginLeft: 0 }]}
                        placeholder="ID-12345"
                        placeholderTextColor="#94a3b8"
                        value={idNumber}
                        onChangeText={setIdNumber}
                        onFocus={() => setFocusedInput('idNumber')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Department</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedInput === 'department' && styles.inputFocused,
                      errors.department && styles.inputError
                    ]}>
                      <TextInput
                        style={[styles.input, { marginLeft: 0 }]}
                        placeholder="CS / BT"
                        placeholderTextColor="#94a3b8"
                        value={department}
                        onChangeText={setDepartment}
                        onFocus={() => setFocusedInput('department')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>

                {/* Email */}
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

                {/* Passwords */}
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedInput === 'password' && styles.inputFocused,
                      errors.password && styles.inputError
                    ]}>
                      <TextInput
                        style={[styles.input, { marginLeft: 0 }]}
                        placeholder="••••••"
                        placeholderTextColor="#94a3b8"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Confirm</Text>
                    <View style={[
                      styles.inputWrapper,
                      focusedInput === 'confirmPassword' && styles.inputFocused,
                      errors.confirmPassword && styles.inputError
                    ]}>
                      <TextInput
                        style={[styles.input, { marginLeft: 0 }]}
                        placeholder="••••••"
                        placeholderTextColor="#94a3b8"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        onFocus={() => setFocusedInput('confirmPassword')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#10b981', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
                    <Ionicons name="rocket-outline" size={20} color={colors.text.white} />
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signUpLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>

            <View style={styles.termsBox}>
              <Text style={styles.termsText}>
                By signing up, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
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
    marginTop: 10,
    marginBottom: 20,
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
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputFocused: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: colors.text.white,
    fontWeight: '500',
  },
  primaryButton: {
    height: 60,
    borderRadius: 18,
    marginTop: 10,
    overflow: 'hidden',
    shadowColor: '#10b981',
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
  termsBox: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 18,
  },
  termsLink: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});

export default SignupScreen;
