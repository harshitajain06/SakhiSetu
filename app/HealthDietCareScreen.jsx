import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';

const { height, width } = Dimensions.get("window");

export default function HealthDietCareScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const videoLessons = [
    {
      id: 1,
      title: 'Foods to Eat During Your Period',
      description: 'Nutritious foods that help manage period symptoms.',
      icon: 'restaurant',
      duration: '3 min',
      videoUrl: 'https://www.youtube.com/watch?v=kmWbOC8Fbb0',
      relatedVideos: [
        'https://www.youtube.com/watch?v=kmWbOC8Fbb0',
        'https://www.youtube.com/watch?v=qFLEIwY-SYE'
      ]
    },
    {
      id: 2,
      title: 'Iron-Rich Foods for Menstrual Health',
      description: 'Replenish iron lost during your period naturally.',
      icon: 'leaf',
      duration: '4 min',
      videoUrl: 'https://www.youtube.com/watch?v=faDgESel4Ng',
      relatedVideos: [
        'https://www.youtube.com/watch?v=faDgESel4Ng'
      ]
    },
    {
      id: 3,
      title: 'Managing Period Cravings',
      description: 'Healthy ways to satisfy cravings during your cycle.',
      icon: 'happy',
      duration: '3 min',
      videoUrl: 'https://www.youtube.com/watch?v=cfROFgkV43E',
      relatedVideos: [
        'https://www.youtube.com/watch?v=cfROFgkV43E'
      ]
    },
    {
      id: 4,
      title: 'Hydration During Menstruation',
      description: 'Why staying hydrated is crucial during your period.',
      icon: 'water',
      duration: '2 min',
      videoUrl: 'https://www.youtube.com/watch?v=qFLEIwY-SYE',
      relatedVideos: [
        'https://www.youtube.com/watch?v=qFLEIwY-SYE'
      ]
    },
    {
      id: 5,
      title: 'Foods to Avoid During Your Period',
      description: 'Foods that may worsen cramps and bloating.',
      icon: 'close-circle',
      duration: '3 min',
      videoUrl: 'https://www.youtube.com/watch?v=ImzxzlPzbRk',
      relatedVideos: [
        'https://www.youtube.com/watch?v=ImzxzlPzbRk'
      ]
    },
    {
      id: 6,
      title: 'Meal Planning for Your Cycle',
      description: 'Plan nutritious meals throughout your menstrual cycle.',
      icon: 'calendar',
      duration: '5 min',
      videoUrl: 'https://www.youtube.com/watch?v=gojy9QRRO68',
      relatedVideos: [
        'https://www.youtube.com/watch?v=gojy9QRRO68'
      ]
    },
    {
      id: 7,
      title: 'Supplements for Menstrual Health',
      description: 'Vitamins and minerals that support menstrual wellness.',
      icon: 'flask',
      duration: '4 min',
      videoUrl: 'https://www.youtube.com/watch?v=J6bZsl1pi_o',
      relatedVideos: [
        'https://www.youtube.com/watch?v=J6bZsl1pi_o'
      ]
    },
    {
      id: 8,
      title: 'Self-Care Practices During Periods',
      description: 'Holistic self-care tips for your menstrual cycle.',
      icon: 'spa',
      duration: '4 min',
      videoUrl: 'https://www.youtube.com/watch?v=oFf0-311F4E',
      relatedVideos: [
        'https://www.youtube.com/watch?v=oFf0-311F4E'
      ]
    },
    {
      id: 9,
      title: 'Healthy Snacks for Period Days',
      description: 'Quick and nutritious snack ideas for your period.',
      icon: 'cafe',
      duration: '3 min',
      videoUrl: 'https://www.youtube.com/watch?v=faDgESel4Ng',
      relatedVideos: [
        'https://www.youtube.com/watch?v=faDgESel4Ng'
      ]
    },
    {
      id: 10,
      title: 'Managing Bloating Through Diet',
      description: 'Dietary strategies to reduce period bloating.',
      icon: 'fitness',
      duration: '3 min',
      videoUrl: 'https://www.youtube.com/watch?v=cfROFgkV43E',
      relatedVideos: [
        'https://www.youtube.com/watch?v=cfROFgkV43E'
      ]
    }
  ];

  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const openVideo = (videoUrl) => {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      setCurrentVideoId(videoId);
      setModalVisible(true);
    }
  };

  const handleVideoPress = (video) => {
    if (video.videoUrl) {
      openVideo(video.videoUrl);
    }
  };

  const handleRelatedVideoPress = (url) => {
    openVideo(url);
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
        <Text style={styles.headerTitle}>Health Diet & Care</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Featured Video Section */}
      {/* <View style={styles.featuredSection}>
        <View style={styles.videoPlayerContainer}>
          <View style={styles.videoPlayer}>
            <Ionicons name="play-circle" size={64} color="#fff" />
          </View>
        </View>
        <Text style={styles.videoTitle}>Nutrition for Menstrual Health</Text>
        <Text style={styles.videoDuration}>Duration: 3 min</Text>
      </View> */}

      {/* Lessons List */}
      <View style={styles.lessonsSection}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        {videoLessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonCard}
            onPress={() => lesson.videoUrl && handleVideoPress(lesson)}
            activeOpacity={0.7}
          >
            <View style={styles.lessonIconContainer}>
              <Ionicons name={lesson.icon} size={24} color="#FF9800" />
            </View>
            <View style={styles.lessonContent}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDescription}>{lesson.description}</Text>
            </View>
            <View style={styles.lessonMeta}>
              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
              <Ionicons name="play-circle" size={20} color="#FF9800" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  featuredSection: {
    padding: 20,
    alignItems: 'center',
  },
  videoPlayerContainer: {
    width: '100%',
    marginBottom: 12,
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 14,
    color: '#666',
  },
  lessonsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lessonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  relatedVideosSection: {
    padding: 20,
    paddingTop: 0,
  },
  relatedVideoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  relatedVideoText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
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
});

