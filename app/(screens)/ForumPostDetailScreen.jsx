import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Keyboard,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../../config/firebase";
import { useTranslation } from "../../contexts/TranslationContext";
import {
    createForumReply,
    deleteForumPost,
    deleteForumReply,
    fetchReplies,
    forumPostHasReports,
    forumReplyHasReports,
    getForumReplyIdsReportedByMe,
    listenToBookmark,
    listenToLike,
    listenToPost,
    listenToUserForumPostReport,
    reportForumPost,
    reportForumReply,
    toggleForumBookmark,
    toggleForumLike,
    updateForumReply,
} from "../forum/forumApi";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Bottom inset so list content clears the fixed reply bar (multiline input up to maxHeight + paddings). */
const FORUM_REPLY_COMPOSER_BOTTOM = 148;

function formatTime(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
    if (!d) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

function FlaggedCornerLabel() {
  const { t } = useTranslation();
  return (
    <View style={styles.flaggedCorner} pointerEvents="none">
      <Ionicons name="flag" size={14} color="#DC2626" />
      <Text style={styles.flaggedCornerText}>
        {t("community.forumFlagged") ?? "Flagged"}
      </Text>
    </View>
  );
}

function ReplyItem({
  item,
  isOwner,
  showReport,
  reported,
  onPressEdit,
  onPressDelete,
  onPressReport,
}) {
  const { t } = useTranslation();
  return (
    <View style={[styles.reply, reported && styles.replyReported]}>
      <View style={styles.replyTop}>
        <View style={styles.replyTopLeft}>
          <Text style={styles.replyAuthor}>
            {item.authorDisplayName ?? "User"}
          </Text>
          <Text style={styles.replyTime}>{formatTime(item.createdAt)}</Text>
        </View>
        {isOwner ? (
          <View style={styles.replyActions}>
            <TouchableOpacity
              onPress={onPressEdit}
              style={styles.replyIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="pencil" size={16} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressDelete}
              style={styles.replyIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        ) : showReport ? (
          <TouchableOpacity
            onPress={onPressReport}
            style={styles.replyReportBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.85}
          >
            <Ionicons name="flag-outline" size={16} color="#DC2626" />
            <Text style={styles.replyReportText}>
              {t("community.forumReport") ?? "Report"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.replyText}>{item.replyText ?? ""}</Text>
      {reported ? (
        <View style={styles.replyFlaggedFooter}>
          <FlaggedCornerLabel />
        </View>
      ) : null}
    </View>
  );
}

export default function ForumPostDetailScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route?.params?.postId;

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [editReplyId, setEditReplyId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [likeBusy, setLikeBusy] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [keyboardPad, setKeyboardPad] = useState(0);
  const [postReportedByMe, setPostReportedByMe] = useState(false);
  const [replyIdsReportedByMe, setReplyIdsReportedByMe] = useState([]);
  const isAuthor = Boolean(
    post?.userId &&
    auth.currentUser?.uid &&
    post.userId === auth.currentUser.uid,
  );

  const disclaimer =
    t("community.forumDisclaimer") ??
    "This forum is for informational and community support purposes only. It does not replace professional medical advice.";

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
    const unsub = listenToBookmark(postId, (saved) =>
      setIsSaved(Boolean(saved)),
    );
    return () => unsub?.();
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    const unsub = listenToLike(postId, (liked) => setIsLiked(Boolean(liked)));
    return () => unsub?.();
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    const unsub = listenToUserForumPostReport(postId, (reported) =>
      setPostReportedByMe(Boolean(reported)),
    );
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

  useEffect(() => {
    if (!postId) {
      setReplyIdsReportedByMe([]);
      return;
    }
    const uid = auth.currentUser?.uid;
    if (!uid || !replies.length) {
      setReplyIdsReportedByMe([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const ids = await getForumReplyIdsReportedByMe(
          postId,
          replies.map((r) => r.id).filter(Boolean),
        );
        if (!cancelled) setReplyIdsReportedByMe(ids);
      } catch {
        if (!cancelled) setReplyIdsReportedByMe([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId, replies]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const onShow = (e) =>
      setKeyboardPad(Math.round(e.endCoordinates?.height ?? 0));
    const onHide = () => setKeyboardPad(0);
    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const onSendReply = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      await createForumReply({ postId, replyText: replyText.trim() });
      setReplyText("");
      await reloadReplies();
    } catch (e) {
      Alert.alert(t("common.error") ?? "Error", e?.message ?? String(e));
    } finally {
      setSending(false);
    }
  };

  const openEditReply = (reply) => {
    setEditReplyId(reply?.id ?? null);
    setEditValue(reply?.replyText ?? "");
    setEditOpen(true);
  };

  const onSaveEditReply = async () => {
    if (!postId || !editReplyId || editBusy) return;
    const nextText = editValue.trim();
    if (!nextText) {
      Alert.alert(
        t("common.error") ?? "Error",
        t("community.forumValidationText") ?? "Please write something.",
      );
      return;
    }
    setEditBusy(true);
    try {
      await updateForumReply({
        postId,
        replyId: editReplyId,
        replyText: nextText,
      });
      setEditOpen(false);
      setEditReplyId(null);
      setEditValue("");
      await reloadReplies();
    } catch (e) {
      Alert.alert(t("common.error") ?? "Error", e?.message ?? String(e));
    } finally {
      setEditBusy(false);
    }
  };

  const onDeleteReply = async (reply) => {
    if (!postId || !reply?.id) return;
    Alert.alert(
      t("common.confirm") ?? "Confirm",
      t("community.forumDeleteConfirmReply") ??
        "Delete this reply? This cannot be undone.",
      [
        { text: t("common.cancel") ?? "Cancel", style: "cancel" },
        {
          text: t("common.delete") ?? "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteForumReply({ postId, replyId: reply.id });
              await reloadReplies();
            } catch (e) {
              Alert.alert(
                t("common.error") ?? "Error",
                e?.message ?? String(e),
              );
            }
          },
        },
      ],
    );
  };

  const onLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      await toggleForumLike({ postId });
    } catch (e) {
      Alert.alert(t("common.error") ?? "Error", e?.message ?? String(e));
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
      Alert.alert(t("common.error") ?? "Error", e?.message ?? String(e));
    } finally {
      setBookmarkBusy(false);
    }
  };

  const onReport = async () => {
    Alert.alert(
      t("community.forumReportTitle") ?? "Report",
      t("community.forumReportBody") ?? "Report this post for review?",
      [
        { text: t("common.cancel") ?? "Cancel", style: "cancel" },
        {
          text: t("community.forumReportCta") ?? "Report",
          style: "destructive",
          onPress: async () => {
            try {
              await reportForumPost({ postId, reason: "user_report" });
              Alert.alert(
                t("common.ok") ?? "OK",
                t("community.forumReported") ??
                  "Reported. Thanks for helping keep the community safe.",
              );
            } catch (e) {
              Alert.alert(
                t("common.error") ?? "Error",
                e?.message ?? String(e),
              );
            }
          },
        },
      ],
    );
  };

  const onReportReply = (reply) => {
    if (!postId || !reply?.id) return;
    Alert.alert(
      t("community.forumReportReplyTitle") ?? "Report reply",
      t("community.forumReportReplyBody") ?? "Report this reply for review?",
      [
        { text: t("common.cancel") ?? "Cancel", style: "cancel" },
        {
          text: t("community.forumReportCta") ?? "Report",
          style: "destructive",
          onPress: async () => {
            try {
              await reportForumReply({
                postId,
                replyId: reply.id,
                reason: "user_report",
              });
              Alert.alert(
                t("common.ok") ?? "OK",
                t("community.forumReported") ??
                  "Reported. Thanks for helping keep the community safe.",
              );
              await reloadReplies();
            } catch (e) {
              Alert.alert(
                t("common.error") ?? "Error",
                e?.message ?? String(e),
              );
            }
          },
        },
      ],
    );
  };

  const onEdit = () => {
    if (!postId || !post) return;
    navigation.navigate("ForumCreatePost", { postId, channel: post.channel });
  };

  const onDelete = async () => {
    if (!postId) return;
    Alert.alert(
      t("common.confirm") ?? "Confirm",
      t("community.forumDeleteConfirmPost") ??
        "Delete this post? This cannot be undone.",
      [
        { text: t("common.cancel") ?? "Cancel", style: "cancel" },
        {
          text: t("common.delete") ?? "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteForumPost({ postId });
              navigation.goBack();
            } catch (e) {
              Alert.alert(
                t("common.error") ?? "Error",
                e?.message ?? String(e),
              );
            }
          },
        },
      ],
    );
  };

  const header = loadingPost ? (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#E91E63" />
    </View>
  ) : !post ? (
    <View style={styles.loading}>
      <Text style={{ color: "#6B7280", fontWeight: "800" }}>
        {t("community.forumPostMissing") ?? "Post not found."}
      </Text>
    </View>
  ) : (
    <View>
      <View
        style={[
          styles.postCard,
          forumPostHasReports(post) && styles.postCardReported,
        ]}
      >
        <View style={styles.postTop}>
          <Text style={styles.postAuthor}>
            {post.authorDisplayName ?? "User"}
          </Text>
          <Text style={styles.postTime}>{formatTime(post.createdAt)}</Text>
        </View>
        {post.title ? (
          <View style={styles.titleRow}>
            <Text style={styles.postTitle}>{post.title}</Text>
            {isAuthor ? (
              <View style={styles.ownerActions}>
                <TouchableOpacity
                  onPress={onEdit}
                  style={styles.ownerIconBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="pencil" size={18} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onDelete}
                  style={styles.ownerIconBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash" size={18} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : isAuthor ? (
          <View style={styles.ownerActionsNoTitle}>
            <TouchableOpacity
              onPress={onEdit}
              style={styles.ownerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="pencil" size={18} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              style={styles.ownerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash" size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        ) : null}
        <Text style={styles.postBody}>{post.contentText ?? ""}</Text>
        {post.contentImageUrl ? (
          <Image
            source={{ uri: post.contentImageUrl }}
            style={styles.postImage}
          />
        ) : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, isLiked && styles.actionLiked]}
            onPress={onLike}
            disabled={likeBusy}
          >
            {likeBusy ? (
              <ActivityIndicator
                size="small"
                color={isLiked ? "#fff" : "#111827"}
              />
            ) : (
              <Ionicons
                name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                size={18}
                color={isLiked ? "#fff" : "#111827"}
              />
            )}
            <Text
              style={[styles.actionText, isLiked && styles.actionTextLiked]}
            >
              {post.likeCount ?? 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, isSaved && styles.actionSaved]}
            onPress={onBookmark}
            disabled={bookmarkBusy}
          >
            {bookmarkBusy ? (
              <ActivityIndicator
                size="small"
                color={isSaved ? "#fff" : "#111827"}
              />
            ) : (
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={18}
                color={isSaved ? "#fff" : "#111827"}
              />
            )}
            <Text
              style={[styles.actionText, isSaved && styles.actionTextSaved]}
            >
              {isSaved
                ? (t("community.forumSaved") ?? "Saved")
                : (t("community.forumSave") ?? "Save")}
            </Text>
          </TouchableOpacity>
          {auth.currentUser && !postReportedByMe ? (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionDanger]}
              onPress={onReport}
            >
              <Ionicons name="flag-outline" size={18} color="#DC2626" />
              <Text style={[styles.actionText, { color: "#DC2626" }]}>
                {t("community.forumReport") ?? "Report"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {forumPostHasReports(post) ? (
          <View style={styles.postFlaggedFooter}>
            <FlaggedCornerLabel />
          </View>
        ) : null}
      </View>

      <Text style={styles.repliesTitle}>
        {t("community.forumReplies") ?? "Replies"} ({replies.length})
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("community.forumPost") ?? "Post"}
        </Text>
        <TouchableOpacity
          onPress={() => setInfoOpen(true)}
          style={styles.headerBtn}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#111827"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.replyList}
        data={replies}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => {
          const isOwner = Boolean(
            item?.userId &&
            auth.currentUser?.uid &&
            item.userId === auth.currentUser.uid,
          );
          const showReport =
            Boolean(auth.currentUser?.uid) &&
            !isOwner &&
            !replyIdsReportedByMe.includes(item.id);
          const reported = forumReplyHasReports(item);
          return (
            <ReplyItem
              item={item}
              isOwner={isOwner}
              showReport={showReport}
              reported={reported}
              onPressEdit={() => openEditReply(item)}
              onPressDelete={() => onDeleteReply(item)}
              onPressReport={() => onReportReply(item)}
            />
          );
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom:
            18 +
            FORUM_REPLY_COMPOSER_BOTTOM +
            Math.max(insets.bottom, 10),
        }}
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
                {t("community.forumNoReplies") ??
                  "No replies yet. Be kind and supportive."}
              </Text>
            </View>
          )
        }
      />

      <View
        style={[
          styles.replyBox,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: keyboardPad,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <TextInput
          value={replyText}
          onChangeText={setReplyText}
          placeholder={
            t("community.forumReplyPlaceholder") ?? "Write a reply..."
          }
          placeholderTextColor="#9CA3AF"
          style={styles.replyInput}
          multiline
          maxLength={700}
          textAlignVertical={Platform.OS === "android" ? "top" : undefined}
          cursorColor="#111827"
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!replyText.trim() || sending) && { opacity: 0.5 },
          ]}
          onPress={onSendReply}
          disabled={!replyText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={infoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setInfoOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("community.forumInfoTitle") ?? "Forum info"}
              </Text>
              <TouchableOpacity
                onPress={() => setInfoOpen(false)}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalBody}>{disclaimer}</Text>
            <TouchableOpacity
              style={styles.modalOkBtn}
              onPress={() => setInfoOpen(false)}
              activeOpacity={0.9}
            >
              <Text style={styles.modalOkText}>{t("common.ok") ?? "OK"}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={() => (editBusy ? null : setEditOpen(false))}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => (editBusy ? null : setEditOpen(false))}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("community.forumEditReplyTitle") ?? "Edit reply"}
              </Text>
              <TouchableOpacity
                onPress={() => (editBusy ? null : setEditOpen(false))}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              placeholder={
                t("community.forumReplyPlaceholder") ?? "Write a reply..."
              }
              placeholderTextColor="#9CA3AF"
              style={[styles.replyInput, { minHeight: 90, maxHeight: 160 }]}
              multiline
              maxLength={700}
              editable={!editBusy}
              textAlignVertical={Platform.OS === "android" ? "top" : undefined}
              cursorColor="#111827"
            />
            <View style={styles.editModalActions}>
              <TouchableOpacity
                style={[styles.editCancelBtn, editBusy && { opacity: 0.6 }]}
                onPress={() => (editBusy ? null : setEditOpen(false))}
                disabled={editBusy}
                activeOpacity={0.9}
              >
                <Text style={styles.editCancelText}>
                  {t("common.cancel") ?? "Cancel"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.editSaveBtn,
                  (!editValue.trim() || editBusy) && { opacity: 0.6 },
                ]}
                onPress={onSaveEditReply}
                disabled={!editValue.trim() || editBusy}
                activeOpacity={0.9}
              >
                {editBusy ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.editSaveText}>
                    {t("common.save") ?? "Save"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  replyList: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "ios" ? 52 : 20,
    paddingBottom: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: { fontWeight: "900", color: "#111827", fontSize: 16 },
  loading: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  postCard: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  postCardReported: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  postFlaggedFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  flaggedCorner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  flaggedCornerText: {
    color: "#DC2626",
    fontWeight: "800",
    fontSize: 12,
  },
  postTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postAuthor: { color: "#111827", fontWeight: "900" },
  postTime: { color: "#6B7280", fontSize: 12, fontWeight: "700" },
  postTitle: {
    marginTop: 10,
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  titleRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  ownerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  ownerActionsNoTitle: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  ownerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  postBody: {
    marginTop: 8,
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  postImage: {
    marginTop: 12,
    width: "100%",
    height: 220,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  actionDanger: { backgroundColor: "#FEE2E2" },
  actionLiked: { backgroundColor: "#111827" },
  actionSaved: { backgroundColor: "#E91E63" },
  actionText: { color: "#111827", fontWeight: "900" },
  actionTextLiked: { color: "#fff" },
  actionTextSaved: { color: "#fff" },
  repliesTitle: {
    marginTop: 12,
    marginBottom: 10,
    color: "#111827",
    fontWeight: "900",
    fontSize: 15,
  },
  reply: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  replyReported: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  replyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  replyTopLeft: { flex: 1, paddingRight: 10 },
  replyAuthor: { color: "#111827", fontWeight: "900" },
  replyTime: { color: "#9CA3AF", fontSize: 11, fontWeight: "700" },
  replyActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  replyIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  replyReportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
  },
  replyReportText: { color: "#DC2626", fontWeight: "800", fontSize: 12 },
  replyText: { color: "#374151", fontWeight: "600", lineHeight: 18 },
  replyFlaggedFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  emptyReplies: { paddingVertical: 18, alignItems: "center" },
  emptyRepliesText: { color: "#6B7280", fontWeight: "700" },
  replyBox: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  replyInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: "#111827",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E91E63",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.5)",
    padding: 18,
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  modalTitle: {
    flex: 1,
    color: "#111827",
    fontWeight: "900",
    fontSize: 16,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    color: "#374151",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  modalOkBtn: {
    marginTop: 14,
    alignSelf: "flex-end",
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalOkText: {
    color: "#fff",
    fontWeight: "900",
  },
  editModalActions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  editCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  editCancelText: { color: "#111827", fontWeight: "900" },
  editSaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#111827",
    minWidth: 86,
    alignItems: "center",
  },
  editSaveText: { color: "#fff", fontWeight: "900" },
});
