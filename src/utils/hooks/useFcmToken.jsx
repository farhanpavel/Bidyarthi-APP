// hooks/useFcmToken.js
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { getToken } from 'firebase/messaging';
import firebaseApp from '../firebase/firebase';

const useFcmToken = () => {
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        if (!Device.isDevice) {
          console.log('Must use a physical device for Push Notifications');
          return;
        }

        const { status } = await Notifications.getPermissionsAsync();
        setNotificationPermissionStatus(status);

        if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          setNotificationPermissionStatus(newStatus);
          if (newStatus !== 'granted') {
            console.log('Permission not granted for notifications');
            return;
          }
        }

        // Retrieve the token
        const messaging = getMessaging(firebaseApp);
        const currentToken = await getToken(messaging, {
          vapidKey:
            'BELnc4UWGNhilawfUu4iv23Ex7-6e84JMRaMFHq4TDoburxwc1NefCOVL3gpz1xOH7MjnDcDUnI-xIrj-PvNz8E',
        });

        if (currentToken) {
          setToken(currentToken);
        } else {
          console.log('No registration token available.');
        }
      } catch (error) {
        console.error('Error retrieving FCM token:', error);
      }
    };

    registerForPushNotifications();
  }, []);

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
