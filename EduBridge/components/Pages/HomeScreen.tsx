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
              source={require('../assets/animations/success.json')}
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
    <Image source={require('../assets/ai-brain-logo.png')} style={styles.logo} />
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
                    source={require('../assets/ai-learning-illustration.png')}
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
  },
  headerGradient: {
    paddingTop: 60 + (Platform.OS === 'ios' ? 0 : 20),
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    overflow: 'hidden',
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  floatingCircle1: {
    width: 150,
    height: 150,
    top: -30,
    left: -30,
  },
  floatingCircle2: {
    width: 100,
    height: 100,
    top: 80,
    right: -20,
  },
  floatingCircle3: {
    width: 60,
    height: 60,
    bottom: 20,
    left: 50,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 15,
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    fontWeight: '500',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 15,
    textAlign: 'center',
    maxWidth: '90%',
    alignSelf: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 5,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
  },
  tabButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#6C63FF',
  },
  mainContentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  homeContainer: {
    flex: 1,
    padding: 20,
  },
  heroImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  heroImage: {
    width: width * 0.9,
    height: 200,
  },
  featuresContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  getStartedButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 15,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  formContainer: {
    flex: 1,
    padding: 25,
  },
  registerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  socialButton: {
    width: 55,
    height: 55,
    borderRadius: 18,
    marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#757575',
    fontSize: 14,
  },
  form: {
    marginBottom: 20,
  },
  registerButton: {
    borderRadius: 15,
    height: 55,
    overflow: 'hidden',
    marginTop: 15,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#757575',
    fontSize: 15,
  },
  loginLink: {
    color: '#6C63FF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
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
    width: 200,
    height: 200,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HomeAndRegister;
