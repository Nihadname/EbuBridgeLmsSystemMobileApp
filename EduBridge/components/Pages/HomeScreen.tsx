import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import CustomInput from '../CustomInput';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
type Tab = 'home' | 'register';
// Get screen dimensions
const { width, height } = Dimensions.get('window');

// ────────────────────────────────────────────────────────────
// Types & Validation
// ────────────────────────────────────────────────────────────
interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap | string;
  title: string;
  description: string;
  color: string;
  delay: number;
}

interface SocialButtonProps {
  icon: keyof typeof FontAwesome5.glyphMap | string;
  backgroundColor: string;
  onPress: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

// ────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, delay }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, delay]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue;

  return (
    <Animated.View
      style={[
        styles.featureCard,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: `${color}10`, // Light version of the color
        },
      ]}
    >
      <View style={[styles.featureIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
};

const SocialButton: React.FC<SocialButtonProps> = ({ icon, backgroundColor, onPress }) => {
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <TouchableOpacity
        style={[styles.socialButton, { backgroundColor }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <FontAwesome5 name={icon as any} size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ────────────────────────────────────────────────────────────
// Screen Component
// ────────────────────────────────────────────────────────────
const HomeAndRegister: React.FC = () => {
  const [loading, setLoading] = useState(false);
const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  // ───── Animations ─────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim, translateAnim, scaleAnim, floatingAnim]);

  const floatingTranslate = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  // ───── Handlers ───────────────────────────────
  const handleRegister = async (
    values: FormValues,
    { setSubmitting, setStatus }: FormikHelpers<FormValues>,
  ) => {
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise(resolve => setTimeout(resolve, 2000));
      // const response = await axios.post('https://your-backend-api.com/register', values);

      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
    } catch (error) {
      setStatus({ error: 'Registration failed. Please try again.' });
      console.error('Registration error: ', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const switchTab = (tab: Tab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
    if (tab === 'register') {
      scrollViewRef.current?.scrollTo({ y: height * 0.45, animated: true });
    } else {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  // ───── UI ─────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="light-content" />

      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <View style={styles.successOverlay}>
          <BlurView intensity={90} style={styles.blurContainer}>
            <LottieView
              source={require('../../assets/animations/success.json')}
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.successText}>Account Created!</Text>
          </BlurView>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#4F48E2', '#6C63FF', '#8B81FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              {/* Floating circles */}
              <Animated.View
                style={[styles.floatingCircle, styles.floatingCircle1, { transform: [{ translateY: floatingTranslate }] }]}
              />
              <Animated.View
                style={[styles.floatingCircle, styles.floatingCircle2, { transform: [{ translateY: floatingTranslate }] }]}
              />
              <Animated.View
                style={[styles.floatingCircle, styles.floatingCircle3, { transform: [{ translateY: floatingTranslate }] }]}
              />

              {/* Header Content */}
         <Animated.View
  style={{
    opacity: fadeAnim,
    transform: [
      { translateY: translateAnim },
      { scale: scaleAnim },
    ],
  }}
>
  <View style={styles.logoContainer}>
    <Image source={require('../../assets/ChatGPT Image May 14, 2025, 05_15_35 PM.png')} style={styles.logo} />
  </View>

  <Text style={styles.welcomeText}>Welcome to</Text>
  <Text style={styles.appTitle}>AI Learning Hub</Text>
  <Text style={styles.subtitle}>Your Gateway to Smart Education</Text>

  {activeTab === 'home' && (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.description}>
        Unlock the future of learning with cutting‑edge AI‑driven tools and resources.
      </Text>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            (activeTab as Tab) === 'home' && styles.activeTabButton,
          ]}
          onPress={() => switchTab('home')}
        >
          <Text
            style={[
              styles.tabButtonText,
              (activeTab as Tab) === 'home' && styles.activeTabButtonText,
            ]}
          >
            Explore
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            (activeTab as Tab) === 'register' && styles.activeTabButton,
          ]}
          onPress={() => switchTab('register')}
        >
          <Text
            style={[
              styles.tabButtonText,
              (activeTab as Tab) === 'register' && styles.activeTabButtonText,
            ]}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )}
</Animated.View>

            </LinearGradient>
          </View>

          {/* Main Content */}
          <View style={styles.mainContentContainer}>
            {activeTab === 'home' ? (
              <View style={styles.homeContainer}>
                {/* Hero Image */}
                <Animated.View
                  style={[
                    styles.heroImageContainer,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <Image
                    source={require('../../assets/ai-learning-illustration.png')}
                    style={styles.heroImage}
                    resizeMode="contain"
                  />
                </Animated.View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  <Text style={styles.sectionTitle}>What We Offer</Text>

                  <FeatureCard
                    icon="bulb-outline"
                    title="Adaptive Learning"
                    description="Personalized learning paths tailored to your pace and style."
                    color="#6C63FF"
                    delay={300}
                  />

                  <FeatureCard
                    icon="analytics-outline"
                    title="Progress Tracking"
                    description="Real-time insights into your learning journey."
                    color="#FF6584"
                    delay={450}
                  />

                  <FeatureCard
                    icon="planet-outline"
                    title="Global Community"
                    description="Connect with learners and educators worldwide."
                    color="#4CAF50"
                    delay={600}
                  />
                </View>

                {/* Get Started Button */}
                <TouchableOpacity
                  style={styles.getStartedButton}
                  onPress={() => switchTab('register')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.getStartedButtonText}>Get Started</Text>
                  <MaterialIcons name="arrow-forward" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateAnim }] }}>
                  <Text style={styles.registerTitle}>Create Your Account</Text>

                  {/* Social Buttons */}
                  <View style={styles.socialButtonsContainer}>
                    <SocialButton
                      icon="google"
                      backgroundColor="#DB4437"
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    />
                    <SocialButton
                      icon="facebook"
                      backgroundColor="#3b5998"
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    />
                    <SocialButton
                      icon="apple"
                      backgroundColor="#000000"
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    />
                  </View>

                  {/* Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or register with email</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Formik Form */}
                  <Formik
                    initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                    onSubmit={handleRegister}
                    validationSchema={validationSchema}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched, isSubmitting }) => (
                      <View style={styles.form}>
                        <CustomInput
                          field="name"
                          placeholder="Full Name"
                          icon="person"
                          value={values.name}
                          onChangeText={handleChange('name')}
                          error={errors.name}
                          touched={touched.name}
                        />

                        <CustomInput
                          field="email"
                          placeholder="Email Address"
                          icon="email"
                          value={values.email}
                          onChangeText={handleChange('email')}
                          error={errors.email}
                          touched={touched.email}
                          keyboardType="email-address"
                        />

                        <CustomInput
                          field="password"
                          placeholder="Password"
                          icon="lock"
                          value={values.password}
                          onChangeText={handleChange('password')}
                          error={errors.password}
                          touched={touched.password}
                          secureTextEntry
                        />

                        <CustomInput
                          field="confirmPassword"
                          placeholder="Confirm Password"
                          icon="lock-outline"
                          value={values.confirmPassword}
                          onChangeText={handleChange('confirmPassword')}
                          error={errors.confirmPassword}
                          touched={touched.confirmPassword}
                          secureTextEntry
                        />

                        {/* Register Button */}
                        <TouchableOpacity
                          style={styles.registerButton}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            handleSubmit();
                          }}
                          disabled={isSubmitting || loading}
                          activeOpacity={0.8}
                        >
                          {loading ? (
                            <ActivityIndicator color="white" size="small" />
                          ) : (
                            <LinearGradient
                              colors={['#6C63FF', '#4F48E2']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.buttonGradient}
                            >
                              <Text style={styles.registerButtonText}>Create Account</Text>
                              <MaterialIcons name="arrow-forward" size={20} color="white" />
                            </LinearGradient>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </Formik>

                  {/* Login Link */}
                  <View style={styles.loginPrompt}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => Haptics.selectionAsync()}>
                      <Text style={styles.loginLink}>Login here</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    overflow: 'hidden',
    height: height * 0.65, // Make header take up more space
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1000, // Make perfectly round
  },
  floatingCircle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.4,
    left: -width * 0.2,
  },
  floatingCircle2: {
    width: width * 0.7,
    height: width * 0.7,
    top: height * 0.15,
    right: -width * 0.35,
  },
  floatingCircle3: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: height * 0.1,
    left: -width * 0.2,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 35,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 20,
    opacity: 0.95,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 8,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 6,
    width: '80%',
    alignSelf: 'center',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
  },
  tabButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabButtonText: {
    color: '#6C63FF',
  },
  mainContentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  homeContainer: {
    flex: 1,
    padding: 20,
  },
  heroImageContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  heroImage: {
    width: width * 0.65,
    height: 120,
    resizeMode: 'contain',
  },
  featuresContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  getStartedButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  registerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#757575',
    fontSize: 13,
  },
  form: {
    marginBottom: 16,
  },
  registerButton: {
    borderRadius: 12,
    height: 50,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#757575',
    fontSize: 14,
  },
  loginLink: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  successOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: 180,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default HomeAndRegister;
