// src/navigation/StackLayout.jsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import CommunityScreen from "./CommunityScreen";
import InsightsScreen from "./InsightsScreens";
import LearnScreen from "./LearnScreen";
import LoginRegister from './index';
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import { auth } from "../../config/firebase";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator Component
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
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{ title: "Insights" }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: "Learn" }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator Component
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

  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: 'Home' }} />
      
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

// Stack Navigator Component
export default function StackLayout() {
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
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
