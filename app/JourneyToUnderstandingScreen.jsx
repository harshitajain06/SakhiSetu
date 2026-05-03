import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions, Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import YoutubeIframe from 'react-native-youtube-iframe';
import { db } from '../config/firebase';
import { useTranslation } from '../contexts/TranslationContext';

const { height, width } = Dimensions.get("window");

export default function JourneyToUnderstandingScreen() {
  const navigation = useNavigation();
  const { t, language } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [videoLessons, setVideoLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const extractVideoId = (lesson = {}) => {
    if (lesson.videoId && typeof lesson.videoId === 'string') {
      return lesson.videoId.trim();
    }

    const url = lesson.videoUrl || lesson.url || lesson.link;
    if (!url || typeof url !== 'string') {
      return null;
    }

    const cleanedUrl = url.trim();
    const match = cleanedUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const getLessonLanguage = (lesson = {}) => {
    const lang = String(lesson.language || lesson.lang || '').toLowerCase().trim();

    if (lang.startsWith('hi') || lang.includes('hindi')) {
      return 'hi';
    }

    if (lang.startsWith('en') || lang.includes('english')) {
      return 'en';
    }

    const text = `${lesson.title || ''} ${lesson.description || ''}`;
    const hasHindiScript = /[\u0900-\u097F]/.test(text);
    return hasHindiScript ? 'hi' : 'en';
  };

  const openVideo = (videoId) => {
    setCurrentVideoId(videoId);
    setModalVisible(true);
  };

  // Fetch videos from Firebase
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videosCollectionRef = collection(db, 'journeyVideos');
      const q = query(videosCollectionRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const videos = [];
      querySnapshot.forEach((doc) => {
        const lesson = { id: doc.id, ...doc.data() };
        videos.push({
          ...lesson,
          resolvedVideoId: extractVideoId(lesson),
          resolvedLanguage: getLessonLanguage(lesson),
        });
      });
      
      setVideoLessons(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Fallback to empty array on error
      setVideoLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const englishLessons = videoLessons.filter((lesson) => lesson.resolvedLanguage === 'en');
  const hindiLessons = videoLessons.filter((lesson) => lesson.resolvedLanguage === 'hi');
  const selectedLanguage = language === 'hi' ? 'hi' : 'en';
  const selectedLessons = selectedLanguage === 'hi' ? hindiLessons : englishLessons;

  const renderLessons = (lessons, emptyText) => {
    if (lessons.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="videocam-off" size={36} color="#ccc" />
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      );
    }

    return lessons.map((lesson) => (
      <TouchableOpacity
        key={lesson.id}
        style={styles.lessonCard}
        onPress={() => lesson.resolvedVideoId && openVideo(lesson.resolvedVideoId)}
      >
        <View style={styles.lessonIconContainer}>
          <Ionicons name={lesson.icon || 'play-circle'} size={24} color="#e91e63" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.lessonTitle}>{lesson.title || 'Untitled Video'}</Text>
          <Text style={styles.lessonDescription}>{lesson.description || ''}</Text>
        </View>

        <View style={styles.lessonMeta}>
          <Text style={styles.lessonDuration}>{lesson.duration || ''}</Text>
          {lesson.resolvedVideoId && (
            <Ionicons name="play-circle" size={20} color="#e91e63" />
          )}
        </View>
      </TouchableOpacity>
    ));
  };

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

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#e91e63" />
              <Text style={styles.loadingText}>Loading videos...</Text>
            </View>
          ) : videoLessons.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="videocam-off" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No videos available</Text>
            </View>
          ) : (
            <>
              <View style={styles.languageHeaderRow}>
                <Text style={styles.languageSectionTitle}>
                  {selectedLanguage === 'hi' ? 'Hindi Lessons' : 'English Lessons'}
                </Text>
                <Text style={styles.currentLanguageHint}>Current app language</Text>
              </View>
              {renderLessons(
                selectedLessons,
                selectedLanguage === 'hi' ? 'No Hindi videos available' : 'No English videos available'
              )}
            </>
          )}
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

  languageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 8,
  },

  languageSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },

  currentLanguageHint: {
    fontSize: 12,
    color: '#e91e63',
    fontWeight: '600',
  },

  languageDivider: {
    height: 1,
    backgroundColor: '#efefef',
    marginVertical: 16,
  },

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

  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
});
