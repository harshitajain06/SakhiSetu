import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, GoogleAuthProvider, reload, sendEmailVerification, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { auth, GOOGLE_OAUTH_CLIENT_ID } from '../../config/firebase';
import { useTranslation } from '../../contexts/TranslationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function AuthPage() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t } = useTranslation();

  const [user, loading, error] = useAuthState(auth);

  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [mode, setMode] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Validation errors
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });
  const [registerErrors, setRegisterErrors] = useState({ name: '', email: '', password: '' });
  
  // Track touched fields to only show errors after user interaction
  const [loginTouched, setLoginTouched] = useState({ email: false, password: false });
  const [registerTouched, setRegisterTouched] = useState({ name: false, email: false, password: false });
  
  // Track if form has been submitted to show all errors
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [registerSubmitted, setRegisterSubmitted] = useState(false);
  
  // Hover states for web
  const [loginButtonHover, setLoginButtonHover] = useState(false);
  const [registerButtonHover, setRegisterButtonHover] = useState(false);
  const [loginGoogleButtonHover, setLoginGoogleButtonHover] = useState(false);
  const [registerGoogleButtonHover, setRegisterGoogleButtonHover] = useState(false);

  useEffect(() => {
    const checkUserVerification = async () => {
      if (user) {
        // Reload user to get latest email verification status
        try {
          await reload(user);
          
          // Get the updated user from auth.currentUser after reload
          const currentUser = auth.currentUser;
          
          // Check if email is verified
          if (currentUser && !currentUser.emailVerified) {
            // Don't navigate if email is not verified
            setShowVerificationMessage(true);
            showToast('info', 'Email Not Verified', 'Please verify your email address before accessing the app. Check your inbox for the verification email.');
            return;
          }
          
          // Only navigate if email is verified
          if (currentUser && currentUser.emailVerified) {
            setShowVerificationMessage(false);
            navigation.replace('WelcomeScreen');
          }
        } catch (error) {
          console.error('Error checking verification:', error);
          // If reload fails, check current status from auth
          const currentUser = auth.currentUser;
          if (currentUser && !currentUser.emailVerified) {
            setShowVerificationMessage(true);
            return;
          }
          if (currentUser && currentUser.emailVerified) {
            setShowVerificationMessage(false);
            navigation.replace('WelcomeScreen');
          }
        }
      } else {
        // User logged out - reset verification message
        setShowVerificationMessage(false);
      }
    };
    
    if (user) {
      checkUserVerification();
    } else {
      // Reset verification message when user logs out
      setShowVerificationMessage(false);
    }
  }, [user]);

  // Periodically check if user has verified their email (useful when they verify and come back)
  useEffect(() => {
    if (user && !user.emailVerified && showVerificationMessage) {
      const interval = setInterval(async () => {
        try {
          await reload(user);
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.emailVerified) {
            setShowVerificationMessage(false);
            showToast('success', 'Email Verified', 'Your email has been verified! Redirecting...');
            navigation.replace('WelcomeScreen');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
        }
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [user, showVerificationMessage]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password, isLogin = false) => {
    if (!password) {
      return 'Password is required';
    }
    if (!isLogin && password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!isLogin && !/(?=.*[a-z])(?=.*[A-Z])/.test(password) && !/(?=.*\d)/.test(password)) {
      return 'Password should contain at least one uppercase letter, one lowercase letter, or one number';
    }
    return '';
  };

  const validateName = (name) => {
    if (!name) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return 'Name should only contain letters and spaces';
    }
    return '';
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type: type, // 'success', 'error', 'info'
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const handleLogin = async () => {
    // Mark form as submitted
    setLoginSubmitted(true);
    
    // Mark all fields as touched
    setLoginTouched({ email: true, password: true });
    
    // Validate fields
    const emailError = validateEmail(loginEmail);
    const passwordError = validatePassword(loginPassword, true);

    setLoginErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      showToast('error', 'Validation Error', emailError || passwordError);
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      
      // Reload user to get latest email verification status
      await reload(userCredential.user);
      
      // Get updated user after reload
      const currentUser = auth.currentUser;
      
      // Check if email is verified
      if (currentUser && !currentUser.emailVerified) {
        setIsLoading(false);
        setShowVerificationMessage(true);
        showToast('info', 'Email Not Verified', 'Please verify your email address before logging in. Check your inbox for the verification email.');
        // Don't sign out - allow them to resend verification email
        // Navigation will be blocked by useEffect
        return;
      }
      
      // Only show success if verified (navigation handled by useEffect)
      if (currentUser && currentUser.emailVerified) {
        showToast('success', 'Success', 'Logged in successfully!');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      showToast('error', 'Login Failed', errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    // Validate email
    if (!loginEmail || !loginEmail.trim()) {
      showToast('error', 'Email Required', 'Please enter your email address to reset your password.');
      setLoginErrors({ ...loginErrors, email: 'Email is required' });
      return;
    }

    const emailError = validateEmail(loginEmail.trim());
    if (emailError) {
      showToast('error', 'Invalid Email', emailError);
      setLoginErrors({ ...loginErrors, email: emailError });
      return;
    }

    setIsResettingPassword(true);
    try {
      const trimmedEmail = loginEmail.trim();
      await sendPasswordResetEmail(auth, trimmedEmail);
      showToast('success', 'Email Sent', 'Password reset email has been sent. Please check your inbox.');
      // Clear the email field after successful send
      setLoginEmail('');
      setLoginErrors({ email: '', password: '' });
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/missing-email') {
        errorMessage = 'Email address is required.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      showToast('error', 'Reset Failed', errorMessage);
      setLoginErrors({ ...loginErrors, email: errorMessage });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      showToast('error', 'Error', 'Please log in first to resend verification email.');
      return;
    }

    setIsSendingVerification(true);
    try {
      await sendEmailVerification(auth.currentUser);
      showToast('success', 'Email Sent', 'Verification email has been sent. Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification email:', error);
      let errorMessage = 'Failed to send verification email. Please try again.';
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please log in again.';
      }
      
      showToast('error', 'Send Failed', errorMessage);
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleRegister = async () => {
    // Mark form as submitted
    setRegisterSubmitted(true);
    
    // Mark all fields as touched
    setRegisterTouched({ name: true, email: true, password: true });
    
    // Validate all fields
    const nameError = validateName(registerName);
    const emailError = validateEmail(registerEmail);
    const passwordError = validatePassword(registerPassword, false);

    setRegisterErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });

    if (nameError || emailError || passwordError) {
      const firstError = nameError || emailError || passwordError;
      showToast('error', 'Validation Error', firstError);
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail.trim(),
        registerPassword
      );
      await updateProfile(userCredential.user, {
        displayName: registerName.trim(),
      });
      
      // Send verification email
      try {
        await sendEmailVerification(userCredential.user);
        setShowVerificationMessage(true);
        showToast('success', 'Account Created', 'Account created successfully! Please check your email to verify your account.');
      } catch (verificationError) {
        console.error('Error sending verification email:', verificationError);
        showToast('warning', 'Account Created', 'Account created successfully, but verification email could not be sent. You can resend it later.');
      }
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Registration is currently disabled.';
      }
      
      showToast('error', 'Registration Failed', errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      if (isWeb) {
        // Web: Use signInWithPopup
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        const result = await signInWithPopup(auth, provider);
        // Reload to get latest verification status
        await reload(result.user);
        // Google accounts are typically already verified, but check anyway
        if (!result.user.emailVerified) {
          setShowVerificationMessage(true);
          showToast('info', 'Email Not Verified', 'Please verify your email address. Check your inbox for the verification email.');
        } else {
          showToast('success', 'Success', 'Signed in with Google successfully!');
        }
        setIsLoading(false);
      } else {
        // Native: Use expo-auth-session with Google OAuth
        WebBrowser.maybeCompleteAuthSession();
        
        // Configure redirect URI
        const redirectUri = AuthSession.makeRedirectUri({
          scheme: 'sakhisetu',
          useProxy: false,
        });

        // Google OAuth discovery endpoints
        const discovery = {
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
          revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
        };

        // Use Google OAuth Client ID from Firebase config
        // Make sure to update GOOGLE_OAUTH_CLIENT_ID in config/firebase.js
        const request = new AuthSession.AuthRequest({
          clientId: GOOGLE_OAUTH_CLIENT_ID,
          scopes: ['openid', 'profile', 'email'],
          responseType: AuthSession.ResponseType.Code,
          redirectUri,
          extraParams: {},
          additionalParameters: {},
        });

        const result = await request.promptAsync(discovery, {
          useProxy: false,
        });

        if (result.type === 'success') {
          // Exchange the authorization code for tokens
          const tokenResponse = await AuthSession.exchangeCodeAsync(
            {
              clientId: GOOGLE_OAUTH_CLIENT_ID,
              code: result.params.code,
              redirectUri,
              extraParams: {},
            },
            discovery
          );

          if (tokenResponse.idToken) {
            // Create a credential from the ID token
            const credential = GoogleAuthProvider.credential(tokenResponse.idToken);
            
            // Sign in to Firebase with the credential
            const userCredential = await signInWithCredential(auth, credential);
            
            // Reload to get latest verification status
            await reload(userCredential.user);
            
            // Google accounts are typically already verified
            if (!userCredential.user.emailVerified) {
              setShowVerificationMessage(true);
              showToast('info', 'Email Not Verified', 'Please verify your email address. Check your inbox for the verification email.');
            } else {
              showToast('success', 'Success', 'Signed in with Google successfully!');
            }
          } else {
            throw new Error('Failed to get ID token from Google');
          }
        } else if (result.type === 'cancel') {
          showToast('info', 'Cancelled', 'Google sign-in was cancelled.');
        } else {
          throw new Error('Google sign-in failed');
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Please sign in with your existing method.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Google Sign-In Error:', error);
      showToast('error', 'Google Sign-In Failed', errorMessage);
    }
  };

  return (
    <View style={[
      styles.pageContainer, 
      isDarkMode && { backgroundColor: '#121212' },
      isWeb && styles.pageContainerWeb,
      isWeb && {
        alignItems: 'center',
      }
    ]}>
      {isWeb && (
        <style>{`
          .auth-scroll-container > div {
            scrollbar-width: thin;
            scrollbar-color: ${isDarkMode ? '#555 #1e1e1e' : '#888 #f1f1f1'};
          }
          .auth-scroll-container > div::-webkit-scrollbar {
            width: 8px;
          }
          .auth-scroll-container > div::-webkit-scrollbar-track {
            background: ${isDarkMode ? '#1e1e1e' : '#f1f1f1'};
            border-radius: 4px;
          }
          .auth-scroll-container > div::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? '#555' : '#888'};
            border-radius: 4px;
          }
          .auth-scroll-container > div::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? '#666' : '#555'};
          }
        `}</style>
      )}
      <View style={isWeb && styles.scrollViewWrapper} className={isWeb ? 'auth-scroll-container' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            isDarkMode && { backgroundColor: '#121212' },
            isWeb && styles.containerWeb,
            isWeb && { justifyContent: 'flex-start' },
          ]}
          style={[
            isWeb && styles.scrollViewWeb,
            isWeb && {
              overflowY: 'auto',
              overflowX: 'hidden',
            }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={!isWeb}
        >
        <View style={[
          styles.contentWrapper, 
          isWeb && styles.contentWrapperWeb,
          isWeb && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            borderRadius: 16,
            padding: isWeb ? 24 : 32,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
          }
        ]}>
          <View style={[styles.iconContainer, isWeb && styles.iconContainerWeb]}>
            <View style={styles.iconCircle}>
              <Image 
                source={require('../../assets/images/SakhiSetu_logo.png')} 
                style={[styles.iconImage, isWeb && styles.iconImageWeb]}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Tabs */}
          <View style={[styles.tabContainer, isWeb && styles.tabContainerWeb]}>
            <TouchableOpacity
              onPress={() => {
                setMode('login');
                setShowVerificationMessage(false);
                // Reset touched and submitted states when switching modes
                setLoginTouched({ email: false, password: false });
                setLoginSubmitted(false);
                setLoginErrors({ email: '', password: '' });
              }}
              style={[
                styles.tab, 
                mode === 'login' && styles.activeTabBackground,
                isWeb && styles.tabWeb,
              ]}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>{t('auth.login')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMode('register');
                setShowVerificationMessage(false);
                // Reset touched and submitted states when switching modes
                setRegisterTouched({ name: false, email: false, password: false });
                setRegisterSubmitted(false);
                setRegisterErrors({ name: '', email: '', password: '' });
              }}
              style={[
                styles.tab, 
                mode === 'register' && styles.activeTabBackground,
                isWeb && styles.tabWeb,
              ]}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>{t('auth.register')}</Text>
            </TouchableOpacity>
          </View>

          {/* Forms */}
          {mode === 'login' ? (
            <View style={[styles.form, isWeb && styles.formWeb]}>
              <Text style={[styles.label, isWeb && styles.labelWeb, isDarkMode && { color: '#fff' }]}>{t('auth.email')}</Text>
              <TextInput
                placeholder="name@example.com"
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  (loginTouched.email || loginSubmitted) && loginErrors.email && styles.inputError,
                  isWeb && styles.inputWeb,
                ]}
                value={loginEmail}
                onChangeText={(text) => {
                  setLoginEmail(text);
                  if (loginErrors.email) {
                    setLoginErrors({ ...loginErrors, email: '' });
                  }
                }}
                onBlur={() => {
                  const newTouched = { ...loginTouched, email: true };
                  setLoginTouched(newTouched);
                  // Validate on blur after marking as touched
                  const emailError = validateEmail(loginEmail);
                  setLoginErrors({ ...loginErrors, email: emailError });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {(loginTouched.email || loginSubmitted) && loginErrors.email ? (
                <Text style={styles.errorText}>{loginErrors.email}</Text>
              ) : null}
              <Text style={[styles.label, isWeb && styles.labelWeb, isDarkMode && { color: '#fff' }]}>{t('auth.password')}</Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  (loginTouched.password || loginSubmitted) && loginErrors.password && styles.inputError,
                  isWeb && styles.inputWeb,
                ]}
                value={loginPassword}
                onChangeText={(text) => {
                  setLoginPassword(text);
                  if (loginErrors.password) {
                    setLoginErrors({ ...loginErrors, password: '' });
                  }
                }}
                onBlur={() => {
                  const newTouched = { ...loginTouched, password: true };
                  setLoginTouched(newTouched);
                  // Validate on blur after marking as touched
                  const passwordError = validatePassword(loginPassword, true);
                  setLoginErrors({ ...loginErrors, password: passwordError });
                }}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {(loginTouched.password || loginSubmitted) && loginErrors.password ? (
                <Text style={styles.errorText}>{loginErrors.password}</Text>
              ) : null}
              <TouchableOpacity 
                style={[styles.forgotPassword, isWeb && styles.forgotPasswordWeb]} 
                onPress={handleForgotPassword}
                disabled={isResettingPassword || isLoading}
              >
                {isResettingPassword ? (
                  <View style={styles.forgotPasswordLoading}>
                    <ActivityIndicator size="small" color="#007bff" />
                    <Text style={[styles.forgotPasswordText, { marginLeft: 8 }]}>Sending...</Text>
                  </View>
                ) : (
                  <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
                )}
              </TouchableOpacity>
              
              {/* Email Verification Message for Login */}
              {showVerificationMessage && mode === 'login' && (
                <View style={[styles.verificationBanner, isDarkMode && styles.verificationBannerDark]}>
                  <View style={styles.verificationBannerContent}>
                    <Text style={[styles.verificationBannerText, isDarkMode && { color: '#fff' }]}>
                      Please verify your email address. Check your inbox for the verification email.
                    </Text>
                    <TouchableOpacity 
                      onPress={handleResendVerification}
                      disabled={isSendingVerification}
                      style={styles.resendButton}
                    >
                      {isSendingVerification ? (
                        <ActivityIndicator size="small" color="#007bff" />
                      ) : (
                        <Text style={styles.resendButtonText}>Resend Email</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setShowVerificationMessage(false)}
                      style={styles.closeVerificationButton}
                    >
                      <Text style={styles.closeVerificationText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              <TouchableOpacity 
                onPress={handleLogin} 
                onMouseEnter={() => isWeb && setLoginButtonHover(true)}
                onMouseLeave={() => isWeb && setLoginButtonHover(false)}
                style={[
                  styles.button, 
                  isDarkMode && styles.buttonDark,
                  isWeb && styles.buttonWeb,
                  isWeb && loginButtonHover && {
                    opacity: 0.9,
                    transform: [{ scale: 0.98 }],
                  },
                ]} 
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t('auth.signIn')}</Text>}
              </TouchableOpacity>
              
              {/* Divider */}
              <View style={[styles.dividerContainer, isWeb && styles.dividerContainerWeb]}>
                <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
                <Text style={[styles.dividerText, isDarkMode && { color: '#999' }]}>{t('auth.or')}</Text>
                <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity 
                onPress={handleGoogleSignIn} 
                onMouseEnter={() => isWeb && setLoginGoogleButtonHover(true)}
                onMouseLeave={() => isWeb && setLoginGoogleButtonHover(false)}
                style={[
                  styles.googleButton, 
                  isDarkMode && styles.googleButtonDark,
                  isWeb && styles.googleButtonWeb,
                  isWeb && loginGoogleButtonHover && {
                    opacity: 0.9,
                    transform: [{ scale: 0.98 }],
                    borderColor: isDarkMode ? '#666' : '#c0c0c0',
                  },
                ]} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={isDarkMode ? "#fff" : "#4285F4"} />
                ) : (
                  <>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={[styles.googleButtonText, isDarkMode && { color: '#fff' }]}>
                      {t('auth.signInWithGoogle')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.form, isWeb && styles.formWeb]}>
              <Text style={[styles.label, isWeb && styles.labelWeb, isDarkMode && { color: '#fff' }]}>{t('auth.fullName')}</Text>
              <TextInput
                placeholder="John Doe"
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  (registerTouched.name || registerSubmitted) && registerErrors.name && styles.inputError,
                  isWeb && styles.inputWeb,
                ]}
                value={registerName}
                onChangeText={(text) => {
                  setRegisterName(text);
                  if (registerErrors.name) {
                    setRegisterErrors({ ...registerErrors, name: '' });
                  }
                }}
                onBlur={() => {
                  const newTouched = { ...registerTouched, name: true };
                  setRegisterTouched(newTouched);
                  // Validate on blur after marking as touched
                  const nameError = validateName(registerName);
                  setRegisterErrors({ ...registerErrors, name: nameError });
                }}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {(registerTouched.name || registerSubmitted) && registerErrors.name ? (
                <Text style={styles.errorText}>{registerErrors.name}</Text>
              ) : null}
              <Text style={[styles.label, isWeb && styles.labelWeb, isDarkMode && { color: '#fff' }]}>{t('auth.email')}</Text>
              <TextInput
                placeholder="name@example.com"
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  (registerTouched.email || registerSubmitted) && registerErrors.email && styles.inputError,
                  isWeb && styles.inputWeb,
                ]}
                value={registerEmail}
                onChangeText={(text) => {
                  setRegisterEmail(text);
                  if (registerErrors.email) {
                    setRegisterErrors({ ...registerErrors, email: '' });
                  }
                }}
                onBlur={() => {
                  const newTouched = { ...registerTouched, email: true };
                  setRegisterTouched(newTouched);
                  // Validate on blur after marking as touched
                  const emailError = validateEmail(registerEmail);
                  setRegisterErrors({ ...registerErrors, email: emailError });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {(registerTouched.email || registerSubmitted) && registerErrors.email ? (
                <Text style={styles.errorText}>{registerErrors.email}</Text>
              ) : null}
              <Text style={[styles.label, isWeb && styles.labelWeb, isDarkMode && { color: '#fff' }]}>{t('auth.password')}</Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  (registerTouched.password || registerSubmitted) && registerErrors.password && styles.inputError,
                  isWeb && styles.inputWeb,
                ]}
                value={registerPassword}
                onChangeText={(text) => {
                  setRegisterPassword(text);
                  if (registerErrors.password) {
                    setRegisterErrors({ ...registerErrors, password: '' });
                  }
                }}
                onBlur={() => {
                  const newTouched = { ...registerTouched, password: true };
                  setRegisterTouched(newTouched);
                  // Validate on blur after marking as touched
                  const passwordError = validatePassword(registerPassword, false);
                  setRegisterErrors({ ...registerErrors, password: passwordError });
                }}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {(registerTouched.password || registerSubmitted) && registerErrors.password ? (
                <Text style={styles.errorText}>{registerErrors.password}</Text>
              ) : null}
              {registerPassword && !registerErrors.password && registerPassword.length >= 6 && (
                <Text style={styles.passwordHint}>
                  Password strength: {registerPassword.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])/.test(registerPassword) && /(?=.*\d)/.test(registerPassword) ? 'Strong' : 'Good'}
                </Text>
              )}
              
              {/* Email Verification Message for Registration */}
              {showVerificationMessage && mode === 'register' && (
                <View style={[styles.verificationBanner, isDarkMode && styles.verificationBannerDark]}>
                  <View style={styles.verificationBannerContent}>
                    <Text style={[styles.verificationBannerText, isDarkMode && { color: '#fff' }]}>
                      Verification email sent! Please check your inbox to verify your account.
                    </Text>
                    <TouchableOpacity 
                      onPress={handleResendVerification}
                      disabled={isSendingVerification}
                      style={styles.resendButton}
                    >
                      {isSendingVerification ? (
                        <ActivityIndicator size="small" color="#007bff" />
                      ) : (
                        <Text style={styles.resendButtonText}>Resend Email</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setShowVerificationMessage(false)}
                      style={styles.closeVerificationButton}
                    >
                      <Text style={styles.closeVerificationText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              <TouchableOpacity 
                onPress={handleRegister} 
                onMouseEnter={() => isWeb && setRegisterButtonHover(true)}
                onMouseLeave={() => isWeb && setRegisterButtonHover(false)}
                style={[
                  styles.button, 
                  isDarkMode && styles.buttonDark,
                  isWeb && styles.buttonWeb,
                  isWeb && registerButtonHover && {
                    opacity: 0.9,
                    transform: [{ scale: 0.98 }],
                  },
                ]} 
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create account</Text>}
              </TouchableOpacity>
              
              {/* Divider */}
              <View style={[styles.dividerContainer, isWeb && styles.dividerContainerWeb]}>
                <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
                <Text style={[styles.dividerText, isDarkMode && { color: '#999' }]}>{t('auth.or')}</Text>
                <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity 
                onPress={handleGoogleSignIn} 
                onMouseEnter={() => isWeb && setRegisterGoogleButtonHover(true)}
                onMouseLeave={() => isWeb && setRegisterGoogleButtonHover(false)}
                style={[
                  styles.googleButton, 
                  isDarkMode && styles.googleButtonDark,
                  isWeb && styles.googleButtonWeb,
                  isWeb && registerGoogleButtonHover && {
                    opacity: 0.9,
                    transform: [{ scale: 0.98 }],
                    borderColor: isDarkMode ? '#666' : '#c0c0c0',
                  },
                ]} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={isDarkMode ? "#fff" : "#4285F4"} />
                ) : (
                  <>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={[styles.googleButtonText, isDarkMode && { color: '#fff' }]}>
                      {t('auth.continueWithGoogle')}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        </ScrollView>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageContainerWeb: {
    width: '100%',
    minHeight: '100vh',
  },
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  containerWeb: {
    paddingTop: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: '100%',
    alignItems: 'center',
    flexGrow: 1,
  },
  scrollViewWeb: {
    width: '100%',
    flex: 1,
    height: '100%',
  },
  scrollViewWrapper: {
    width: '100%',
    flex: 1,
    height: '100%',
  },
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  contentWrapperWeb: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  iconContainerWeb: {
    marginBottom: 0,
  },
  iconCircle: {
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 999,
  },
  icon: {
    fontSize: 32,
    color: '#007bff',
  },
  iconImage: {
    width: 120,
    height: 120,
    maxWidth: '100%',
  },
  iconImageWeb: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  tabContainerWeb: {
    marginBottom: 16,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabWeb: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    paddingVertical: 8,
  },
  activeTabBackground: {
    backgroundColor: '#e6f0ff',
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
  labelWeb: {
    marginBottom: 4,
    fontSize: 13,
  },
  form: {
    marginBottom: 30,
  },
  formWeb: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
    fontSize: 16,
  },
  inputWeb: {
    outlineStyle: 'none',
    width: '100%',
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  inputDark: {
    backgroundColor: '#2d2d2d',
    borderColor: '#555',
    color: '#fff',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 16,
    minHeight: 20,
  },
  forgotPasswordWeb: {
    marginBottom: 12,
  },
  forgotPasswordLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#cce0ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#1976d2',
  },
  buttonWeb: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 12,
  },
  buttonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  passwordHint: {
    color: '#28a745',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerContainerWeb: {
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ced4da',
  },
  dividerLineDark: {
    backgroundColor: '#555',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  googleButtonDark: {
    backgroundColor: '#2d2d2d',
    borderColor: '#555',
  },
  googleButtonWeb: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  googleButtonText: {
    color: '#3c4043',
    fontWeight: '500',
    fontSize: 16,
  },
  verificationBanner: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  verificationBannerDark: {
    backgroundColor: '#1e3a5f',
    borderColor: '#1976d2',
  },
  verificationBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  verificationBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#1565c0',
    marginBottom: 8,
    minWidth: '100%',
  },
  resendButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007bff',
    marginRight: 8,
  },
  resendButtonText: {
    color: '#007bff',
    fontSize: 12,
    fontWeight: '600',
  },
  closeVerificationButton: {
    padding: 4,
  },
  closeVerificationText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
});
