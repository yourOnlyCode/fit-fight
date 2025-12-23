import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

// Placeholder screens - will be implemented
const BattleScreen = () => null;
const ShopScreen = () => null;
const InventoryScreen = () => null;
const ProfileScreen = () => null;
const RunClubsScreen = () => null;
const SkillTreeScreen = () => null;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#16213e',
        },
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#6c757d',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Battle" component={BattleScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Clubs" component={RunClubsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="SkillTree" component={SkillTreeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
