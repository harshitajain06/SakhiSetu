import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';

export default function JourneyToUnderstandingScreen() {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const openVideo = (videoId) => {
    setCurrentVideoId(videoId);
    setModalVisible(true);
  };

  const videoLessons = [
    {
      id: 1,
      title: 'What is a Period?',
      description: 'Understanding the basics of menstruation.',
      icon: 'heart',
      duration: '2 min',
      videoId: 'faDgESel4Ng',
      relatedVideos: ['oFf0-311F4E'],
    },
    {
      id: 2,
      title: 'How first periods feel like?',
      description: 'A detailed breakdown of the four phases.',
      icon: 'create',
      duration: '3 min',
      videoId: 'cfROFgkV43E',
      relatedVideos: [],
    },
    {
      id: 3,
      title: 'Period Cramps & Pain Relief',
      description: 'Effective strategies and remedies.',
      icon: 'bandage',
      duration: '4 min',
      videoId: '',
      relatedVideos: [],
    },
    {
      id: 4,
      title: 'What I do when I get my first period',
      description: 'Emotional changes during your cycle.',
      icon: 'chatbubble',
      duration: '3 min',
      videoId: 'ImzxzlPzbRk',
      relatedVideos: [],
    },
    {
      id: 5,
      title: 'Early Signs of Your Period',
      description: 'Recognizing the subtle body signals.',
      icon: 'time',
      duration: '2 min',
      videoId: '',
      relatedVideos: [],
    },
    {
      id: 6,
      title: 'How can I help my friends during their periods?',
      description: 'Supporting others during their menstrual cycle.',
      icon: 'people',
      duration: '3 min',
      videoId: 'gojy9QRRO68',
      relatedVideos: [],
    },
    {
      id: 7,
      title: 'How to maintain hygiene during periods?',
      description: 'Essential hygiene practices.',
      icon: 'water',
      duration: '4 min',
      videoId: 'qFLEIwY-SYE',
      relatedVideos: [],
    },
    {
      id: 8,
      title: 'What are sanitary pads, how to use them and dispose of them?',
      description: 'Complete guide to using sanitary pads.',
      icon: 'shield',
      duration: '5 min',
      videoId: 'J6bZsl1pi_o',
      relatedVideos: [],
    },
  ];

  return (
    <>
      {/* Modal for video player */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>

          {/* YouTube Player */}
          {currentVideoId && (
            <YoutubeIframe
              height={280}
              play={true}
              videoId={currentVideoId}
            />
          )}

          {/* Related Videos */}
          {/* <View style={{ padding: 20 }}>
            <Text style={styles.relatedTitle}>Related Videos</Text>

            {videoLessons
              .filter((v) => v.videoId === currentVideoId)
              .flatMap((v) => v.relatedVideos)
              .map((rv, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.relatedCard}
                  onPress={() => setCurrentVideoId(rv)}
                >
                  <Ionicons name="logo-youtube" size={22} color="#ff0000" />
                  <Text style={styles.relatedText}>Watch related video</Text>
                </TouchableOpacity>
              ))}
          </View> */}
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
          <Text style={styles.headerTitle}>Your Journey to Understanding</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Featured Section */}
        {/* <View style={styles.featuredSection}>
          <View style={styles.videoPlayer}>
            <Ionicons name="play-circle" size={64} color="#fff" />
          </View>
          <Text style={styles.videoTitle}>Understanding Your Menstrual Cycle</Text>
          <Text style={styles.videoDuration}>Duration: 2 min</Text>
        </View> */}

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

  featuredSection: {
    padding: 20,
    alignItems: 'center',
  },

  videoPlayer: {
    width: '100%',
    height: 200,
    backgroundColor: '#8B4513',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },

  videoDuration: { fontSize: 14, color: '#666' },

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

  /* Modal */
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },

  modalCloseBtn: {
    position: 'absolute',
    top: 35,
    right: 20,
    zIndex: 10,
  },

  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },

  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  relatedText: { color: '#fff', marginLeft: 10 },
});
