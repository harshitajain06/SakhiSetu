import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../contexts/TranslationContext';
import { createForumReply, fetchReplies, listenToBookmark, listenToLike, listenToPost, reportForumPost, toggleForumBookmark, toggleForumLike } from '../forum/forumApi';

function formatTime(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
    if (!d) return '';
    return d.toLocaleString();
  } catch {
    return '';
  }
}

function ReplyItem({ item }) {
  return (
    <View style={styles.reply}>
      <View style={styles.replyTop}>
        <Text style={styles.replyAuthor}>{item.authorDisplayName ?? 'User'}</Text>
        <Text style={styles.replyTime}>{formatTime(item.createdAt)}</Text>
      </View>
      <Text style={styles.replyText}>{item.replyText ?? ''}</Text>
    </View>
  );
}

export default function ForumPostDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route?.params?.postId;

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);

  const disclaimer =
    t('community.forumDisclaimer') ??
    'This forum is for informational and community support purposes only. It does not replace professional medical advice.';

  useEffect(() => {
    if (!postId) return;
    setLoadingPost(true);
    const unsub = listenToPost(postId, (p) => {
      setPost(p);
      setLoadingPost(false);
    });
    return () => unsub?.();
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    const unsub = listenToBookmark(postId, (saved) => setIsSaved(Boolean(saved)));
    return () => unsub?.();
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    const unsub = listenToLike(postId, (liked) => setIsLiked(Boolean(liked)));
    return () => unsub?.();
  }, [postId]);

  const reloadReplies = async () => {
    if (!postId) return;
    setLoadingReplies(true);
    try {
      const rows = await fetchReplies(postId);
      setReplies(rows);
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    reloadReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const onSendReply = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      await createForumReply({ postId, replyText: replyText.trim() });
      setReplyText('');
      await reloadReplies();
    } catch (e) {
      Alert.alert(t('common.error') ?? 'Error', e?.message ?? String(e));
    } finally {
      setSending(false);
    }
  };

  const onLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      await toggleForumLike({ postId });
    } catch (e) {
      Alert.alert(t('common.error') ?? 'Error', e?.message ?? String(e));
    } finally {
      setLikeBusy(false);
    }
  };

  const onBookmark = async () => {
    if (bookmarkBusy) return;
    setBookmarkBusy(true);
    try {
      await toggleForumBookmark({ postId });
    } catch (e) {
      Alert.alert(t('common.error') ?? 'Error', e?.message ?? String(e));
    } finally {
      setBookmarkBusy(false);
    }
  };

  const onReport = async () => {
    Alert.alert(
      t('community.forumReportTitle') ?? 'Report',
      t('community.forumReportBody') ?? 'Report this post for review?',
      [
        { text: t('common.cancel') ?? 'Cancel', style: 'cancel' },
        {
          text: t('community.forumReportCta') ?? 'Report',
          style: 'destructive',
          onPress: async () => {
            try {
              await reportForumPost({ postId, reason: 'user_report' });
              Alert.alert(t('common.ok') ?? 'OK', t('community.forumReported') ?? 'Reported. Thanks for helping keep the community safe.');
            } catch (e) {
              Alert.alert(t('common.error') ?? 'Error', e?.message ?? String(e));
            }
          },
        },
      ]
    );
  };

  const header = loadingPost ? (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#E91E63" />
    </View>
  ) : !post ? (
    <View style={styles.loading}>
      <Text style={{ color: '#6B7280', fontWeight: '800' }}>
        {t('community.forumPostMissing') ?? 'Post not found.'}
      </Text>
    </View>
  ) : (
    <View>
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
        <Text style={styles.disclaimerText}>{disclaimer}</Text>
      </View>

      <View style={styles.postCard}>
        <View style={styles.postTop}>
          <Text style={styles.postAuthor}>{post.authorDisplayName ?? 'User'}</Text>
          <Text style={styles.postTime}>{formatTime(post.createdAt)}</Text>
        </View>
        {post.title ? <Text style={styles.postTitle}>{post.title}</Text> : null}
        <Text style={styles.postBody}>{post.contentText ?? ''}</Text>
        {post.contentImageUrl ? <Image source={{ uri: post.contentImageUrl }} style={styles.postImage} /> : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, isLiked && styles.actionLiked]}
            onPress={onLike}
            disabled={likeBusy}
          >
            {likeBusy ? (
              <ActivityIndicator size="small" color={isLiked ? '#fff' : '#111827'} />
            ) : (
              <Ionicons
                name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
                size={18}
                color={isLiked ? '#fff' : '#111827'}
              />
            )}
            <Text style={[styles.actionText, isLiked && styles.actionTextLiked]}>{post.likeCount ?? 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, isSaved && styles.actionSaved]}
            onPress={onBookmark}
            disabled={bookmarkBusy}
          >
            {bookmarkBusy ? (
              <ActivityIndicator size="small" color={isSaved ? '#fff' : '#111827'} />
            ) : (
              <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? '#fff' : '#111827'} />
            )}
            <Text style={[styles.actionText, isSaved && styles.actionTextSaved]}>
              {isSaved ? t('community.forumSaved') ?? 'Saved' : t('community.forumSave') ?? 'Save'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionDanger]} onPress={onReport}>
            <Ionicons name="flag-outline" size={18} color="#DC2626" />
            <Text style={[styles.actionText, { color: '#DC2626' }]}>{t('community.forumReport') ?? 'Report'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.repliesTitle}>
        {t('community.forumReplies') ?? 'Replies'} ({replies.length})
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('community.forumPost') ?? 'Post'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={replies}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => <ReplyItem item={item} />}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        ListEmptyComponent={
          loadingReplies ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator size="small" color="#E91E63" />
            </View>
          ) : (
            <View style={styles.emptyReplies}>
              <Text style={styles.emptyRepliesText}>
                {t('community.forumNoReplies') ?? 'No replies yet. Be kind and supportive.'}
              </Text>
            </View>
          )
        }
      />

      <View style={styles.replyBox}>
        <TextInput
          value={replyText}
          onChangeText={setReplyText}
          placeholder={t('community.forumReplyPlaceholder') ?? 'Write a reply...'}
          placeholderTextColor="#9CA3AF"
          style={styles.replyInput}
          multiline
          maxLength={700}
        />
        <TouchableOpacity style={[styles.sendBtn, (!replyText.trim() || sending) && { opacity: 0.5 }]} onPress={onSendReply} disabled={!replyText.trim() || sending}>
          {sending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
        </TouchableOpacity>
      </View>
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
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#F3F4F6' },
  headerTitle: { fontWeight: '900', color: '#111827', fontSize: 16 },
  loading: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  disclaimer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 14,
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclaimerText: { flex: 1, color: '#374151', fontSize: 12, lineHeight: 16, fontWeight: '600' },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  postTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  postAuthor: { color: '#111827', fontWeight: '900' },
  postTime: { color: '#6B7280', fontSize: 12, fontWeight: '700' },
  postTitle: { marginTop: 10, color: '#111827', fontSize: 16, fontWeight: '900' },
  postBody: { marginTop: 8, color: '#374151', fontSize: 14, lineHeight: 20, fontWeight: '600' },
  postImage: { marginTop: 12, width: '100%', height: 220, borderRadius: 14, backgroundColor: '#F3F4F6' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F3F4F6' },
  actionDanger: { backgroundColor: '#FEE2E2' },
  actionLiked: { backgroundColor: '#111827' },
  actionSaved: { backgroundColor: '#E91E63' },
  actionText: { color: '#111827', fontWeight: '900' },
  actionTextLiked: { color: '#fff' },
  actionTextSaved: { color: '#fff' },
  repliesTitle: { marginTop: 12, marginBottom: 10, color: '#111827', fontWeight: '900', fontSize: 15 },
  reply: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  replyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  replyAuthor: { color: '#111827', fontWeight: '900' },
  replyTime: { color: '#9CA3AF', fontSize: 11, fontWeight: '700' },
  replyText: { color: '#374151', fontWeight: '600', lineHeight: 18 },
  emptyReplies: { paddingVertical: 18, alignItems: 'center' },
  emptyRepliesText: { color: '#6B7280', fontWeight: '700' },
  replyBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  replyInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontWeight: '600',
    color: '#111827',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

