// app/(tabs)/_layout.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme } from '@react-navigation/native';
import { Text } from 'react-native';
import Home from './index';
import Pet from './pet';

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
      <Tab.Screen name="Pet" component={Pet} />
    </Tab.Navigator>
  );
}
