import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, ScrollView } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password should be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match') // Remove `null`
    .required('Confirm Password is required'),
});


const HomeAndRegister = () => {
  // Handle form submission to backend (replace with your API endpoint)
  const handleRegister = async (values: any) => {
    try {
      const response = await axios.post('https://your-backend-api.com/register', values);
      console.log(response.data);
      // Handle successful registration (e.g., navigate to a different screen or show a success message)
    } catch (error) {
      console.error('Registration error: ', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.homeSection}>
        <Text style={styles.welcomeText}>Welcome to the AI-powered LMS!</Text>
        <Text style={styles.subtitle}>Start your learning journey today.</Text>
      </View>

      <View style={styles.registerSection}>
        <Text style={styles.sectionTitle}>Register to Get Started</Text>

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          onSubmit={handleRegister} // Using the onSubmit event for Formik
          validationSchema={validationSchema}>
          {({ values, handleChange, handleSubmit, errors, touched }) => (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={values.name}
                onChangeText={handleChange('name')}
              />
              {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                secureTextEntry
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
              />
              {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              {/* Use Button for React Native */}
              <Button title="Register" onPress={() => handleSubmit()} />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  homeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 18,
    color: '#7F8C8D',
    marginTop: 10,
  },
  registerSection: {
    backgroundColor: '#ECF0F1',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default HomeAndRegister;
