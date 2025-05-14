import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import CustomInput from '../CustomInput'; // Import CustomInput component

// Define types for Formik values
interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const HomeAndRegister = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: FormValues, { setSubmitting, setStatus }: FormikHelpers<FormValues>) => {
    try {
      setLoading(true);
      const response = await axios.post('https://your-backend-api.com/register', values);
      console.log(response.data);
      // Handle successful registration
    } catch (error) {
      setStatus({ error: 'Registration failed. Please try again.' });
      console.error('Registration error: ', error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={['#6C63FF', '#3b5998']} style={styles.headerGradient}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>AI Learning Hub</Text>
          <Text style={styles.subtitle}>Your Gateway to Smart Education</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.registerTitle}>Create Account</Text>

          <View style={styles.socialButtonsContainer}>
            <SocialButton icon="google" backgroundColor="#DB4437" onPress={() => {}} />
            <SocialButton icon="facebook" backgroundColor="#3b5998" onPress={() => {}} />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or register with email</Text>
            <View style={styles.dividerLine} />
          </View>

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

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text style={styles.registerButtonText}>Create Account</Text>
                      <MaterialIcons name="arrow-forward" size={20} color="white" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SocialButton = ({ icon, backgroundColor, onPress }: { icon: string, backgroundColor: string, onPress: () => void }) => (
  <TouchableOpacity style={[styles.socialButton, { backgroundColor }]} onPress={onPress}>
    <FontAwesome5 name={icon} size={20} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
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
    opacity: 0.8,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: -20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    borderRadius: 25,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
    marginLeft: 5,
  },
});

export default HomeAndRegister;
