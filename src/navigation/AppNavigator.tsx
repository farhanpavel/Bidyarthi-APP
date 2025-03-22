import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SignInScreen from '../screens/SignIn/SignInScreen';
import SignupScreen from '../screens/SignUp/SignUpScreen';
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
import PaymentScreen from '~/screens/Payment/PaymentScreen';
import PreOrderScreen from '~/screens/PreOrder/PreScreen';
import TrashScreen from '~/screens/Trash/TrashScreen';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import EmergencyPopup from '~/utils/Emergency/EmergencyPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationModal from '~/utils/Notifications/NotificationModal'; // Import the NotificationModal
import { useNotificationModalStore } from '~/utils/Notifications/store'; // Import the Zustand store
import { Vibration } from 'react-native';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for FoodScreen and OrderScreen
const FoodStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FoodScreen" component={FoodScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReqScreen" component={RequestScreen} options={{ headerShown: false }} />
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
      <Stack.Screen name="BusScreen" component={BusScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ScheduleScreen"
        component={ScheduleScree}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ClubStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClubScreen" component={ClubScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClubInfo" component={InfoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#E54981',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'help-circle';
          if (route.name === 'খাবার') iconName = 'food';
          else if (route.name === 'বাস') iconName = 'bus';
          else if (route.name === 'ক্লাব') iconName = 'account-group';
          else if (route.name === 'ফ্যাকালটি') iconName = 'school';
          else if (route.name === 'ইমেইল') iconName = 'email';
          else if (route.name === 'আবর্জনা') iconName = 'trash-can';
          else if (route.name === 'সেটিংস') iconName = 'cog';

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="খাবার" component={FoodStack} options={{ headerShown: false }} />
      <Tab.Screen name="বাস" component={BusStack} options={{ headerShown: false }} />
      <Tab.Screen name="ক্লাব" component={ClubStack} options={{ headerShown: false }} />
      <Tab.Screen name="ফ্যাকালটি" component={FacultyScreen} options={{ headerShown: false }} />
      <Tab.Screen name="ইমেইল" component={EmailScreen} options={{ headerShown: false }} />
      <Tab.Screen name="আবর্জনা" component={TrashScreen} options={{ headerShown: false }} />
      <Tab.Screen name="সেটিংস" component={SettingScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('You need to enable notifications in the app settings.');
    return;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }
}

const AppNavigator = () => {
  const [isEmergencyPopupVisible, setIsEmergencyPopupVisible] = useState(false);
  const [emergencyData, setEmergencyData] = useState({
    message: '',
    overlayText: '',
    instructions: '',
    emergencyLevel: 'MEDIUM',
  });

  const { setHasNewNotification } = useNotificationModalStore();

  // Handle incoming notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification received:', remoteMessage);
      Vibration.vibrate(); // Vibrate for 400ms (default)
      // Check if the notification is an emergency alert and the token exists
      const token = await AsyncStorage.getItem('token');
      if (remoteMessage.data?.topic === 'emergency' && token) {
        setEmergencyData({
          message: remoteMessage.data.message || 'Emergency Alert!',
          overlayText: remoteMessage.data.location || 'Emergency Area',
          instructions: remoteMessage.data.instructions || "Follow the authorities' instructions.",
          emergencyLevel: remoteMessage.data.emergencyLevel || 'MEDIUM',
        });
        setIsEmergencyPopupVisible(true); // Show the emergency popup
      }

      // Check if the notification is a regular notification and the token exists
      if (remoteMessage.data?.topic === 'announcement' && token) {
        setHasNewNotification(true); // Set new notification indicator
      }
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Handle background/quit state notifications
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background notification:', remoteMessage);

      // Check if the notification is an emergency alert and the token exists
      const token = await AsyncStorage.getItem('token');
      if (remoteMessage.data?.topic === 'emergency' && token) {
        setEmergencyData({
          message: remoteMessage.data.message || 'Emergency Alert!',
          overlayText: remoteMessage.data.location || 'Emergency Area',
          instructions: remoteMessage.data.instructions || "Follow the authorities' instructions.",
          emergencyLevel: remoteMessage.data.emergencyLevel || 'MEDIUM',
        });
        setIsEmergencyPopupVisible(true); // Show the emergency popup
      }

      // Check if the notification is a regular notification and the token exists
      if (remoteMessage.data?.topic === 'announcement' && token) {
        setHasNewNotification(true); // Set new notification indicator
      }
    });

    // Check for initial notification (app opened from quit state)
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        const token = await AsyncStorage.getItem('token');
        if (remoteMessage?.data?.topic === 'emergency' && token) {
          setEmergencyData({
            message: remoteMessage.data.message || 'Emergency Alert!',
            overlayText: remoteMessage.data.location || 'Emergency Area',
            instructions:
              remoteMessage.data.instructions || "Follow the authorities' instructions.",
            emergencyLevel: remoteMessage.data.emergencyLevel || 'MEDIUM',
          });
          setIsEmergencyPopupVisible(true); // Show the emergency popup
        }

        if (remoteMessage?.data?.topic === 'announcement' && token) {
          setHasNewNotification(true); // Set new notification indicator
        }
      });
  }, []);

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then((r) => console.log(r));
    messaging()
      .getToken()
      .then((token) => {
        console.log('FCM Token:', token);
      });
    messaging().onTokenRefresh((token) => {
      console.log('Refreshed FCM Token:', token);
    });
    messaging()
      .subscribeToTopic('emergency') // Subscribe to the emergency topic
      .then(() => console.log('Subscribed to emergency topic!'));
    messaging()
      .subscribeToTopic('announcement') // Subscribe to the notification topic
      .then(() => console.log('Subscribed to notification topic!'));
  }, []);

  return (
    <NavigationContainer>
      {/* Render the EmergencyPopup only if the token exists */}
      {isEmergencyPopupVisible && (
        <EmergencyPopup
          isVisible={isEmergencyPopupVisible}
          onClose={() => setIsEmergencyPopupVisible(false)}
          message={emergencyData.message}
          overlayText={emergencyData.overlayText}
          instructions={emergencyData.instructions}
          emergencyLevel={emergencyData.emergencyLevel}
        />
      )}

      {/* Render the NotificationModal */}
      <NotificationModal />

      {/* Existing Stack Navigator */}
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
