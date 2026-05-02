import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from '../../contexts/TranslationContext';
import ForumFeedScreen from './ForumFeedScreen';
import ForumCreatePostScreen from './ForumCreatePostScreen';
import ForumPostDetailScreen from './ForumPostDetailScreen';
import ForumSavedPostsScreen from './ForumSavedPostsScreen';

import CommunityResourcesScreen from './CommunityResourcesScreen';

const Stack = createStackNavigator();

function CommunityHome({ route }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(route?.params?.tab ?? 'forum');

  useEffect(() => {
    if (route?.params?.tab) {
      setTab(route.params.tab);
    }
  }, [route?.params?.tab]);

  const tabs = useMemo(
    () => [
      { key: 'forum', label: t('community.forumTab') ?? 'Forum' },
      { key: 'resources', label: t('community.resourcesTab') ?? 'Resources' },
    ],
    [t]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{t('community.title')}</Text>
        <Text style={styles.subHeading}>{t('community.subtitle')}</Text>
      </View>

      <View style={styles.tabRow}>
        {tabs.map((x) => (
          <TouchableOpacity
            key={x.key}
            onPress={() => setTab(x.key)}
            style={[styles.tabPill, tab === x.key && styles.tabPillActive]}
          >
            <Text style={[styles.tabText, tab === x.key && styles.tabTextActive]}>{x.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {tab === 'forum' ? <ForumFeedScreen /> : <CommunityResourcesScreen />}
      </View>
    </View>
  );
}

export default function CommunityScreen({ route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="CommunityHome"
        component={CommunityHome}
        initialParams={{ tab: route?.params?.tab ?? 'forum' }}
      />
      <Stack.Screen name="ForumCreatePost" component={ForumCreatePostScreen} />
      <Stack.Screen name="ForumPostDetail" component={ForumPostDetailScreen} />
      <Stack.Screen name="ForumSavedPosts" component={ForumSavedPostsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subHeading: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 10,
    paddingBottom: 12,
  },
  tabPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
  },
  tabPillActive: {
    backgroundColor: '#E91E63',
  },
  tabText: {
    color: '#374151',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});
