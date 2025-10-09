import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { signOut } from 'firebase/auth';
import React from "react";
import { Alert } from 'react-native';

// Import screens
import CommunityScreen from "./(screens)/CommunityScreen";
import HomeScreen from "./(screens)/HomeScreen";
import InsightsScreen from "./(screens)/InsightsScreens";
import LearnScreen from "./(screens)/LearnScreen";
import LoginRegister from './(screens)/index';
import HealthSelectionScreen from './HealthSelectionScreen';
import MaternalHealthTabs from './MaternalHealthTabs';
import MenstrualHealthTabs from './MenstrualHealthTabs';

import { auth } from "../config/firebase";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "../hooks/useColorScheme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator Component (Legacy - for Maternal Health)
const BottomTabs = () => {
  const colorScheme = useColorScheme();

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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: "Learn" }}
      />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ title: "Insights" }}
      />
    
    </Tab.Navigator>
  );
};

// Drawer Navigator Component (Legacy - for Maternal Health)
const DrawerNavigator = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("LoginRegister");
      })
      .catch((err) => {
        console.error("Logout Error:", err);
        Alert.alert("Error", "Failed to logout. Please try again.");
      });
  };

  const handleSwitchHealthFlow = () => {
    navigation.replace("HealthSelectionScreen");
  };

  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: 'Home' }} />
      
      <Drawer.Screen
        name="SwitchHealthFlow"
        component={BottomTabs}
        options={{
          title: 'Switch Health Flow',
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
          title: 'Logout',
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
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      <Stack.Screen name="LoginRegister" component={LoginRegister} />
      <Stack.Screen name="HealthSelectionScreen" component={HealthSelectionScreen} />
      <Stack.Screen name="MaternalHealthTabs" component={MaternalHealthTabs} />
      <Stack.Screen name="MenstrualHealthTabs" component={MenstrualHealthTabs} />
      {/* Legacy routes for backward compatibility */}
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
