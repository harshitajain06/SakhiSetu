import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import React, { useMemo, useState } from 'react';
import { Alert, ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from '../../contexts/TranslationContext';
import { storage } from '../../config/firebase';
import { createForumPost, FORUM_CHANNELS } from '../forum/forumApi';

async function uriToBlob(uri) {
  const res = await fetch(uri);
  return await res.blob();
}

export default function ForumCreatePostScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [channel, setChannel] = useState(FORUM_CHANNELS.menstrual);
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [image, setImage] = useState(null); // { uri, name, mimeType }
  const [submitting, setSubmitting] = useState(false);

  const disclaimer =
    t('community.forumDisclaimer') ??
    'This forum is for informational and community support purposes only. It does not replace professional medical advice.';

  const channelTabs = useMemo(
    () => [
      { key: FORUM_CHANNELS.menstrual, label: t('community.forumMenstrual') ?? 'Menstrual Health' },
      { key: FORUM_CHANNELS.maternal, label: t('community.forumMaternal') ?? 'Maternal Health' },
    ],
    [t]
  );

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (res.canceled) return;
      const asset = res.assets?.[0];
      if (!asset?.uri) return;
      setImage({
        uri: asset.uri,
        name: asset.name ?? `image_${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
    } catch (e) {
      Alert.alert(t('common.error') ?? 'Error', String(e?.message ?? e));
    }
  };

  const removeImage = () => setImage(null);

  const uploadForumImageIfAny = async () => {
    if (!image?.uri) return null;
    const blob = await uriToBlob(image.uri);
    const ext = (image.name?.split('.').pop() || 'jpg').toLowerCase();
    const path = `forumImages/${Date.now()}_${Math.random().toString(16).slice(2)}.${ext}`;
    const r = ref(storage, path);
    await uploadBytes(r, blob, { contentType: image.mimeType ?? 'image/jpeg' });
    return await getDownloadURL(r);
  };

  const submit = async () => {
    if (!contentText.trim()) {
      Alert.alert(t('common.error') ?? 'Error', t('community.forumValidationText') ?? 'Please write something.');
      return;
    }
    setSubmitting(true);
    try {
      const imageUrl = await uploadForumImageIfAny();
      const res = await createForumPost({
        channel,
        title: title.trim() || null,
        contentText: contentText.trim(),
        imageUrl: imageUrl || null,
      });
      navigation.replace('ForumPostDetail', { postId: res.postId });
    } catch (e) {
      const code = e?.code || e?.name;
      const rawMsg = e?.message ?? String(e);
      const msg =
        code === 'functions/not-found' || rawMsg?.toLowerCase?.().includes?.('not found')
          ? (t('community.forumFnNotFound') ??
            'Forum backend is not deployed yet (Cloud Function not found). Please deploy Firebase Functions, then try again.')
          : rawMsg;
      Alert.alert(t('common.error') ?? 'Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('community.forumCreateTitle') ?? 'Create Post'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
          <Text style={styles.disclaimerText}>{disclaimer}</Text>
        </View>

        <Text style={styles.label}>{t('community.forumChannel') ?? 'Channel'}</Text>
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

        <Text style={styles.label}>{t('community.forumTitleOptional') ?? 'Title (optional)'}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('community.forumTitlePlaceholder') ?? 'Eg. Severe cramps during periods'}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          maxLength={90}
        />

        <Text style={styles.label}>{t('community.forumBody') ?? 'Post text'}</Text>
        <TextInput
          value={contentText}
          onChangeText={setContentText}
          placeholder={t('community.forumBodyPlaceholder') ?? 'Write your question or experience...'}
          placeholderTextColor="#9CA3AF"
          style={[styles.input, styles.textArea]}
          multiline
          textAlignVertical="top"
          maxLength={1200}
        />

        <Text style={styles.label}>{t('community.forumImageOptional') ?? 'Image (optional)'}</Text>
        {image?.uri ? (
          <View style={styles.imageWrap}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity style={styles.removeImage} onPress={removeImage}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.removeImageText}>{t('common.cancel') ?? 'Remove'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
            <Ionicons name="image-outline" size={18} color="#111827" />
            <Text style={styles.pickBtnText}>{t('community.forumPickImage') ?? 'Upload image'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.7 }]} onPress={submit} disabled={submitting}>
          {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="paper-plane" size={18} color="#fff" />}
          <Text style={styles.submitText}>{t('community.forumPublish') ?? 'Publish'}</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          {t('community.forumModerationNote') ??
            'Posts and replies are moderated for safety. Harmful text or images will be blocked.'}
        </Text>
      </ScrollView>
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
  scroll: { padding: 18, paddingBottom: 30 },
  disclaimer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  disclaimerText: { flex: 1, color: '#374151', fontSize: 12, lineHeight: 16, fontWeight: '600' },
  label: { color: '#111827', fontWeight: '900', marginBottom: 8, marginTop: 10 },
  channelRow: { flexDirection: 'row', gap: 10 },
  channelPill: { flex: 1, paddingVertical: 10, borderRadius: 999, backgroundColor: '#E5E7EB', alignItems: 'center' },
  channelPillActive: { backgroundColor: '#111827' },
  channelText: { color: '#374151', fontWeight: '800', fontSize: 12 },
  channelTextActive: { color: '#fff' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  textArea: { minHeight: 160 },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pickBtnText: { color: '#111827', fontWeight: '800' },
  imageWrap: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  image: { width: '100%', height: 200 },
  removeImage: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111827CC',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  removeImageText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  submitBtn: {
    marginTop: 16,
    backgroundColor: '#E91E63',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  note: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

