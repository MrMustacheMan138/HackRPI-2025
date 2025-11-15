// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: DefaultTheme.colors.background },
          headerTintColor: DefaultTheme.colors.text,
          contentStyle: { backgroundColor: DefaultTheme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Modal',
            headerStyle: { backgroundColor: DefaultTheme.colors.background },
            headerTintColor: DefaultTheme.colors.text,
          }}
        />
      </Stack>
      <StatusBar style="dark" translucent={false} backgroundColor={DefaultTheme.colors.background} />
    </ThemeProvider>
  );
}
