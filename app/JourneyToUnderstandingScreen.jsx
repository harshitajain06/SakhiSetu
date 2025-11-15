import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JourneyToUnderstandingScreen() {
  const navigation = useNavigation();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videoLessons = [
    {
      id: 1,
      title: 'What is a Period?',
      description: 'Understanding the basics of menstruation.',
      icon: 'heart',
      duration: '2 min',
      videoUrl: 'https://www.youtube.com/watch?v=faDgESel4Ng',
      relatedVideos: [
        'https://www.youtube.com/watch?v=faDgESel4Ng',
        'https://www.youtube.com/watch?v=oFf0-311F4E'
      ]
    },
    {
      id: 2,
      title: 'How first periods feel like?',
      description: 'A detailed breakdown of the four phases.',
      icon: 'create',
      duration: '3 min',
      videoUrl: 'https://www.youtube.com/watch?v=cfROFgkV43E',
      relatedVideos: [
        'https://www.youtube.com/watch?v=cfROFgkV43E'
      ]
    },
    {
      id: 3,
      title: 'Period Cramps & Pain Relief',
      description: 'Effective strategies and remedies.',
      icon: 'bandage',
      duration: '4 min',
      videoUrl: '',
      relatedVideos: []
    },
    {
      id: 4,
      title: 'What I do when I get my first period',
      description: 'Emotional changes during your cycle.',
      icon: 'chatbubble',
      duration: '3 min',
      videoUrl: 'https://www.youtube.com/watch?v=ImzxzlPzbRk',
      relatedVideos: [
        'https://www.youtube.com/watch?v=ImzxzlPzbRk'
      ]
    },
    {
      id: 5,
      title: 'Early Signs of Your Period',
      description: 'Recognizing the subtle body signals.',
      icon: 'time',
      duration: '2 min',
      videoUrl: '',
      relatedVideos: []
    },
    {
      id: 6,
      title: 'How can I help my friends during their periods?',
      description: 'Supporting others during their menstrual cycle.',
      icon: 'people',
      duration: '3 min',
      videoUrl: 'https://www.youtube.com/watch?v=gojy9QRRO68',
      relatedVideos: [
        'https://www.youtube.com/watch?v=gojy9QRRO68'
      ]
    },
    {
      id: 7,
      title: 'How to maintain hygiene during periods?',
      description: 'Essential hygiene practices.',
      icon: 'water',
      duration: '4 min',
      videoUrl: 'https://www.youtube.com/watch?v=qFLEIwY-SYE',
      relatedVideos: [
        'https://www.youtube.com/watch?v=qFLEIwY-SYE'
      ]
    },
    {
      id: 8,
      title: 'What are sanitary pads, how to use them and dispose of them?',
      description: 'Complete guide to using sanitary pads.',
      icon: 'shield',
      duration: '5 min',
      videoUrl: 'https://www.youtube.com/watch?v=J6bZsl1pi_o',
      relatedVideos: [
        'https://www.youtube.com/watch?v=J6bZsl1pi_o'
      ]
    }
  ];

  const handleVideoPress = (video) => {
    if (video.videoUrl) {
      Linking.openURL(video.videoUrl);
    }
  };

  const handleRelatedVideoPress = (url) => {
    Linking.openURL(url);
  };

  return (
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
        <View style={styles.placeholder} />
      </View>

      {/* Featured Video Section */}
      <View style={styles.featuredSection}>
        <View style={styles.videoPlayerContainer}>
          <View style={styles.videoPlayer}>
            <Ionicons name="play-circle" size={64} color="#fff" />
          </View>
        </View>
        <Text style={styles.videoTitle}>Understanding Your Menstrual Cycle</Text>
        <Text style={styles.videoDuration}>Duration: 2 min</Text>
      </View>

      {/* Lessons List */}
      <View style={styles.lessonsSection}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        {videoLessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonCard}
            onPress={() => handleVideoPress(lesson)}
            activeOpacity={0.7}
          >
            <View style={styles.lessonIconContainer}>
              <Ionicons name={lesson.icon} size={24} color="#e91e63" />
            </View>
            <View style={styles.lessonContent}>
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

      {/* Related Videos Section */}
      {selectedVideo && selectedVideo.relatedVideos && selectedVideo.relatedVideos.length > 0 && (
        <View style={styles.relatedVideosSection}>
          <Text style={styles.sectionTitle}>Related Videos</Text>
          {selectedVideo.relatedVideos.map((url, index) => (
            <TouchableOpacity
              key={index}
              style={styles.relatedVideoCard}
              onPress={() => handleRelatedVideoPress(url)}
            >
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              <Text style={styles.relatedVideoText} numberOfLines={1}>
                {url}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
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
    backgroundColor: '#8B4513',
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
    backgroundColor: '#fce4ec',
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
});

