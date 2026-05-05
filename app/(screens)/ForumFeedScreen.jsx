import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../contexts/TranslationContext';
import { FORUM_CHANNELS, fetchPostsPage, listenToLatestPosts } from '../forum/forumApi';

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
  const [liveRows, setLiveRows] = useState([]);
  const [liveReady, setLiveReady] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

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

  // Realtime newest posts for the selected channel.
  useEffect(() => {
    setLiveReady(false);
    setLoading(true);
    setLiveRows([]);

    const unsub = listenToLatestPosts({ channel, pageSize: 20 }, (next) => {
      setLiveRows(next ?? []);
      setLiveReady(true);
      setLoading(false);
    });
    return () => unsub?.();
  }, [channel]);

  // Keep pagination cursor in sync with the latest snapshot's last doc.
  // We still use fetchPostsPage for older posts (load more).
  useEffect(() => {
    if (!liveReady) return;
    // Best-effort: cursor should point after the last visible item in the live slice.
    // We fetch a page once to obtain a cursor doc snapshot that matches this feed ordering.
    // This avoids relying on internal snapshot doc references here.
    (async () => {
      try {
        const res = await fetchPostsPage({ channel, pageSize: 20, cursor: null });
        setCursor(res.cursor);
      } catch {
        // ignore
      }
    })();
  }, [channel, liveReady]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Realtime listener keeps data fresh; "refresh" just briefly shows spinner.
      // We also reset the pagination cursor to start loadMore from newest window.
      const res = await fetchPostsPage({ channel, pageSize: 20, cursor: null });
      setCursor(res.cursor);
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

  const mergedRows = useMemo(() => {
    const map = new Map();
    (liveRows ?? []).forEach((p) => map.set(p.id, p));
    (rows ?? []).forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [liveRows, rows]);

  return (
    <View style={styles.container}>
      <View style={styles.topActionsRow}>
        <TouchableOpacity style={styles.infoBtn} onPress={() => setInfoOpen(true)} activeOpacity={0.85}>
          <Ionicons name="information-circle-outline" size={18} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} activeOpacity={0.85} disabled={refreshing}>
          {refreshing ? <ActivityIndicator size="small" color="#111827" /> : <Ionicons name="refresh" size={16} color="#111827" />}
          <Text style={styles.refreshBtnText}>{t('common.refresh') ?? 'Refresh'}</Text>
        </TouchableOpacity>
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
          data={mergedRows}
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

      <Modal visible={infoOpen} transparent animationType="fade" onRequestClose={() => setInfoOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setInfoOpen(false)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('community.forumInfoTitle') ?? 'Forum info'}</Text>
              <TouchableOpacity onPress={() => setInfoOpen(false)} style={styles.modalCloseBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  channelRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingBottom: 10,
    gap: 10,
  },
  topActionsRow: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshBtn: {
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
  refreshBtnText: {
    color: '#111827',
    fontWeight: '900',
    fontSize: 12,
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  modalTitle: {
    flex: 1,
    color: '#111827',
    fontWeight: '900',
    fontSize: 16,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
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

