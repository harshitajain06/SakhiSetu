import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../contexts/TranslationContext';
import { fetchSavedPosts, toggleForumBookmark } from '../forum/forumApi';

function PostRow({ post, onOpen, onUnsave }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onOpen} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <Text style={styles.title} numberOfLines={1}>
          {post.title || post.contentText || ''}
        </Text>
        <TouchableOpacity onPress={onUnsave} style={styles.unsaveBtn}>
          <Ionicons name="bookmark" size={18} color="#E91E63" />
        </TouchableOpacity>
      </View>

      <Text style={styles.meta} numberOfLines={1}>
        {post.authorDisplayName ?? 'User'} • {(post.channel ?? '').toString()}
      </Text>
      <Text style={styles.body} numberOfLines={2}>
        {post.contentText ?? ''}
      </Text>
    </TouchableOpacity>
  );
}

export default function ForumSavedPostsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const posts = await fetchSavedPosts({ pageSize: 50 });
      setRows(posts);
    } catch (e) {
      Alert.alert(t('common.error') ?? 'Error', e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPost = (postId) => navigation.navigate('ForumPostDetail', { postId });

  const unsave = async (postId) => {
    try {
      await toggleForumBookmark({ postId });
      setRows((prev) => prev.filter((p) => p.id !== postId));
    } catch (e) {
      Alert.alert(t('common.error') ?? 'Error', e?.message ?? String(e));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('community.forumSavedTitle') ?? 'Saved Posts'}</Text>
        <TouchableOpacity onPress={load} style={styles.headerBtn} accessibilityLabel="Refresh saved posts">
          <Ionicons name="reload" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>{t('common.loading') ?? 'Loading...'}</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(x) => x.id}
          renderItem={({ item }) => (
            <PostRow post={item} onOpen={() => openPost(item.id)} onUnsave={() => unsave(item.id)} />
          )}
          contentContainerStyle={{ paddingHorizontal: 18, paddingVertical: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="bookmark-outline" size={28} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>{t('community.forumSavedEmptyTitle') ?? 'No saved posts yet'}</Text>
              <Text style={styles.emptyBody}>
                {t('community.forumSavedEmptyBody') ??
                  'Tap Save on any post to keep it here for later.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 52 : 20,
    paddingBottom: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: { fontWeight: '900', color: '#111827', fontSize: 16 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  loadingText: { marginTop: 10, color: '#6B7280', fontWeight: '700' },
  empty: { marginTop: 40, alignItems: 'center', paddingHorizontal: 30, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  emptyBody: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 18, fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  title: { flex: 1, color: '#111827', fontSize: 14, fontWeight: '900' },
  unsaveBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FCE7F3', alignItems: 'center', justifyContent: 'center' },
  meta: { marginTop: 6, color: '#6B7280', fontWeight: '700', fontSize: 12 },
  body: { marginTop: 8, color: '#374151', fontWeight: '600', lineHeight: 18, fontSize: 13 },
});

