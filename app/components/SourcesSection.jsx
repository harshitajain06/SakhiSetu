import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../contexts/TranslationContext';

export default function SourcesSection({ sources, accentColor = '#666' }) {
  const { t } = useTranslation();

  if (!sources || !Array.isArray(sources) || sources.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('general.sources')}</Text>
      {sources.map((source, index) => (
        <View key={`${index}-${String(source).slice(0, 16)}`} style={styles.sourceRow}>
          <View style={[styles.bullet, { backgroundColor: accentColor }]} />
          <Text style={styles.sourceText}>{String(source)}</Text>
        </View>
      ))}
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
    lineHeight: 18,
  },
});

