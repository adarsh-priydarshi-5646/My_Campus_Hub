import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../styles/globalStyles';
import { normalize, rs } from '../utils/responsive';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editRollNumber, setEditRollNumber] = useState(user?.rollNumber || 'NST2021CS001');
  const [editBranch, setEditBranch] = useState(user?.branch || 'Computer Science & Engineering');

  useEffect(() => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
  }, [user]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Allow access to photos to change avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout }
    ]);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    try {
      const result = await updateUser({
        name: editName.trim(),
        email: editEmail.trim(),
        rollNumber: editRollNumber,
        branch: editBranch
      });
      
      if (result.success) {
        Alert.alert('Success', 'Profile updated');
        setShowEditModal(false);
      } else {
        Alert.alert('Error', result.error || 'Failed to update');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const renderStat = (label, value, icon, color) => (
    <View style={styles.statItem}>
       <View style={[styles.statIconBox, { backgroundColor: `${color}15` }]}>
          <Feather name={icon} size={rs(18)} color={color} />
       </View>
       <View>
          <Text style={styles.statVal}>{value}</Text>
          <Text style={styles.statLbl}>{label}</Text>
       </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnimatedBackground variant="gradient">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topNav}>
            <BackButton onPress={() => navigation.goBack()} color="#fff" />
            <Text style={styles.headerTitle}>Account Settings</Text>
            <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.editBtn}>
               <BlurView intensity={40} tint="dark" style={styles.iconBlur}>
                  <Feather name="edit-3" size={rs(18)} color="#fff" />
               </BlurView>
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Hero */}
            <View style={styles.profileHero}>
               <TouchableOpacity onPress={handlePickImage} activeOpacity={0.9} style={styles.avatarContainer}>
                  <View style={styles.avatarOuterRing}>
                    {profileImage || user?.avatar ? (
                      <Image source={{ uri: profileImage || user.avatar }} style={styles.avatarImg} />
                    ) : (
                      <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.avatarPlaceholder}>
                         <Text style={styles.avatarTxt}>{(user?.name || 'U').charAt(0)}</Text>
                      </LinearGradient>
                    )}
                  </View>
                  <View style={styles.cameraIcon}>
                     <Ionicons name="camera" size={rs(14)} color="#fff" />
                  </View>
               </TouchableOpacity>

               <Text style={styles.userName}>{user?.name || 'Academic Scholar'}</Text>
               <Text style={styles.userSub}>{user?.email || 'email@example.com'}</Text>
               
               <BlurView intensity={20} tint="dark" style={styles.rollTag}>
                  <Text style={styles.rollText}>{user?.rollNumber || editRollNumber}</Text>
               </BlurView>
            </View>

            {/* Academic Summary */}
            <BlurView intensity={25} tint="dark" style={styles.sectionCard}>
               <Text style={styles.sectionHeading}>Academic Snapshot</Text>
               <View style={styles.statsGrid}>
                  {renderStat('GPA', '8.9', 'award', '#fbbf24')}
                  {renderStat('Attendance', '94%', 'calendar', '#10b981')}
                  {renderStat('Rank', '#12', 'trending-up', '#3b82f6')}
                  {renderStat('Credits', '132', 'book', '#a78bfa')}
               </View>
            </BlurView>

            {/* Information List */}
            <View style={styles.infoSection}>
               <Text style={styles.infoHeading}>Profile Information</Text>
               
               <BlurView intensity={15} tint="dark" style={styles.infoItem}>
                  <View style={styles.infoIconBox}>
                    <MaterialIcons name="business" size={rs(20)} color={colors.primaryLight} />
                  </View>
                  <View style={styles.infoContent}>
                     <Text style={styles.infoLbl}>Institution Department</Text>
                     <Text style={styles.infoVal}>{user?.branch || editBranch}</Text>
                  </View>
               </BlurView>

               <BlurView intensity={15} tint="dark" style={styles.infoItem}>
                  <View style={styles.infoIconBox}>
                    <MaterialIcons name="school" size={rs(20)} color={colors.primaryLight} />
                  </View>
                  <View style={styles.infoContent}>
                     <Text style={styles.infoLbl}>Enrollment Status</Text>
                     <Text style={styles.infoVal}>6th Semester • Section A</Text>
                  </View>
               </BlurView>

               <BlurView intensity={15} tint="dark" style={styles.infoItem}>
                  <View style={styles.infoIconBox}>
                    <MaterialIcons name="verified-user" size={rs(20)} color={colors.success} />
                  </View>
                  <View style={styles.infoContent}>
                     <Text style={styles.infoLbl}>Identity Verification</Text>
                     <Text style={styles.infoVal}>Institutional ID Verified</Text>
                  </View>
               </BlurView>
            </View>

            {/* Actions */}
            <TouchableOpacity activeOpacity={0.85} style={styles.logoutBtn} onPress={handleLogout}>
               <LinearGradient 
                colors={[colors.danger, '#991b1b']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoutGradient}
               >
                  <MaterialIcons name="logout" size={rs(20)} color="#fff" />
                  <Text style={styles.logoutTxt}>Sign Out Account</Text>
               </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footerTxt}>MyCampusHub Professional v2.0 • Build OS-12</Text>
            
            <View style={{ height: rs(60) }} />
          </ScrollView>
        </SafeAreaView>
      </AnimatedBackground>

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
         <View style={styles.modalOverlay}>
            <BlurView intensity={100} tint="dark" style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Refine Profile</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setShowEditModal(false)} style={styles.closeBtn}>
                     <Ionicons name="close" size={rs(24)} color="#fff" />
                  </TouchableOpacity>
               </View>

               <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                  <View style={styles.inputBox}>
                     <Text style={styles.inputLbl}>Full Name</Text>
                     <TextInput 
                        style={styles.input} 
                        value={editName} 
                        onChangeText={setEditName}
                        placeholder="Ex: John Doe"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                     />
                  </View>

                  <View style={styles.inputBox}>
                     <Text style={styles.inputLbl}>Email Address (Read-only)</Text>
                     <TextInput 
                        style={[styles.input, { opacity: 0.5, backgroundColor: 'rgba(255,255,255,0.02)' }]} 
                        value={editEmail} 
                        editable={false}
                     />
                  </View>
                  
                  <View style={styles.inputBox}>
                     <Text style={styles.inputLbl}>Institutional Roll Number</Text>
                     <TextInput 
                        style={styles.input} 
                        value={editRollNumber} 
                        onChangeText={setEditRollNumber}
                        placeholder="Ex: NST-21-XXX"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                     />
                  </View>

                  <View style={styles.inputBox}>
                     <Text style={styles.inputLbl}>Academic Branch</Text>
                     <TextInput 
                        style={styles.input} 
                        value={editBranch} 
                        onChangeText={setEditBranch}
                        placeholder="Ex: CSE"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                     />
                  </View>

                  <TouchableOpacity activeOpacity={0.9} style={styles.saveBtn} onPress={handleSaveProfile}>
                     <LinearGradient
                        colors={[colors.primary, colors.secondary]}
                        style={styles.saveGradient}
                     >
                        <Text style={styles.saveBtnTxt}>Preserve Changes</Text>
                     </LinearGradient>
                  </TouchableOpacity>
                  
                  <View style={{ height: rs(40) }} />
               </ScrollView>
            </BlurView>
         </View>
      </Modal>
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
  editBtn: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(14),
    overflow: 'hidden',
  },
  iconBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: rs(20),
    paddingTop: rs(10),
  },
  profileHero: {
    alignItems: 'center',
    marginVertical: rs(30),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: rs(20),
  },
  avatarOuterRing: {
    width: rs(120),
    height: rs(120),
    borderRadius: rs(40),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.glass.background,
    padding: rs(6),
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: rs(34),
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: rs(34),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTxt: {
    fontSize: normalize(44),
    fontWeight: '900',
    color: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: rs(-4),
    right: rs(-4),
    width: rs(36),
    height: rs(36),
    borderRadius: rs(12),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  userName: {
    fontSize: normalize(24),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(4),
    letterSpacing: -0.5,
  },
  userSub: {
    fontSize: normalize(14),
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: rs(20),
  },
  rollTag: {
    paddingHorizontal: rs(18),
    paddingVertical: rs(8),
    borderRadius: rs(14),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
    overflow: 'hidden',
  },
  rollText: {
    fontSize: normalize(13),
    fontWeight: '900',
    color: colors.primaryLight,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionCard: {
    borderRadius: rs(28),
    padding: rs(24),
    marginBottom: rs(30),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
  },
  sectionHeading: {
    fontSize: normalize(16),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(20),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs(20),
  },
  statItem: {
    width: (width - rs(108)) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(12),
  },
  statIconBox: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statVal: {
    fontSize: normalize(18),
    fontWeight: '900',
    color: colors.text.white,
  },
  statLbl: {
    fontSize: normalize(10),
    color: colors.text.secondary,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoSection: {
    marginBottom: rs(30),
  },
  infoHeading: {
    fontSize: normalize(20),
    fontWeight: '900',
    color: colors.text.white,
    marginBottom: rs(15),
    letterSpacing: -0.5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rs(18),
    borderRadius: rs(24),
    marginBottom: rs(12),
    gap: rs(15),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass.background,
  },
  infoIconBox: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(12),
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLbl: {
    fontSize: normalize(11),
    color: colors.text.muted,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: rs(2),
  },
  infoVal: {
    fontSize: normalize(16),
    color: colors.text.white,
    fontWeight: '700',
  },
  logoutBtn: {
    marginBottom: rs(40),
    borderRadius: rs(24),
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rs(20),
    gap: rs(10),
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutTxt: {
    fontSize: normalize(16),
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerTxt: {
    textAlign: 'center',
    fontSize: normalize(12),
    color: colors.text.muted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    borderTopLeftRadius: rs(40),
    borderTopRightRadius: rs(40),
    padding: rs(30),
    minHeight: '70%',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(30),
  },
  modalTitle: {
    fontSize: normalize(24),
    fontWeight: '900',
    color: colors.text.white,
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(14),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
  },
  inputBox: {
    marginBottom: rs(24),
  },
  inputLbl: {
    fontSize: normalize(12),
    fontWeight: '900',
    color: colors.primaryLight,
    textTransform: 'uppercase',
    marginBottom: rs(10),
    paddingLeft: rs(4),
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: rs(20),
    padding: rs(18),
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '700',
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveBtn: {
    borderRadius: rs(20),
    overflow: 'hidden',
    marginTop: rs(20),
  },
  saveGradient: {
    paddingVertical: rs(20),
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnTxt: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});

export default ProfileScreen;
