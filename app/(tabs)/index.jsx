import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    ActivityIndicator, Alert,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { auth } from '../../config/firebase';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function AuthPage() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [user, loading, error] = useAuthState(auth);

  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigation.replace('HealthSelectionScreen');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      return Alert.alert('Error', 'Please fill all fields.');
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword) {
      return Alert.alert('Error', 'Please fill all fields.');
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      await updateProfile(userCredential.user, {
        displayName: registerName,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={[styles.pageContainer, isDarkMode && { backgroundColor: '#121212' }]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isDarkMode && { backgroundColor: '#121212' },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>🛡️</Text>
            </View>
          </View>
          <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>
            Welcome to SakhiSetu
          </Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setMode('login')}
              style={[styles.tab, mode === 'login' && styles.activeTabBackground]}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('register')}
              style={[styles.tab, mode === 'register' && styles.activeTabBackground]}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Forms */}
          {mode === 'login' ? (
            <View style={styles.form}>
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Email</Text>
              <TextInput
                placeholder="name@example.com"
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Password</Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={loginPassword}
                onChangeText={setLoginPassword}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogin} style={[styles.button, isDarkMode && styles.buttonDark]} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Full Name</Text>
              <TextInput
                placeholder="John Doe"
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={registerName}
                onChangeText={setRegisterName}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Email</Text>
              <TextInput
                placeholder="name@example.com"
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={registerEmail}
                onChangeText={setRegisterEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Password</Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                style={[styles.input, isDarkMode && styles.inputDark]}
                value={registerPassword}
                onChangeText={setRegisterPassword}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              <TouchableOpacity onPress={handleRegister} style={[styles.button, isDarkMode && styles.buttonDark]} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create account</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* OAuth Buttons */}
          <OAuthButtons isDarkMode={isDarkMode} />

          <TouchableOpacity>
            <Text style={[styles.privacyPolicy, isDarkMode && { color: '#64b5f6' }]}>Privacy Policy.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function OAuthButtons({ isDarkMode }) {
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Text style={[styles.oauthText, isDarkMode && { color: '#999' }]}>Or continue with</Text>
      </View>
      <View style={styles.oauthButtonContainer}>
        <TouchableOpacity style={[styles.oauthButton, isDarkMode && styles.oauthButtonDark]} onPress={() => alert('Facebook login coming soon')}>
          <Text style={[styles.oauthButtonText, isDarkMode && { color: '#fff' }]}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.oauthButton, isDarkMode && styles.oauthButtonDark]} onPress={() => alert('Google login coming soon')}>
          <Text style={[styles.oauthButtonText, isDarkMode && { color: '#fff' }]}>Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: isWeb ? '100vh' : '100%',
  },
  container: {
    padding: isWeb ? Math.min(24, width * 0.05) : 24,
    paddingTop: isWeb ? Math.min(60, height * 0.08) : 60,
    backgroundColor: '#fff',
    minHeight: isWeb ? '100vh' : '100%',
    justifyContent: 'center',
  },
  contentWrapper: {
    maxWidth: isWeb ? 400 : '100%',
    width: '100%',
    alignSelf: 'center',
    ...(isWeb && {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: 12,
      padding: 32,
      backgroundColor: '#fff',
    }),
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 999,
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'transform 0.2s ease-in-out',
    }),
  },
  icon: {
    fontSize: 32,
    color: '#007bff',
  },
  title: {
    fontSize: isWeb ? Math.min(28, width * 0.07) : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    ...(isWeb && {
      background: 'linear-gradient(135deg, #007bff, #0056b3)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }),
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    ...(isWeb && {
      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    }),
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        backgroundColor: '#e9ecef',
      },
    }),
  },
  activeTabBackground: {
    backgroundColor: '#e6f0ff',
    ...(isWeb && {
      boxShadow: '0 2px 4px 0 rgba(0, 123, 255, 0.2)',
    }),
  },
  tabText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#007bff',
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
    color: '#212529',
    fontSize: 14,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
    fontSize: 16,
    ...(isWeb && {
      outline: 'none',
      transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      ':focus': {
        borderColor: '#007bff',
        boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
      },
    }),
  },
  inputDark: {
    backgroundColor: '#2d2d2d',
    borderColor: '#555',
    color: '#fff',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 16,
    ...(isWeb && {
      cursor: 'pointer',
    }),
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 13,
    ...(isWeb && {
      ':hover': {
        textDecoration: 'underline',
      },
    }),
  },
  button: {
    backgroundColor: '#cce0ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        backgroundColor: '#b3d9ff',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px 0 rgba(0, 123, 255, 0.2)',
      },
      ':active': {
        transform: 'translateY(0)',
      },
    }),
  },
  buttonDark: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  oauthText: {
    fontSize: 12,
    color: '#6c757d',
  },
  oauthButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  oauthButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        backgroundColor: '#f8f9fa',
        borderColor: '#007bff',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  oauthButtonDark: {
    backgroundColor: '#2d2d2d',
    borderColor: '#555',
  },
  oauthButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343a40',
  },
  privacyPolicy: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
    color: '#007bff',
    textDecorationLine: 'underline',
    ...(isWeb && {
      cursor: 'pointer',
      ':hover': {
        color: '#0056b3',
      },
    }),
  },
});
