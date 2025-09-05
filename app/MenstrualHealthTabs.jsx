import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert } from 'react-native';

// Import menstrual health specific screens
import { auth } from '../config/firebase';
import CycleInsightsScreen from './CycleInsightsScreen';
import MenstrualHomeScreen from './MenstrualHomeScreen';
import MenstrualLearnScreen from './MenstrualLearnScreen';
import PeriodTrackerScreen from './PeriodTrackerScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator Component
const BottomTabs = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "MenstrualHome") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "PeriodTracker") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "CycleInsights") {
            iconName = focused ? "analytics" : "analytics-outline";
          } else if (route.name === "MenstrualLearn") {
            iconName = focused ? "book" : "book-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="MenstrualHome" 
        component={MenstrualHomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen 
        name="PeriodTracker" 
        component={PeriodTrackerScreen}
        options={{ title: "Tracker" }}
      />
      <Tab.Screen
        name="CycleInsights"
        component={CycleInsightsScreen}
        options={{ title: "Insights" }}
      />
      <Tab.Screen
        name="MenstrualLearn"
        component={MenstrualLearnScreen}
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

  const handleSwitchHealthFlow = () => {
    navigation.replace("HealthSelectionScreen");
  };

  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: 'Menstrual Health' }} />
      
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

export default function MenstrualHealthTabs() {
  return <DrawerNavigator />;
}
