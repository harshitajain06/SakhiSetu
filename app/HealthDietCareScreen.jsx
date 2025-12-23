import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';

const { height } = Dimensions.get("window");

export default function HealthDietCareScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    {
      id: 1,
      title: t('healthDietCare.video1Title'),
      description: t('healthDietCare.video1Desc'),
      icon: 'restaurant',
      contentKey: 'video1Content'
    },
    {
      id: 2,
      title: t('healthDietCare.video2Title'),
      description: t('healthDietCare.video2Desc'),
      icon: 'leaf',
      contentKey: 'video2Content'
    },
    {
      id: 3,
      title: t('healthDietCare.video3Title'),
      description: t('healthDietCare.video3Desc'),
      icon: 'happy',
      contentKey: 'video3Content'
    },
    {
      id: 4,
      title: t('healthDietCare.video4Title'),
      description: t('healthDietCare.video4Desc'),
      icon: 'water',
      contentKey: 'video4Content'
    },
    {
      id: 5,
      title: t('healthDietCare.video5Title'),
      description: t('healthDietCare.video5Desc'),
      icon: 'close-circle',
      contentKey: 'video5Content'
    },
    {
      id: 6,
      title: t('healthDietCare.video6Title'),
      description: t('healthDietCare.video6Desc'),
      icon: 'calendar',
      contentKey: 'video6Content'
    },
    {
      id: 7,
      title: t('healthDietCare.video7Title'),
      description: t('healthDietCare.video7Desc'),
      icon: 'flask',
      contentKey: 'video7Content'
    },
    {
      id: 8,
      title: t('healthDietCare.video8Title'),
      description: t('healthDietCare.video8Desc'),
      icon: 'spa',
      contentKey: 'video8Content'
    },
    {
      id: 9,
      title: t('healthDietCare.video9Title'),
      description: t('healthDietCare.video9Desc'),
      icon: 'cafe',
      contentKey: 'video9Content'
    },
    {
      id: 10,
      title: t('healthDietCare.video10Title'),
      description: t('healthDietCare.video10Desc'),
      icon: 'fitness',
      contentKey: 'video10Content'
    }
  ];

  const handleTopicPress = (topic) => {
    setSelectedTopic(topic);
    setModalVisible(true);
  };

  const getContent = (contentKey) => {
    return t(`healthDietCare.${contentKey}`) || '';
  };

  const renderFormattedContent = (text) => {
    if (!text) return null;

    // Split by double newlines to get paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      // Split paragraph into lines
      const lines = paragraph.split('\n');
      
      return (
        <View key={paragraphIndex} style={{ marginBottom: paragraphIndex < paragraphs.length - 1 ? 16 : 0 }}>
          {lines.map((line, lineIndex) => {
            // Check if line is a heading (ends with colon and is not a bullet point)
            const isHeading = line.trim().endsWith(':') && !line.trim().startsWith('•') && line.trim().length > 0;
            // Check if line is a bullet point
            const isBullet = line.trim().startsWith('•');
            
            if (isHeading) {
              return (
                <Text key={lineIndex} style={[styles.contentText, styles.boldHeading]}>
                  {line}
                  {lineIndex < lines.length - 1 ? '\n' : ''}
                </Text>
              );
            } else if (isBullet) {
              return (
                <Text key={lineIndex} style={styles.contentText}>
                  {line}
                  {lineIndex < lines.length - 1 ? '\n' : ''}
                </Text>
              );
            } else {
              return (
                <Text key={lineIndex} style={styles.contentText}>
                  {line}
                  {lineIndex < lines.length - 1 ? '\n' : ''}
                </Text>
              );
            }
          })}
        </View>
      );
    });
  };

  return (
    <>
      {/* Content Modal */}
      <Modal 
        visible={modalVisible} 
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedTopic?.title || ''}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalBody}
              showsVerticalScrollIndicator={true}
            >
              {selectedTopic && (
                <View>
                  {renderFormattedContent(getContent(selectedTopic.contentKey))}
                </View>
              )}
            </ScrollView>
          </View>
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
        <Text style={styles.headerTitle}>{t('menstrual.healthDietCare')}</Text>
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

      {/* Topics List */}
      <View style={styles.lessonsSection}>
        <Text style={styles.sectionTitle}>{t('healthDietCare.lessons')}</Text>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.lessonCard}
            onPress={() => handleTopicPress(topic)}
            activeOpacity={0.7}
          >
            <View style={styles.lessonIconContainer}>
              <Ionicons name={topic.icon} size={24} color="#FF9800" />
            </View>
            <View style={styles.lessonContent}>
              <Text style={styles.lessonTitle}>{topic.title}</Text>
              <Text style={styles.lessonDescription}>{topic.description}</Text>
            </View>
            <View style={styles.lessonMeta}>
              <Ionicons name="document-text" size={20} color="#FF9800" />
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
  /* Content Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  boldHeading: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
});

