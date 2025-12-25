import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin, apiRegister, apiLogout, apiGetCurrentUser, apiUpdateProfile } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to save user data
  const saveUserData = useCallback(async (userData) => {
    try {
      await AsyncStorage.setItem('mch_user', JSON.stringify(userData));
      setUser(userData);
      if (__DEV__) console.log('✅ User data saved to AsyncStorage');
    } catch (error) {
      if (__DEV__) console.error('❌ Failed to save user data:', error);
    }
  }, []);

  // Load stored user data on app start
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const [storedUser, storedToken] = await AsyncStorage.multiGet(['mch_user', 'mch_token']);
        const userValue = storedUser?.[1];
        const tokenValue = storedToken?.[1];
        
        if (userValue) {
          const parsedUser = JSON.parse(userValue);
          setUser(parsedUser);
          if (__DEV__) console.log('✅ User data loaded from AsyncStorage:', parsedUser.email);
        }
        
        if (tokenValue) {
          global.__MCH_TOKEN__ = tokenValue;
          if (__DEV__) console.log('✅ Token loaded from AsyncStorage');
        }
      } catch (e) {
        if (__DEV__) console.error('❌ Failed to load stored user:', e);
      } finally {
        setLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      const { token, user: payloadUser } = res.data;
      
      // Save token globally
      global.__MCH_TOKEN__ = token;
      
      // Save both user and token to AsyncStorage
      await AsyncStorage.multiSet([
        ['mch_user', JSON.stringify(payloadUser)],
        ['mch_token', token],
      ]);
      
      // Update state
      setUser(payloadUser);
      
      if (__DEV__) console.log('✅ Login successful, user data saved:', payloadUser.email);
      
      return { success: true, user: payloadUser };
    } catch (error) {
      const message = error.response?.data?.error || 'Unable to login. Please try again.';
      if (__DEV__) console.error('❌ Login failed:', message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const res = await apiRegister(userData);
      const { token, user: payloadUser } = res.data;
      
      // Save token globally
      global.__MCH_TOKEN__ = token;
      
      // Save both user and token to AsyncStorage
      await AsyncStorage.multiSet([
        ['mch_user', JSON.stringify(payloadUser)],
        ['mch_token', token],
      ]);
      
      // Update state
      setUser(payloadUser);
      
      if (__DEV__) console.log('✅ Registration successful, user data saved:', payloadUser.email);
      
      return { success: true, user: payloadUser };
    } catch (error) {
      const message = error.response?.data?.error || 'Unable to signup. Please try again.';
      if (__DEV__) console.error('❌ Registration failed:', message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (__DEV__) console.log('🔄 Logout: Starting logout process...');
      
      // Try to invalidate session on server
      try {
        await apiLogout();
        if (__DEV__) console.log('✅ Logout: Session invalidated on server');
      } catch (apiError) {
        if (__DEV__) console.warn('⚠️ Logout: Failed to invalidate session on server:', apiError.message);
      }
      
      // Clear AsyncStorage - user data will be removed
      await AsyncStorage.multiRemove(['mch_user', 'mch_token']);
      if (__DEV__) console.log('✅ Logout: AsyncStorage cleared (user data removed)');
      
      // Clear global token
      global.__MCH_TOKEN__ = undefined;
      if (__DEV__) console.log('✅ Logout: Global token cleared');
      
      // Clear user state
      setUser(null);
      if (__DEV__) console.log('✅ Logout: User state cleared - navigating to Welcome');
      
      return true;
    } catch (e) {
      if (__DEV__) console.error('❌ Logout error:', e);
      
      // Force clear everything on error
      try {
        await AsyncStorage.multiRemove(['mch_user', 'mch_token']);
        global.__MCH_TOKEN__ = undefined;
        setUser(null);
        if (__DEV__) console.log('✅ Force logout completed');
      } catch (clearError) {
        if (__DEV__) console.error('❌ Force logout error:', clearError);
      }
      
      return false;
    }
  }, []);

  const updateUser = useCallback(async (profileData) => {
    try {
      const res = await apiUpdateProfile(profileData);
      const updatedUser = res.data.user;
      
      // Save updated user data to AsyncStorage
      await AsyncStorage.setItem('mch_user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      if (__DEV__) console.log('✅ User profile updated and saved:', updatedUser.email);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update profile';
      if (__DEV__) console.error('❌ Update user error:', error);
      return { success: false, error: message };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await apiGetCurrentUser();
      const freshUser = res.data.user;
      
      // Save refreshed user data to AsyncStorage
      await AsyncStorage.setItem('mch_user', JSON.stringify(freshUser));
      
      // Update state
      setUser(freshUser);
      
      if (__DEV__) console.log('✅ User data refreshed from server:', freshUser.email);
      
      return { success: true, user: freshUser };
    } catch (error) {
      if (__DEV__) console.error('❌ Failed to refresh user:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const value = useMemo(() => ({ 
    user, 
    loading, 
    login, 
    register, 
    logout, 
    updateUser, 
    refreshUser 
  }), [user, loading, login, register, logout, updateUser, refreshUser]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};


