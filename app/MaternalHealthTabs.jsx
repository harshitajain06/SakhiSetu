import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert } from 'react-native';

// Import screens
import { auth } from '../config/firebase';
import CommunityScreen from './(screens)/CommunityScreen';
import HomeScreen from './(screens)/HomeScreen';
import InsightsScreen from './(screens)/InsightsScreens';
import LearnScreen from './(screens)/LearnScreen';
import PregnancyTrackerScreen from './PregnancyTrackerScreen';

// Import maternal health learn module screens
import BreastfeedingGuideDetailScreen from './BreastfeedingGuideDetailScreen';
import BreastfeedingGuideListScreen from './BreastfeedingGuideListScreen';
import ExerciseFitnessDetailScreen from './ExerciseFitnessDetailScreen';
import ExerciseFitnessListScreen from './ExerciseFitnessListScreen';
import MaternalWellnessScreen from './MaternalWellnessScreen';
import NewbornCareScreen from './NewbornCareScreen';
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
      {/* Video module screens */}
      <Stack.Screen name="NutritionDiet" component={NutritionDietScreen} />
      <Stack.Screen name="NewbornCare" component={NewbornCareScreen} />
      <Stack.Screen name="MaternalWellness" component={MaternalWellnessScreen} />
    </Stack.Navigator>
  );
};

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
          } else if (route.name === "Pregnancy") {
            iconName = focused ? "baby" : "baby-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen
        name="Insights"
        component={PregnancyTrackerScreen}
        options={{ title: "Insights" }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStack}
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
      <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: 'Maternal Health' }} />
      
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

export default function MaternalHealthTabs() {
  return <DrawerNavigator />;
}
