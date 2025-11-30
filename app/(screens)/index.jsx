import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, GoogleAuthProvider, reload, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, updateProfile } from 'firebase/auth';
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
import { auth } from '../../config/firebase';
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
      }
    };
    
    if (user) {
      checkUserVerification();
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
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      if (isWeb) {
        // Web: Use signInWithPopup
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
      } else {
        // Native: Use signInWithRedirect which works better for mobile
        // The redirect will be handled by the app's deep linking
        await signInWithRedirect(auth, provider);
        // Note: signInWithRedirect doesn't return immediately
        // The user will be redirected to Google sign-in and back
        showToast('info', 'Redirecting', 'Opening Google sign-in...');
        // Don't set loading to false here as the redirect will handle it
        return;
      }
      setIsLoading(false);
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
      
      showToast('error', 'Google Sign-In Failed', errorMessage);
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
              <Image 
                source={require('../../assets/images/SakhiSetu_logo.png')} 
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>
            {t('auth.welcome')}
          </Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => {
                setMode('login');
                setShowVerificationMessage(false);
              }}
              style={[styles.tab, mode === 'login' && styles.activeTabBackground]}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>{t('auth.login')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMode('register');
                setShowVerificationMessage(false);
              }}
              style={[styles.tab, mode === 'register' && styles.activeTabBackground]}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>{t('auth.register')}</Text>
            </TouchableOpacity>
          </View>

          {/* Forms */}
          {mode === 'login' ? (
            <View style={styles.form}>
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>{t('auth.email')}</Text>
              <TextInput
                placeholder="name@example.com"
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  loginErrors.email && styles.inputError
                ]}
                value={loginEmail}
                onChangeText={(text) => {
                  setLoginEmail(text);
                  if (loginErrors.email) {
                    setLoginErrors({ ...loginErrors, email: '' });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {loginErrors.email ? (
                <Text style={styles.errorText}>{loginErrors.email}</Text>
              ) : null}
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>{t('auth.password')}</Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  loginErrors.password && styles.inputError
                ]}
                value={loginPassword}
                onChangeText={(text) => {
                  setLoginPassword(text);
                  if (loginErrors.password) {
                    setLoginErrors({ ...loginErrors, password: '' });
                  }
                }}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {loginErrors.password ? (
                <Text style={styles.errorText}>{loginErrors.password}</Text>
              ) : null}
              <TouchableOpacity 
                style={styles.forgotPassword} 
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
              
              <TouchableOpacity onPress={handleLogin} style={[styles.button, isDarkMode && styles.buttonDark]} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t('auth.signIn')}</Text>}
              </TouchableOpacity>
              
              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
                <Text style={[styles.dividerText, isDarkMode && { color: '#999' }]}>{t('auth.or')}</Text>
                <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity 
                onPress={handleGoogleSignIn} 
                style={[styles.googleButton, isDarkMode && styles.googleButtonDark]} 
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
            <View style={styles.form}>
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>{t('auth.fullName')}</Text>
              <TextInput
                placeholder="John Doe"
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  registerErrors.name && styles.inputError
                ]}
                value={registerName}
                onChangeText={(text) => {
                  setRegisterName(text);
                  if (registerErrors.name) {
                    setRegisterErrors({ ...registerErrors, name: '' });
                  }
                }}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {registerErrors.name ? (
                <Text style={styles.errorText}>{registerErrors.name}</Text>
              ) : null}
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>{t('auth.email')}</Text>
              <TextInput
                placeholder="name@example.com"
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  registerErrors.email && styles.inputError
                ]}
                value={registerEmail}
                onChangeText={(text) => {
                  setRegisterEmail(text);
                  if (registerErrors.email) {
                    setRegisterErrors({ ...registerErrors, email: '' });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {registerErrors.email ? (
                <Text style={styles.errorText}>{registerErrors.email}</Text>
              ) : null}
              <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>{t('auth.password')}</Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                  registerErrors.password && styles.inputError
                ]}
                value={registerPassword}
                onChangeText={(text) => {
                  setRegisterPassword(text);
                  if (registerErrors.password) {
                    setRegisterErrors({ ...registerErrors, password: '' });
                  }
                }}
                placeholderTextColor={isDarkMode ? '#999' : '#6c757d'}
              />
              {registerErrors.password ? (
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
              
              <TouchableOpacity onPress={handleRegister} style={[styles.button, isDarkMode && styles.buttonDark]} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create account</Text>}
              </TouchableOpacity>
              
              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
                <Text style={[styles.dividerText, isDarkMode && { color: '#999' }]}>{t('auth.or')}</Text>
                <View style={[styles.dividerLine, isDarkMode && styles.dividerLineDark]} />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity 
                onPress={handleGoogleSignIn} 
                style={[styles.googleButton, isDarkMode && styles.googleButtonDark]} 
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

          <TouchableOpacity>
            <Text style={[styles.privacyPolicy, isDarkMode && { color: '#64b5f6' }]}>Privacy Policy.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
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
  iconImage: {
    width: 80,
    height: 80,
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
    minHeight: 20,
    ...(isWeb && {
      cursor: 'pointer',
    }),
  },
  forgotPasswordLoading: {
    flexDirection: 'row',
    alignItems: 'center',
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
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  googleButtonDark: {
    backgroundColor: '#2d2d2d',
    borderColor: '#555',
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
    ...(isWeb && {
      cursor: 'pointer',
    }),
  },
  resendButtonText: {
    color: '#007bff',
    fontSize: 12,
    fontWeight: '600',
  },
  closeVerificationButton: {
    padding: 4,
    ...(isWeb && {
      cursor: 'pointer',
    }),
  },
  closeVerificationText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
});
