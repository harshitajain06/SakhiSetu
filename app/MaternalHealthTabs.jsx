import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Modal, View, StyleSheet } from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';

// Import screens
import { auth } from '../config/firebase';
import CommunityScreen from './(screens)/CommunityScreen';
import HomeScreen from './(screens)/HomeScreen';
import InsightsScreen from './(screens)/InsightsScreens';
import LearnScreen from './(screens)/LearnScreen';
import LanguageSelectorScreen from './LanguageSelectorScreen';
import PregnancyTrackerScreen from './PregnancyTrackerScreen';
import FloatingChatButton from './components/FloatingChatButton';
import ChatScreen from './(screens)/ChatScreen';

// Import maternal health learn module screens
import BreastfeedingGuideDetailScreen from './BreastfeedingGuideDetailScreen';
import BreastfeedingGuideListScreen from './BreastfeedingGuideListScreen';
import ExerciseFitnessDetailScreen from './ExerciseFitnessDetailScreen';
import ExerciseFitnessListScreen from './ExerciseFitnessListScreen';
import MaternalWellnessDetailScreen from './MaternalWellnessDetailScreen';
import MaternalWellnessListScreen from './MaternalWellnessListScreen';
import MaternalWellnessScreen from './MaternalWellnessScreen';
import NewbornCareDetailScreen from './NewbornCareDetailScreen';
import NewbornCareListScreen from './NewbornCareListScreen';
import NewbornCareScreen from './NewbornCareScreen';
import NutritionDietDetailScreen from './NutritionDietDetailScreen';
import NutritionDietListScreen from './NutritionDietListScreen';
import NutritionDietScreen from './NutritionDietScreen';
import PostpartumCareDetailScreen from './PostpartumCareDetailScreen';
import PostpartumCareListScreen from './PostpartumCareListScreen';
import PregnancyBasicsDetailScreen from './PregnancyBasicsDetailScreen';
import PregnancyBasicsListScreen from './PregnancyBasicsListScreen';
import PregnancyBasicsScreen from './PregnancyBasicsScreen';
import PrenatalCareDetailScreen from './PrenatalCareDetailScreen';
import PrenatalCareListScreen from './PrenatalCareListScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Learn Stack Navigator for module screens
const LearnStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MaternalLearnMain" component={LearnScreen} />
      <Stack.Screen name="PrenatalCareList" component={PrenatalCareListScreen} />
      <Stack.Screen name="PrenatalCareDetail" component={PrenatalCareDetailScreen} />
      <Stack.Screen name="PostpartumCareList" component={PostpartumCareListScreen} />
      <Stack.Screen name="PostpartumCareDetail" component={PostpartumCareDetailScreen} />
      <Stack.Screen name="BreastfeedingGuideList" component={BreastfeedingGuideListScreen} />
      <Stack.Screen name="BreastfeedingGuideDetail" component={BreastfeedingGuideDetailScreen} />
      <Stack.Screen name="ExerciseFitnessList" component={ExerciseFitnessListScreen} />
      <Stack.Screen name="ExerciseFitnessDetail" component={ExerciseFitnessDetailScreen} />
      {/* Pregnancy Basics screens */}
      <Stack.Screen name="PregnancyBasics" component={PregnancyBasicsScreen} />
      <Stack.Screen name="PregnancyBasicsList" component={PregnancyBasicsListScreen} />
      <Stack.Screen name="PregnancyBasicsDetail" component={PregnancyBasicsDetailScreen} />
      {/* Nutrition & Diet screens */}
      <Stack.Screen name="NutritionDiet" component={NutritionDietScreen} />
      <Stack.Screen name="NutritionDietList" component={NutritionDietListScreen} />
      <Stack.Screen name="NutritionDietDetail" component={NutritionDietDetailScreen} />
      {/* Newborn Care screens */}
      <Stack.Screen name="NewbornCare" component={NewbornCareScreen} />
      <Stack.Screen name="NewbornCareList" component={NewbornCareListScreen} />
      <Stack.Screen name="NewbornCareDetail" component={NewbornCareDetailScreen} />
      {/* Maternal Wellness screens */}
      <Stack.Screen name="MaternalWellness" component={MaternalWellnessScreen} />
      <Stack.Screen name="MaternalWellnessList" component={MaternalWellnessListScreen} />
      <Stack.Screen name="MaternalWellnessDetail" component={MaternalWellnessDetailScreen} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator Component
const BottomTabs = () => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Community") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Insights") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Learn") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Pregnancy") {
            iconName = focused ? "baby" : "baby-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('nav.home') }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: t('nav.community') }} />
      <Tab.Screen
        name="Insights"
        component={PregnancyTrackerScreen}
        options={{ title: t('nav.insights') }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStack}
        options={{ title: t('nav.learn') }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator Component
const DrawerNavigator = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("LoginRegister");
      })
      .catch((err) => {
        console.error("Logout Error:", err);
        Alert.alert(t('common.error'), "Failed to logout. Please try again.");
      });
  };

  const handleSwitchHealthFlow = () => {
    navigation.replace("HealthSelectionScreen");
  };

  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: t('learn.title') }} />
      
      <Drawer.Screen
        name="LanguageSelector"
        component={LanguageSelectorScreen}
        options={{
          title: t('nav.language'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="language-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="SwitchHealthFlow"
        component={BottomTabs}
        options={{
          title: t('nav.switchHealthFlow'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleSwitchHealthFlow();
          },
        }}
      />
      
      <Drawer.Screen
        name="Logout"
        component={BottomTabs}
        options={{
          title: t('nav.logout'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default function MaternalHealthTabs() {
  const [chatModalVisible, setChatModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <DrawerNavigator />
      <FloatingChatButton onPress={() => setChatModalVisible(true)} />
      <Modal
        visible={chatModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setChatModalVisible(false)}
      >
        <ChatScreen onClose={() => setChatModalVisible(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
