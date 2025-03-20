// components/FCMWrapper.js
import React, { useEffect, useContext, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { getMessaging, onMessage } from 'firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseApp from '../firebase/firebase';
import useFcmToken from '../hooks/useFcmToken';
import Toast from 'react-native-toast-message';
import { MessageContext } from '../Context/messageContext';
import EmergencyPopup from '../Emergency/EmergencyPopup';
import NotificationModal from '../Notifications/NotificationModal';
import { useNotificationModalStore } from '../Notifications/store';
import { url } from 'components/url/page';

export function subscribeTokenToTopic(token, topic) {
  fetch(`${url}/api/user/subscribe-to-topic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, topic }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error subscribing to topic: ${response.status}`);
      }
      console.log(`Subscribed to "${topic}"`);
    })
    .catch((error) => console.error(error));
}

export function unsubscribeTokenFromTopic(token, topic) {
  fetch(`${url}/api/user/unsubscribe-from-topic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, topic }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error unsubscribing from topic: ${response.status}`);
      }
      console.log(`Unsubscribed from "${topic}"`);
    })
    .catch((error) => console.error(error));
}

const FCMWrapper = ({ children }) => {
  const { fcmToken } = useFcmToken();
  const { setMessage } = useContext(MessageContext);
  const { isNotificationModalOpen, closeNotificationModal } = useNotificationModalStore();

  const [isEmergencyPopupVisible, setIsEmergencyPopupVisible] = useState(false);
  const [emergencyData, setEmergencyData] = useState({
    message: '',
    overlayText: '',
    instructions: '',
  });

  // Request Notification Permissions
  useEffect(() => {
    const requestPermissions = async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== 'granted') {
            console.log('Notification permission denied.');
          }
        }
      } else {
        console.log('Must use a physical device for Push Notifications');
      }
    };

    requestPermissions();
  }, []);

  // Log the FCM Token and Subscribe to Topics
  useEffect(() => {
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      subscribeTokenToTopic(fcmToken, 'all');
      subscribeTokenToTopic(fcmToken, 'emergency');
      subscribeTokenToTopic(fcmToken, 'announcement');
      subscribeTokenToTopic(fcmToken, 'panic');
    }
  }, [fcmToken]);

  // Handle Foreground Notifications
  useEffect(() => {
    const messaging = getMessaging(firebaseApp);
    const unsubscribe = onMessage(messaging, async (payload) => {
      console.log('Foreground notification received:', payload);
      setMessage(payload);

      let showNotification = true;
      let role = await AsyncStorage.getItem('role');

      if (payload.data?.topic) {
        if (payload.data.topic === 'emergency' && role !== 'student') showNotification = false;
        if (payload.data.topic === 'announcement' && role !== 'student') showNotification = false;
        if (payload.data.topic === 'panic' && role !== 'admin') showNotification = false;
      }

      if (showNotification) {
        Toast.show({
          type: 'success',
          text1: payload.notification.title,
          text2: payload.notification.body,
          position: 'top',
          autoHide: true,
          visibilityTime: 3000,
        });
      } else {
        console.log('Notification not shown due to role mismatch.');
      }

      if (payload.data?.topic === 'emergency' && role === 'student') {
        setEmergencyData({
          message: payload.data.message || 'Emergency Alert!',
          overlayText: payload.data.location || 'Emergency Area',
          instructions: payload.data.message || "Follow the authorities' instructions.",
          emergencyLevel: payload.data.emergencyLevel || 'MEDIUM',
        });
        setIsEmergencyPopupVisible(true);
      }
    });

    return () => unsubscribe();
  }, [setMessage]);

  return (
    <>
      <Toast />
      <NotificationModal isOpen={isNotificationModalOpen} onClose={closeNotificationModal} />
      {isEmergencyPopupVisible && (
        <EmergencyPopup
          message={emergencyData.message}
          overlayText={emergencyData.overlayText}
          instructions={emergencyData.instructions}
          onClose={() => setIsEmergencyPopupVisible(false)}
        />
      )}
      {children}
    </>
  );
};

export default FCMWrapper;
