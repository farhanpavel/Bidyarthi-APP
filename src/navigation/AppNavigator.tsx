import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SignInScreen from '../screens/SignIn/SignInScreen';

import FoodScreen from '~/screens/Food/FoodScreen';
import BusScreen from '~/screens/Bus/BusScreen';
import ClubScreen from '~/screens/Club/ClubScreen';
import FacultyScreen from '~/screens/Faculty/FacultyScreen';
import EmailScreen from '~/screens/Email/EmailScreen';
import SettingScreen from '~/screens/Settings/SettingScreen';
import OrderScreen from '~/screens/Order/OrderScreen';
import RequestScreen from '~/screens/Requested/RequestScreen';
import ScheduleScree from '~/screens/Schedule/ScheduleScree';
import InfoScreen from '~/screens/ClubInfo/InfoScreen';
import SignupScreen from '../screens/SignUp/SignUpScreen';
import PaymentScreen from '~/screens/Payment/PaymentScreen';
import PreOrderScreen from '~/screens/PreOrder/PreScreen';

import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for FoodScreen and OrderScreen
const FoodStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FoodScreen"
        component={FoodScreen}
        options={{ headerShown: false }} // Hide header for FoodScreen
      />
      <Stack.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={{ headerShown: false }} // Hide header for OrderScreen
      />
      <Stack.Screen
        name="ReqScreen"
        component={RequestScreen}
        options={{ headerShown: false }} // Hide header for OrderScreen
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="PreOrderScreen"
        component={PreOrderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const BusStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BusScreen"
        component={BusScreen}
        options={{ headerShown: false }} // Hide header for FoodScreen
      />
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScree}
        options={{ headerShown: false }} // Hide header for OrderScreen
      />
    </Stack.Navigator>
  );
};
const ClubStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClubScreen"
        component={ClubScreen}
        options={{ headerShown: false }} // Hide header for FoodScreen
      />
      <Stack.Screen
        name="ClubInfo"
        component={InfoScreen}
        options={{ headerShown: false }} // Hide header for OrderScreen
      />
    </Stack.Navigator>
  );
};
const AppTabs = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#E54981', // Set the active icon color
        tabBarInactiveTintColor: 'gray', // Optional: Set inactive icon color
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'help-circle';
          if (route.name === 'খাবার') iconName = 'food';
          else if (route.name === 'বাস') iconName = 'bus';
          else if (route.name === 'ক্লাব') iconName = 'account-group';
          else if (route.name === 'ফ্যাকালটি') iconName = 'school';
          else if (route.name === 'ইমেইল') iconName = 'email';
          else if (route.name === 'সেটিংস') iconName = 'cog';

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="খাবার" component={FoodStack} options={{ headerShown: false }} />
      <Tab.Screen name="বাস" component={BusStack} options={{ headerShown: false }} />
      <Tab.Screen name="ক্লাব" component={ClubStack} options={{ headerShown: false }} />
      <Tab.Screen name="ফ্যাকালটি" component={FacultyScreen} options={{ headerShown: false }} />
      <Tab.Screen name="ইমেইল" component={EmailScreen} options={{ headerShown: false }} />
      <Tab.Screen name="সেটিংস" component={SettingScreen} />
    </Tab.Navigator>
  );
};


async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("You need to enable notifications in the app settings.");
    return;
  }
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("default", {
      name: "default notifications",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default"
    });
}

// Stack Navigator for SignIn and SignUp flow
const AppNavigator = () => {

  //FCM
  useEffect(() => {
    registerForPushNotificationsAsync().then((r) => console.log(r));
    messaging()
      .getToken()
      .then((token) => {
        console.log(token);
      });
    messaging().onTokenRefresh((token) => {
      console.log(token);
    });
    messaging()
      .subscribeToTopic("test")
      .then(() => console.log("Subscribed to topic!"));

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    return messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
