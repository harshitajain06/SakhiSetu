import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChildVaccinationTrackerScreen from './ChildVaccinationTrackerScreen';
import PregnancyTrackerScreen from './PregnancyTrackerScreen';
import { useTranslation } from '../contexts/TranslationContext';

export default function MaternalInsightsTabs({ route }) {
  const { t } = useTranslation();
  const [active, setActive] = useState('pregnancy');

  useEffect(() => {
    const initialTab = route?.params?.initialTab;
    if (initialTab === 'vaccination') {
      setActive('vaccination');
      return;
    }

    if (initialTab === 'pregnancy') {
      setActive('pregnancy');
    }
  }, [route?.params?.initialTab]);

  return (
    <View style={styles.root}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, active === 'pregnancy' && styles.tabActive]}
          onPress={() => setActive('pregnancy')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabLabel, active === 'pregnancy' && styles.tabLabelActive]}>
            {t('insights.maternalPregnancyTab')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, active === 'vaccination' && styles.tabActive]}
          onPress={() => setActive('vaccination')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabLabel, active === 'vaccination' && styles.tabLabelActive]}>
            {t('insights.maternalChildVaccinationTab')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.panel}>
        {active === 'pregnancy' ? (
          <PregnancyTrackerScreen />
        ) : (
          <ChildVaccinationTrackerScreen embedded />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fafafa',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  tabActive: {
    backgroundColor: '#fce4ec',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabLabelActive: {
    color: '#e91e63',
  },
  panel: {
    flex: 1,
  },
});
