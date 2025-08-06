import { Image, StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { wp, hp } from '../helpers/common';
import { theme } from '../constants/themes';
import { useRouter } from 'expo-router';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Icon } from '../assets/icons';
import { Ionicons } from '@expo/vector-icons';

const Welcome = () => {

  // State variables for user login
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle user login
  const login = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password to login.');
      return;
    }
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        router.replace('/(tabs)/discover');
      }
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'User not found';
      }
      Alert.alert('Login failed', errorMessage);
    }
  };

  // Handle user sign up
  const signUp = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both new email and new password to create account.');
      return;
    }
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        router.replace('/(tabs)/discover');
      }
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please use another email or login.';

      }
      Alert.alert('Sign up failed', errorMessage);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.welcomeImage} resizeMode="cover" source={require('../assets/images/museum.png')} />
        </View>
        <View>
          <Text style={styles.welcomeTitle}>ArtVista</Text>
        </View>

        <View>
          <Text style={styles.login}>Login / Create Account</Text>
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter email" 
            placeholderTextColor="gray" 
            value={email} 
            onChangeText={setEmail} 
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password"
              placeholderTextColor="gray" 
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeButton}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={signUp}>
              <Text style={styles.text}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: theme.radius.xl, 
    overflow: 'hidden',
    alignSelf: 'center',
  },
  welcomeImage: {
    height: hp(35),
    width: wp(80),
    alignSelf: 'center',
  },
  welcomeTitle: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: theme.fonts.bold,
    paddingTop: hp(3),
    paddingBottom: hp(3),
  },
  login: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    width: wp(80),
    padding: 10,
    marginVertical: 5,
    fontSize: hp(2.2), 
    color: theme.colors.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    width: wp(80),
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: hp(2.2), 
    marginVertical: 10,
    color: theme.colors.text,
  },
  eyeButton: {
    paddingHorizontal: 5,
  },
  buttonContainer: {
    marginTop: hp(4),
  },
  button: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 10,
    borderRadius: 10,
    width: wp(80),
    alignItems: 'center',
    marginVertical: 5,
  },
  text: {
    color: theme.colors.text,
    fontWeight: theme.fonts.semibold,
    fontSize: hp(2.2),
  },
});
