// app/(tabs)/_layout.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme } from '@react-navigation/native';
import { Text } from 'react-native';
import Explore from './explore';
import Home from './index';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: DefaultTheme.colors.background },
        headerTintColor: DefaultTheme.colors.text,
        tabBarStyle: { backgroundColor: DefaultTheme.colors.background },
        tabBarActiveTintColor: DefaultTheme.colors.primary,
        tabBarInactiveTintColor: DefaultTheme.colors.text,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Explore" component={Explore} />
    </Tab.Navigator>
  );
}
