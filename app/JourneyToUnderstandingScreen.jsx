import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions, Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import YoutubeIframe from 'react-native-youtube-iframe';
import { useTranslation } from '../contexts/TranslationContext';

const { height, width } = Dimensions.get("window");

export default function JourneyToUnderstandingScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const openVideo = (videoId) => {
    setCurrentVideoId(videoId);
    setModalVisible(true);
  };

  const videoLessons = [
    {
      id: 1,
      title: t('journey.video1Title'),
      description: t('journey.video1Desc'),
      icon: 'heart',
      duration: '2 min',
      videoId: 'faDgESel4Ng',
    },
    {
      id: 2,
      title: t('journey.video2Title'),
      description: t('journey.video2Desc'),
      icon: 'create',
      duration: '3 min',
      videoId: 'cfROFgkV43E',
    },
    {
      id: 3,
      title: t('journey.video3Title'),
      description: t('journey.video3Desc'),
      icon: 'bandage',
      duration: '4 min',
      videoId: '',
    },
    {
      id: 4,
      title: t('journey.video4Title'),
      description: t('journey.video4Desc'),
      icon: 'chatbubble',
      duration: '3 min',
      videoId: 'ImzxzlPzbRk',
    },
    {
      id: 5,
      title: t('journey.video5Title'),
      description: t('journey.video5Desc'),
      icon: 'time',
      duration: '2 min',
      videoId: '',
    },
    {
      id: 6,
      title: t('journey.video6Title'),
      description: t('journey.video6Desc'),
      icon: 'people',
      duration: '3 min',
      videoId: 'gojy9QRRO68',
    },
    {
      id: 7,
      title: t('journey.video7Title'),
      description: t('journey.video7Desc'),
      icon: 'water',
      duration: '4 min',
      videoId: 'qFLEIwY-SYE',
    },
    {
      id: 8,
      title: t('journey.video8Title'),
      description: t('journey.video8Desc'),
      icon: 'shield',
      duration: '5 min',
      videoId: 'J6bZsl1pi_o',
    },
  ];

  return (
    <>
      {/* Fullscreen Video Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.fullscreenContainer}>
          
          {/* Close Button */}
          <TouchableOpacity
            style={styles.fullscreenClose}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={34} color="#fff" />
          </TouchableOpacity>

          {/* YouTube Player */}
          {currentVideoId && (
            Platform.OS === 'web' ? (
              <View style={styles.videoContainer}>
                <YoutubeIframe
                  height={height * 0.7 - 40}
                  width={width * 0.5 - 40}
                  play={true}
                  videoId={currentVideoId}
                  webViewStyle={{ backgroundColor: '#000' }}
                />
              </View>
            ) : (
              <YoutubeIframe
                height={height * 0.9}
                width={'100%'}
                play={true}
                videoId={currentVideoId}
                webViewStyle={{ backgroundColor: '#000' }}
              />
            )
          )}
        </View>
      </Modal>

      {/* Main Screen */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('journey.title')}</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Lessons</Text>

          {videoLessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => lesson.videoId && openVideo(lesson.videoId)}
            >
              <View style={styles.lessonIconContainer}>
                <Ionicons name={lesson.icon} size={24} color="#e91e63" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDescription}>{lesson.description}</Text>
              </View>

              <View style={styles.lessonMeta}>
                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                <Ionicons name="play-circle" size={20} color="#e91e63" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },

  backButton: { padding: 4 },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  lessonsSection: { padding: 20 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },

  lessonCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 12,
    elevation: 2,
  },

  lessonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fce4ec',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  lessonTitle: { fontSize: 15, fontWeight: '600', color: '#333' },

  lessonDescription: { fontSize: 13, color: '#666', marginTop: 2 },

  lessonMeta: {
    alignItems: 'center',
    marginLeft: 10,
  },

  lessonDuration: { fontSize: 12, color: '#666', marginRight: 4 },

  /* Fullscreen Modal */
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullscreenClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 30,
  },

  videoContainer: {
    margin: 20,
  },

  videoContainerMobile: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
