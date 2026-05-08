import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../contexts/TranslationContext';
import ForumFeedScreen from './ForumFeedScreen';
import ForumCreatePostScreen from './ForumCreatePostScreen';
import ForumPostDetailScreen from './ForumPostDetailScreen';
import ForumSavedPostsScreen from './ForumSavedPostsScreen';

import CommunityResourcesScreen from './CommunityResourcesScreen';

const Stack = createStackNavigator();

function CommunityHome({ route, navigation }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(route?.params?.tab ?? 'forum');
  const [headerRefreshing, setHeaderRefreshing] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const forumRef = useRef(null);

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

  const disclaimer =
    t('community.forumDisclaimer') ??
    'This forum is for informational and community support purposes only. It does not replace professional medical advice.';

  const openSaved = () => navigation.navigate('ForumSavedPosts');

  const onHeaderRefresh = async () => {
    if (tab !== 'forum') return;
    setHeaderRefreshing(true);
    try {
      await forumRef.current?.refresh?.();
    } finally {
      setHeaderRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.heading}>{t('community.title')}</Text>
          <TouchableOpacity
            style={[styles.headerIconBtn, tab !== 'forum' && styles.headerIconBtnDisabled]}
            onPress={onHeaderRefresh}
            activeOpacity={0.85}
            disabled={tab !== 'forum' || headerRefreshing}
          >
            {headerRefreshing ? (
              <ActivityIndicator size="small" color="#111827" />
            ) : (
              <Ionicons name="refresh" size={18} color={tab === 'forum' ? '#111827' : '#9CA3AF'} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeading}>{t('community.subtitle')}</Text>
      </View>

      <View style={styles.tabRow}>
        <View style={styles.tabsLeft}>
          {tabs.map((x) => (
            <TouchableOpacity
              key={x.key}
              onPress={() => setTab(x.key)}
              style={[styles.tabPill, tab === x.key && styles.tabPillActive, x.key === 'forum' && styles.forumTabPill]}
              activeOpacity={0.9}
            >
              <Text style={[styles.tabText, tab === x.key && styles.tabTextActive]}>{x.label}</Text>
              {x.key === 'forum' ? (
                <TouchableOpacity
                  style={[styles.forumInfoIcon, tab === x.key && styles.forumInfoIconActive]}
                  onPress={() => setInfoOpen(true)}
                  activeOpacity={0.85}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="information-circle-outline" size={16} color={tab === x.key ? '#fff' : '#111827'} />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.savedBtn, tab !== 'forum' && styles.savedBtnDisabled]}
          onPress={openSaved}
          activeOpacity={0.85}
          disabled={tab !== 'forum'}
        >
          <Ionicons name="bookmark-outline" size={16} color={tab === 'forum' ? '#111827' : '#9CA3AF'} />
          <Text style={[styles.savedBtnText, tab !== 'forum' && styles.savedBtnTextDisabled]}>
            {t('community.forumSaved') ?? 'Saved'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === 'forum' ? <ForumFeedScreen ref={forumRef} /> : <CommunityResourcesScreen />}
      </View>

      <Modal visible={infoOpen} transparent animationType="fade" onRequestClose={() => setInfoOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setInfoOpen(false)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={() => {}}>
            <Text style={styles.modalBody}>{disclaimer}</Text>
            <TouchableOpacity style={styles.modalOkBtn} onPress={() => setInfoOpen(false)} activeOpacity={0.9}>
              <Text style={styles.modalOkText}>{t('common.ok') ?? 'OK'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtnDisabled: {
    backgroundColor: '#F3F4F6',
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabsLeft: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  tabPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
  },
  forumTabPill: {
    paddingRight: 36,
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
  forumInfoIcon: {
    position: 'absolute',
    right: 10,
    top: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  forumInfoIconActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  savedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginLeft: 10,
  },
  savedBtnDisabled: {
    backgroundColor: '#F3F4F6',
  },
  savedBtnText: {
    color: '#111827',
    fontWeight: '900',
    fontSize: 12,
  },
  savedBtnTextDisabled: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    padding: 18,
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalBody: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  modalOkBtn: {
    marginTop: 14,
    alignSelf: 'flex-end',
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalOkText: {
    color: '#fff',
    fontWeight: '900',
  },
});
