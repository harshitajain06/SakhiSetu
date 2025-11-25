import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { useTranslation } from "../../contexts/TranslationContext";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CommunityInfoScreen() {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "communityResources")
        );
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setResources(list);
      } catch (error) {
        console.log("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  // Map filter values (English keys) to translated display text
  const getFilterDisplayText = (filterKey) => {
    const filterMap = {
      'All': t('community.filterAll'),
      'Health Center': t('community.filterHealthCenter'),
      'Local Counselor': t('community.filterLocalCounselor'),
    };
    return filterMap[filterKey] || filterKey;
  };

  const filteredResources =
    filter === 'All'
      ? resources
      : resources.filter((item) => item.category === filter);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openNearbyHospitals = () => {
    const url =
      "https://www.google.com/maps/search/?api=1&query=hospitals+near+me";
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar} />
        <View style={styles.cardHeaderText}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </View>

      <Text style={styles.address}>{item.address}</Text>

      <TouchableOpacity onPress={() => handleCall(item.phone)}>
        <Text style={styles.phone}>{item.phone}</Text>
      </TouchableOpacity>

      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const filterOptions = ['All', 'Health Center', 'Local Counselor'];

  return (
    <View style={styles.container}>
      {/* Page Heading */}
      <Text style={styles.heading}>{t('community.title')}</Text>
      <Text style={styles.subHeading}>
        {t('community.subtitle')}
      </Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {filterOptions.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              filter === cat && styles.activeFilter,
            ]}
            onPress={() => setFilter(cat)}
          >
            <Text
              style={[
                styles.filterText,
                filter === cat && styles.activeFilterText,
              ]}
            >
              {getFilterDisplayText(cat)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nearby Hospitals Button */}
      <TouchableOpacity style={styles.nearbyButton} onPress={openNearbyHospitals}>
        <Text style={styles.nearbyButtonText}>{t('community.findNearbyHospitals')}</Text>
      </TouchableOpacity>

      {/* Resource List */}
      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Text style={styles.footerNote}>
            {t('community.footerNote')}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#F9FAFB",
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },

  filterContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: "#4F46E5",
    elevation: 3,
  },
  filterText: {
    color: "#374151",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#fff",
  },

  nearbyButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
  },
  nearbyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  avatar: {
    width: 45,
    height: 45,
    backgroundColor: "#D1D5DB",
    borderRadius: 22.5,
    marginRight: 12,
  },

  cardHeaderText: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  category: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 2,
  },

  address: {
    color: "#374151",
    marginBottom: 6,
  },

  phone: {
    color: "#2563EB",
    marginBottom: 8,
    fontWeight: "600",
  },

  description: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
  },

  footerNote: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 20,
    textAlign: "center",
  },
});
