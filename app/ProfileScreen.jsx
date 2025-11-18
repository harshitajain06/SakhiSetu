import { Ionicons } from '@expo/vector-icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ProfileScreen({ visible, onClose }) {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    sex: '',
  });

  useEffect(() => {
    if (visible && user) {
      loadProfile();
    }
  }, [visible, user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileData({
          name: data.name || '',
          age: data.age || '',
          sex: data.sex || '',
        });
        // If profile exists, don't auto-edit
        setIsEditing(false);
      } else {
        // If profile doesn't exist, show edit mode
        setProfileData({
          name: user.displayName || '',
          age: '',
          sex: '',
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!profileData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!profileData.age.trim()) {
      Alert.alert('Error', 'Please enter your age');
      return;
    }
    if (!profileData.sex.trim()) {
      Alert.alert('Error', 'Please select your sex');
      return;
    }

    const ageNum = parseInt(profileData.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }

    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name: profileData.name.trim(),
        age: profileData.age.trim(),
        sex: profileData.sex.trim(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    loadProfile(); // Reload original data
    setIsEditing(false);
  };

  const hasProfileData = profileData.name || profileData.age || profileData.sex;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#e91e63" />
            </View>
          ) : (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {!hasProfileData && !isEditing ? (
                <View style={styles.emptyState}>
                  <Ionicons name="person-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyStateText}>No profile information yet</Text>
                  {user?.email && (
                    <View style={styles.emailDisplay}>
                      <Ionicons name="mail-outline" size={16} color="#666" />
                      <Text style={styles.emailText}>{user.email}</Text>
                    </View>
                  )}
                  <Text style={styles.emptyStateSubtext}>
                    Please add your profile details to get started
                  </Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEdit}
                  >
                    <Text style={styles.editButtonText}>Add Profile Information</Text>
                  </TouchableOpacity>
                </View>
              ) : isEditing ? (
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your name"
                      value={profileData.name}
                      onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your age"
                      value={profileData.age}
                      onChangeText={(text) => setProfileData({ ...profileData, age: text })}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sex</Text>
                    <View style={styles.sexOptions}>
                      {['Female', 'Male', 'Other'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.sexOption,
                            profileData.sex === option && styles.sexOptionSelected,
                          ]}
                          onPress={() => setProfileData({ ...profileData, sex: option })}
                        >
                          <Text
                            style={[
                              styles.sexOptionText,
                              profileData.sex === option && styles.sexOptionTextSelected,
                            ]}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleCancel}
                      disabled={isLoading}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.saveButton]}
                      onPress={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.profileView}>
                  <View style={styles.profileHeader}>
                    <View style={styles.profileAvatar}>
                      <Ionicons name="person" size={40} color="#fff" />
                    </View>
                    <Text style={styles.profileName}>{profileData.name}</Text>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Ionicons name="mail-outline" size={20} color="#666" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Email</Text>
                        <Text style={styles.detailValue}>{user?.email || 'N/A'}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={20} color="#666" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Name</Text>
                        <Text style={styles.detailValue}>{profileData.name}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={20} color="#666" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Age</Text>
                        <Text style={styles.detailValue}>{profileData.age} years</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="people-outline" size={20} color="#666" />
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Sex</Text>
                        <Text style={styles.detailValue}>{profileData.sex}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEdit}
                  >
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 300,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emailDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sexOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  sexOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sexOptionSelected: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
  },
  sexOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sexOptionTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#e91e63',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileView: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

