import { httpsCallable } from 'firebase/functions';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { auth, db, functions } from '../../config/firebase';

export const FORUM_CHANNELS = {
  menstrual: 'menstrual',
  maternal: 'maternal',
};

export function requireUid() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Please sign in to use the forum.');
  return uid;
}

export function forumPostsCollection() {
  return collection(db, 'forumPosts');
}

export function forumPostDoc(postId) {
  return doc(db, 'forumPosts', postId);
}

export function forumRepliesCollection(postId) {
  return collection(db, 'forumPosts', postId, 'replies');
}

export function userForumBookmarksCollection(uid) {
  return collection(db, 'users', uid, 'forumBookmarks');
}

export function userForumBookmarkDoc(uid, postId) {
  return doc(db, 'users', uid, 'forumBookmarks', postId);
}

export function listenToPost(postId, cb) {
  return onSnapshot(forumPostDoc(postId), (snap) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export function listenToBookmark(postId, cb) {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    cb(false);
    return () => {};
  }
  return onSnapshot(userForumBookmarkDoc(uid, postId), (snap) => cb(snap.exists()));
}

export function listenToLike(postId, cb) {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    cb(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'forumPosts', postId, 'likes', uid), (snap) => cb(snap.exists()));
}

/**
 * Realtime listener for the newest forum posts (optionally per channel).
 * Note: uses server-side filtering; ensure Firestore indexes exist if needed.
 */
export function listenToLatestPosts({ channel, pageSize = 20 } = {}, cb) {
  const clauses = [forumPostsCollection(), orderBy('createdAt', 'desc'), limit(pageSize)];
  if (channel) clauses.splice(1, 0, where('channel', '==', channel));
  // Only show active/flagged posts, but exclude removed.
  clauses.splice(1, 0, where('status', '!=', 'removed'));

  const q = query(...clauses);
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(rows);
  });
}

export async function fetchPostsPage({ channel, pageSize = 10, cursor } = {}) {
  const base = [
    forumPostsCollection(),
    orderBy('createdAt', 'desc'),
    limit(pageSize),
  ];

  let q;
  if (channel) {
    // channel is stored as a string; use simple where-less filtering by storing each channel feed separately
    // For now we query all and filter client-side if needed (small early-stage). Prefer server-side indexes later.
    q = query(forumPostsCollection(), orderBy('createdAt', 'desc'), limit(pageSize * 3));
  } else {
    q = query(...base);
  }

  if (cursor) {
    q = channel
      ? query(forumPostsCollection(), orderBy('createdAt', 'desc'), startAfter(cursor), limit(pageSize * 3))
      : query(forumPostsCollection(), orderBy('createdAt', 'desc'), startAfter(cursor), limit(pageSize));
  }

  const snap = await getDocs(q);
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const rows = channel ? all.filter((p) => p.channel === channel).slice(0, pageSize) : all;
  const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
  return { rows, cursor: lastDoc };
}

export async function fetchReplies(postId) {
  const q = query(forumRepliesCollection(postId), orderBy('createdAt', 'asc'), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchSavedPosts({ pageSize = 30 } = {}) {
  const uid = requireUid();
  const q = query(userForumBookmarksCollection(uid), orderBy('createdAt', 'desc'), limit(pageSize));
  const snap = await getDocs(q);
  const ids = snap.docs.map((d) => d.id).filter(Boolean);

  const posts = await Promise.all(
    ids.map(async (postId) => {
      const ps = await getDoc(forumPostDoc(postId));
      if (!ps.exists()) return null;
      return { id: ps.id, ...ps.data() };
    })
  );

  return posts.filter(Boolean);
}

export async function getMyAnonName() {
  const uid = requireUid();
  const uref = doc(db, 'users', uid);
  const usnap = await getDoc(uref);
  const existing = usnap.exists() ? usnap.data()?.anonymousName : null;
  if (existing) return existing;
  const fn = httpsCallable(functions, 'forumGetOrCreateAnonName');
  const res = await fn({});
  return res?.data?.anonymousName ?? null;
}

export async function createForumPost({ channel, title, contentText, imageUrl } = {}) {
  const fn = httpsCallable(functions, 'forumCreatePost');
  const res = await fn({ channel, title, contentText, imageUrl });
  return res.data;
}

export async function createForumReply({ postId, replyText } = {}) {
  const fn = httpsCallable(functions, 'forumCreateReply');
  const res = await fn({ postId, replyText });
  return res.data;
}

export async function toggleForumLike({ postId } = {}) {
  const fn = httpsCallable(functions, 'forumToggleLike');
  const res = await fn({ postId });
  return res.data;
}

export async function toggleForumBookmark({ postId } = {}) {
  const fn = httpsCallable(functions, 'forumToggleBookmark');
  const res = await fn({ postId });
  return res.data;
}

export async function reportForumPost({ postId, reason } = {}) {
  const fn = httpsCallable(functions, 'forumReportPost');
  const res = await fn({ postId, reason });
  return res.data;
}

