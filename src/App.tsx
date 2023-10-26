import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { styles, COLOURS } from './styles';
import { RegisterScreen } from './RegisterScreen';
import AcuMobProvider, { registerAcuMobEvent } from './AcuMobProvider';
import MainScreen from './MainScreen';

const Stack = createNativeStackNavigator();

// Example event registration
registerAcuMobEvent('incomingCall', obj =>
  console.debug('Incomming call: ', obj),
);

function AcuMobComScreen({ route }: any) {
  const {
    webRTCAccessKey,
    cloudRegionId,
    logLevel,
    registerClientId,
    webRTCToken,
  } = route.params;
  return (
    <View style={styles.container}>
      <AcuMobProvider
        logLevel={logLevel}
        webRTCToken={webRTCToken}
        cloudRegionId={cloudRegionId}
        webRTCAccessKey={webRTCAccessKey}
        registerClientId={registerClientId}>
        <MainScreen />
      </AcuMobProvider>
    </View>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: 'Registration',
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: COLOURS.BACKGROUND },
        }}
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AcuMobCom"
        component={AcuMobComScreen}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <AppStack />
    </NavigationContainer>
  );
};

export default App;
