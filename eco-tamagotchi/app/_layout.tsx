// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import {
  useFonts,
  PressStart2P_400Regular,
} from '@expo-google-fonts/press-start-2p';

import {
  Baloo2_400Regular,
  Baloo2_600SemiBold,
} from '@expo-google-fonts/baloo-2';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // load fonts
  const [loaded] = useFonts({
    PressStart2P_400Regular,
    Baloo2_400Regular,
    Baloo2_600SemiBold,
  });

  // Prevent UI from flashing unstyled text
  if (!loaded) return null;

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
