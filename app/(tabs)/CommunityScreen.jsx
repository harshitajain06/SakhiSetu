import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Linking } from "react-native";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CommunityInfoScreen() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "communityResources"));
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

  const filteredResources =
    filter === "All" ? resources : resources.filter((item) => item.category === filter);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
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

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["All", "Health Center", "Local Counselor"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterButton, filter === cat && styles.activeFilter]}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.filterText, filter === cat && styles.activeFilterText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Resource List */}
      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListFooterComponent={
          <Text style={styles.footerNote}>
            Important: Phone numbers are always available offline, but direct calling requires an active internet connection.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  filterContainer: { flexDirection: "row", marginBottom: 10 },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: { backgroundColor: "#4F46E5" },
  filterText: { color: "#333" },
  activeFilterText: { color: "#fff" },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  title: { fontWeight: "bold", fontSize: 16 },
  category: { color: "#666", fontSize: 12 },
  address: { color: "#444", marginBottom: 4 },
  phone: { color: "#2563EB", marginBottom: 6 },
  description: { color: "#555" },
  footerNote: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
    paddingHorizontal: 5,
  },
});
