import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Animated, KeyboardTypeOptions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Define types for valid MaterialIcons names
type MaterialIconNames =
  | 'error'
  | 'visibility'
  | 'input'
  | 'sort'
  | 'map'
  | 'person'
  | 'email'
  | 'lock'
  | 'lock-outline';

type CustomInputProps = {
  field: string;
  placeholder: string;
  secureTextEntry?: boolean; // Optional, since some inputs may not need this
  icon: MaterialIconNames;
  value: string;
  onChangeText: (e: string) => void;
  error?: string;
  touched?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

const CustomInput: React.FC<CustomInputProps> = ({
  field,
  placeholder,
  secureTextEntry = false,
  icon,
  value,
  onChangeText,
  error,
  touched,
  keyboardType = 'default',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#6C63FF'],
  });

  return (
    <View style={styles.inputContainer}>
      <Animated.View style={[styles.inputWrapper, { borderColor }]}>
        <MaterialIcons name={icon} size={20} color={isFocused ? '#6C63FF' : '#757575'} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          placeholderTextColor="#9E9E9E"
        />
      </Animated.View>
      {touched && error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={16} color="#FF5252" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#F5F5F5',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 10,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginLeft: 5,
  },
});

export default CustomInput;
