import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getOpenAIApiKey, OPENAI_API_URL, SYSTEM_PROMPT } from '../../config/openai';
import { useTranslation } from '../../contexts/TranslationContext';

export default function ChatScreen({ onClose }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t('chat.initialMessage'),
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Fetch API key from Firebase
      const apiKey = await getOpenAIApiKey();
      
      if (!apiKey) {
        throw new Error('OpenAI API key not configured. Please add your API key in Firebase Console (appConfig/openai collection).');
      }

      // Prepare messages for API (include system prompt and conversation history)
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
        { role: 'user', content: userMessage.text },
      ];

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.choices[0].message.content.trim(),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = t('chat.connectionError');
      
      if (error.response) {
        // API error response
        if (error.response.status === 401) {
          errorMessage = t('chat.apiKeyInvalid');
        } else if (error.response.status === 429) {
          errorMessage = t('chat.tooManyRequests');
        } else {
          errorMessage = `${t('chat.error')}: ${error.response.data?.error?.message || t('chat.somethingWentWrong')}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      const errorBotMessage = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#E91E63" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Health Assistant</Text>
              <Text style={styles.headerSubtitle}>Ask about menstrual & maternal health</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userMessage : styles.botMessage,
                  message.isError && styles.errorMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingWrapper}>
              <View style={styles.botMessage}>
                <ActivityIndicator size="small" color="#E91E63" />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('chat.typeQuestion')}
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E91E6315',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#E91E63',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorMessage: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

