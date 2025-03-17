import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from '../screens/SignIn/SignInScreen';
import SignUpScreen from '../screens/SignUp/SignUpScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ViewScreen from '../screens/View/ViewScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigator
const AppTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="View" component={ViewScreen} />
    </Tab.Navigator>
  );
};

// Stack Navigator for SignIn and SignUp flow
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        {/* After SignIn, show the Tab Navigator */}
        <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
