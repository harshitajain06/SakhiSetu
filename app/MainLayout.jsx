import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { signOut } from 'firebase/auth';
import React from "react";
import { Alert } from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';

// Import screens
import CommunityScreen from "./(screens)/CommunityScreen";
import HomeScreen from "./(screens)/HomeScreen";
import InsightsScreen from "./(screens)/InsightsScreens";
import LearnScreen from "./(screens)/LearnScreen";
import LoginRegister from './(screens)/index';
import HealthSelectionScreen from './HealthSelectionScreen';
import LanguageSelectorScreen from './LanguageSelectorScreen';
import LandingPage from './LandingPage';
import MaternalHealthTabs from './MaternalHealthTabs';
import MenstrualHealthTabs from './MenstrualHealthTabs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import WelcomeScreen from './WelcomeScreen';

import { auth } from "../config/firebase";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator Component (Legacy - for Maternal Health)
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
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('nav.home') }} />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: t('nav.learn') }}
      />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: t('nav.community') }} />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ title: t('nav.insights') }}
      />
    
    </Tab.Navigator>
  );
};

// Drawer Navigator Component (Legacy - for Maternal Health)
const DrawerNavigator = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("LandingPage");
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
      <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: t('nav.home') }} />
      
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

// Main Stack Navigator Component
export default function MainLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      initialRouteName="LandingPage"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />
      <Stack.Screen name="LoginRegister" component={LoginRegister} />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="HealthSelectionScreen" component={HealthSelectionScreen} />
      <Stack.Screen name="MaternalHealthTabs" component={MaternalHealthTabs} />
      <Stack.Screen name="MenstrualHealthTabs" component={MenstrualHealthTabs} />
      <Stack.Screen name="LanguageSelector" component={LanguageSelectorScreen} />
      {/* Legacy routes for backward compatibility */}
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
