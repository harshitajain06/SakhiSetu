import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../contexts/TranslationContext';

function openUrl(url) {
  if (url) Linking.openURL(url).catch(() => {});
}

function LinkedLine({ prefix, body, url, bodyUrl }) {
  const target = url || bodyUrl;
  return (
    <Text style={styles.sourceText}>
      <Text style={styles.sourcePrefix}>{prefix}</Text>
      {target ? (
        <Text style={styles.link} onPress={() => openUrl(target)} suppressHighlighting={false}>
          {body}
        </Text>
      ) : (
        <Text>{body}</Text>
      )}
    </Text>
  );
}

function CitationBlock({ entry, accentColor }) {
  const fromLabel = entry.fromLabel || 'Adapted from';
  const adaptedTarget = entry.adaptedFromUrl;

  return (
    <View style={styles.citationBlock}>
      <View style={[styles.bullet, { backgroundColor: accentColor }]} />
      <View style={styles.citationTextCol}>
        <LinkedLine prefix="Source: " body={entry.source} url={entry.url} />
        <Text style={styles.sourceText}>
          <Text style={styles.sourcePrefix}>{fromLabel}: </Text>
          {adaptedTarget ? (
            <Text style={styles.link} onPress={() => openUrl(adaptedTarget)}>
              {entry.adaptedFrom}
            </Text>
          ) : (
            <Text>{entry.adaptedFrom}</Text>
          )}
        </Text>
      </View>
    </View>
  );
}

export default function SourcesSection({ sources, accentColor = '#666' }) {
  const { t } = useTranslation();

  if (!sources || !Array.isArray(sources) || sources.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('general.sources')}</Text>
      {sources.map((source, index) => {
        if (typeof source === 'string') {
          return (
            <View key={`${index}-${source.slice(0, 24)}`} style={styles.sourceRow}>
              <View style={[styles.bullet, { backgroundColor: accentColor }]} />
              <Text style={styles.sourceText}>{source}</Text>
            </View>
          );
        }
        if (source && typeof source === 'object' && source.source && source.adaptedFrom) {
          return (
            <CitationBlock
              key={`${index}-${String(source.source).slice(0, 20)}`}
              entry={source}
              accentColor={accentColor}
            />
          );
        }
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  sourceRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  citationBlock: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  citationTextCol: {
    flex: 1,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  sourceText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 2,
  },
  sourcePrefix: {
    fontWeight: '600',
    color: '#444',
  },
  link: {
    color: '#1565C0',
    textDecorationLine: 'underline',
  },
});
