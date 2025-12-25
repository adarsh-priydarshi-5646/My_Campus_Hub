import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#6366f1', // Indigo 500
  primaryDark: '#4f46e5', // Indigo 600
  primaryLight: '#818cf8', // Indigo 400
  secondary: '#a855f7', // Purple 500
  accent: '#ec4899', // Pink 500
  success: '#10b981', // Emerald 500
  warning: '#f59e0b', // Amber 500
  danger: '#ef4444', // Red 500
  background: '#0f172a', // Slate 900
  surface: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity
  surfaceLight: 'rgba(51, 65, 85, 0.5)', // Slate 700 with opacity
  text: {
    primary: '#f8fafc', // Slate 50
    secondary: '#94a3b8', // Slate 400
    muted: '#64748b', // Slate 500
    white: '#ffffff',
  },
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',
  glass: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.1)',
    highlight: 'rgba(255, 255, 255, 0.05)',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
  },
  h3: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },
  h4: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  }
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  glassCard: {
    backgroundColor: colors.glass.background,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: 16,
    minHeight: 56,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  header: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    color: colors.text.white,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  mb: { marginBottom: spacing.md },
  mbLg: { marginBottom: spacing.lg },
  mt: { marginTop: spacing.md },
  px: { paddingHorizontal: spacing.md },
  py: { paddingVertical: spacing.md },
});

// Screen dimensions and breakpoints
export const screenWidth = width;
export const screenHeight = height;
export const isSmallScreen = width < 375;
export const isMediumScreen = width >= 375 && width < 414;
export const isLargeScreen = width >= 414;
export const isTablet = width >= 768;
export const isDesktop = width >= 1024;

// Responsive spacing
export const responsiveSpacing = {
  xs: isSmallScreen ? 3 : spacing.xs,
  sm: isSmallScreen ? 6 : spacing.sm,
  md: isSmallScreen ? 12 : spacing.md,
  lg: isSmallScreen ? 18 : spacing.lg,
  xl: isSmallScreen ? 24 : spacing.xl,
  xxl: isSmallScreen ? 36 : spacing.xxl,
};

// Responsive typography
export const responsiveTypography = {
  h1: {
    fontSize: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
    fontWeight: '800',
    lineHeight: isSmallScreen ? 32 : isMediumScreen ? 36 : 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
    fontWeight: '700',
    lineHeight: isSmallScreen ? 28 : isMediumScreen ? 32 : 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: isSmallScreen ? 18 : isMediumScreen ? 20 : 24,
    fontWeight: '700',
    lineHeight: isSmallScreen ? 26 : isMediumScreen ? 28 : 32,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
    fontWeight: '600',
    lineHeight: isSmallScreen ? 24 : isMediumScreen ? 26 : 28,
    letterSpacing: -0.1,
  },
  body: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '400',
    lineHeight: isSmallScreen ? 22 : 26,
    letterSpacing: 0.1,
  },
  bodySmall: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '400',
    lineHeight: isSmallScreen ? 18 : 22,
    letterSpacing: 0.1,
  },
};