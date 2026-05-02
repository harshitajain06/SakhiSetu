import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../contexts/TranslationContext';
import { FORUM_CHANNELS, fetchPostsPage } from '../forum/forumApi';

function formatCount(n) {
  const x = typeof n === 'number' ? n : 0;
  if (x < 1000) return String(x);
  if (x < 1000000) return `${(x / 1000).toFixed(x < 10000 ? 1 : 0)}k`;
  return `${(x / 1000000).toFixed(1)}m`;
}

function PostCard({ post, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {post.channel === FORUM_CHANNELS.menstrual ? 'Menstrual' : 'Maternal'}
          </Text>
        </View>
        <Text style={styles.author}>{post.authorDisplayName ?? 'User'}</Text>
      </View>

      {post.title ? <Text style={styles.title}>{post.title}</Text> : null}
      <Text numberOfLines={3} style={styles.body}>
        {post.contentText ?? ''}
      </Text>

      <View style={styles.cardBottom}>
        <View style={styles.metaItem}>
          <Ionicons name="thumbs-up-outline" size={16} color="#E91E63" />
          <Text style={styles.metaText}>{formatCount(post.likeCount)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color="#6B7280" />
          <Text style={styles.metaText}>{formatCount(post.replyCount)}</Text>
        </View>
        {post.contentImageUrl ? (
          <View style={styles.metaItem}>
            <Ionicons name="image-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>1</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function ForumFeedScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [channel, setChannel] = useState(FORUM_CHANNELS.menstrual);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const channelTabs = useMemo(
    () => [
      { key: FORUM_CHANNELS.menstrual, label: t('community.forumMenstrual') ?? 'Menstrual Health' },
      { key: FORUM_CHANNELS.maternal, label: t('community.forumMaternal') ?? 'Maternal Health' },
    ],
    [t]
  );

  const disclaimer =
    t('community.forumDisclaimer') ??
    'This forum is for informational and community support purposes only. It does not replace professional medical advice.';

  const loadFirstPage = async () => {
    setLoading(true);
    try {
      const res = await fetchPostsPage({ channel, pageSize: 10, cursor: null });
      setRows(res.rows);
      setCursor(res.cursor);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadFirstPage();
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !cursor) return;
    setLoadingMore(true);
    try {
      const res = await fetchPostsPage({ channel, pageSize: 10, cursor });
      if (res.rows?.length) setRows((prev) => [...prev, ...res.rows]);
      setCursor(res.cursor);
    } finally {
      setLoadingMore(false);
    }
  };

  const openCreate = () => navigation.navigate('ForumCreatePost');

  const openPost = (postId) => navigation.navigate('ForumPostDetail', { postId });

  const openSaved = () => navigation.navigate('ForumSavedPosts');

  return (
    <View style={styles.container}>
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
        <Text style={styles.disclaimerText}>{disclaimer}</Text>
      </View>

      <View style={styles.topActionsRow}>
        <TouchableOpacity style={styles.savedBtn} onPress={openSaved} activeOpacity={0.85}>
          <Ionicons name="bookmark-outline" size={16} color="#111827" />
          <Text style={styles.savedBtnText}>{t('community.forumSaved') ?? 'Saved'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.channelRow}>
        {channelTabs.map((x) => (
          <TouchableOpacity
            key={x.key}
            style={[styles.channelPill, channel === x.key && styles.channelPillActive]}
            onPress={() => setChannel(x.key)}
          >
            <Text style={[styles.channelText, channel === x.key && styles.channelTextActive]}>{x.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>{t('common.loading') ?? 'Loading...'}</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} onPress={() => openPost(item.id)} />}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.6}
          onEndReached={loadMore}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 14 }}>
                <ActivityIndicator size="small" color="#E91E63" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>{t('community.forumEmptyTitle') ?? 'No posts yet'}</Text>
              <Text style={styles.emptyBody}>
                {t('community.forumEmptyBody') ?? 'Be the first to ask a question or share an experience.'}
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openCreate} activeOpacity={0.9}>
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.fabText}>{t('community.forumCreate') ?? 'Create'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  disclaimer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclaimerText: {
    flex: 1,
    color: '#374151',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  channelRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingBottom: 10,
    gap: 10,
  },
  topActionsRow: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  },
  savedBtnText: {
    color: '#111827',
    fontWeight: '900',
    fontSize: 12,
  },
  channelPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  channelPillActive: {
    backgroundColor: '#111827',
  },
  channelText: {
    color: '#374151',
    fontWeight: '800',
    fontSize: 12,
  },
  channelTextActive: {
    color: '#fff',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontWeight: '700',
  },
  empty: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#E91E6315',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    color: '#E91E63',
    fontWeight: '900',
    fontSize: 11,
  },
  author: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },
  body: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  cardBottom: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#6B7280',
    fontWeight: '800',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    backgroundColor: '#E91E63',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  fabText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
});

