import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { auth, onAuthStateChanged } from '../FirebaseConfig';

const RootLayout = () => {

  // State variables for user authentication and initialization
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  // Handle user authentication state changes
  const onAuthStateChangedHandler = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  // Listen for user authentication state changes
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthStateChangedHandler);
    return subscriber; 
  }, []);

  // Redirect user based on authentication state
  useEffect(() => {
    if (initializing) return; 

    const inAuthGroup = segments[0] === '(tabs)';

    if (user && !inAuthGroup) {
      router.replace('/(tabs)/discover');
    } else if (!user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default RootLayout;
