import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function LearnScreen() {
  const [topics, setTopics] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "learnTopics"));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setTopics(list);
      } catch (error) {
        console.log("Error fetching learn topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((item) => item.language === selectedLanguage);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.mediaRow}>
        {item.hasVideo && (
          <View style={styles.mediaTag}>
            <Text style={styles.mediaText}>🎥 Video</Text>
          </View>
        )}
        {item.hasAudio && (
          <View style={styles.mediaTag}>
            <Text style={styles.mediaText}>🎧 Audio</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Journey to Understanding</Text>

      {/* Topic Grid */}
      <FlatList
        data={filteredTopics}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Language Selector */}
      <View style={styles.languageSection}>
        <Text style={styles.languageTitle}>Choose Your Language</Text>
        <View style={styles.languageRow}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              selectedLanguage === "English" && styles.activeLanguageButton,
            ]}
            onPress={() => setSelectedLanguage("English")}
          >
            <Text
              style={[
                styles.languageText,
                selectedLanguage === "English" && styles.activeLanguageText,
              ]}
            >
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageButton,
              selectedLanguage === "Hindi" && styles.activeLanguageButton,
            ]}
            onPress={() => setSelectedLanguage("Hindi")}
          >
            <Text
              style={[
                styles.languageText,
                selectedLanguage === "Hindi" && styles.activeLanguageText,
              ]}
            >
              Hindi
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "48%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  image: { width: "100%", height: 100, borderRadius: 8, marginBottom: 8 },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  description: { fontSize: 12, color: "#555", marginBottom: 6 },
  mediaRow: { flexDirection: "row", gap: 6 },
  mediaTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mediaText: { fontSize: 10, color: "#333" },
  languageSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
    marginTop: 10,
  },
  languageTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 10 },
  languageRow: { flexDirection: "row", gap: 10 },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  activeLanguageButton: { backgroundColor: "#4F46E5" },
  languageText: { color: "#333" },
  activeLanguageText: { color: "#fff" },
});
