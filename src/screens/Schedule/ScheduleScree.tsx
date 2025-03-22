import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, Vibration } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  subscribeToTopic,
  unsubscribeFromTopic,
} from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { url } from 'components/url/page';
import { BusFront } from 'lucide-react-native';

export default function ScheduleScreen({ route }) {
  const { id } = route.params;
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState([23.8069, 90.3687]);
  const [placeName, setPlaceName] = useState('Loading location...');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const webViewRef = useRef(null);

  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) throw new Error('Failed to fetch place name');
      const data = await response.json();
      return data.display_name || 'Unknown location';
    } catch (error) {
      console.error('Error fetching place name:', error);
      return 'Unknown location';
    }
  };

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`${url}/api/bus/${id}`);
        if (!response.ok) throw new Error('Failed to fetch bus data');
        const data = await response.json();
        setBus(data);
        if (data.currentLatitude && data.currentLongitude) {
          const newPosition = [data.currentLatitude, data.currentLongitude];
          console.log('Initial position set:', newPosition);
          setPosition(newPosition);
          const name = await fetchPlaceName(data.currentLatitude, data.currentLongitude);
          setPlaceName(name);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bus data:', error);
      }
    };

    fetchBus();
  }, [id]);

  useEffect(() => {
    const getFcmTokenAndSubscribe = async () => {
      try {
        const messaging = getMessaging(getApp());
        const token = await getToken(messaging);
        setFcmToken(token);
        console.log('FCM token:', token);
        await subscribeToTopic(messaging, `bus-${id}`);
        console.log(`Subscribed to bus-${id} topic`);
      } catch (error) {
        console.error('Error getting FCM token or subscribing to topic:', error);
      }
    };

    getFcmTokenAndSubscribe();
  }, [id]);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      const subscribed = await AsyncStorage.getItem(`bus-${id}-notifications-subscribed`);
      setIsSubscribed(subscribed === 'true');
    };

    checkSubscriptionStatus();
  }, [id]);

  useEffect(() => {
    const messaging = getMessaging(getApp());
    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
      console.log('Foreground notification received:', remoteMessage);
      Vibration.vibrate();

      // Check if the message is from the relevant topic
      if (
        remoteMessage.from === `/topics/bus-${id}` ||
        remoteMessage.from === `/topics/bus-${id}-notifications`
      ) {
        const newLatitude = parseFloat(remoteMessage.data.currentLatitude);
        const newLongitude = parseFloat(remoteMessage.data.currentLongitude);

        if (!isNaN(newLatitude) && !isNaN(newLongitude)) {
          setBus((prevBus) => ({
            ...prevBus,
            currentLatitude: newLatitude,
            currentLongitude: newLongitude,
          }));
          const newPosition = [newLatitude, newLongitude];
          console.log('Position updated from FCM:', newPosition);
          setPosition(newPosition);

          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`
              if (window.marker) {
                window.marker.setLatLng([${newLatitude}, ${newLongitude}]);
                window.map.panTo([${newLatitude}, ${newLongitude}]);
              }
            `);
          }

          const name = await fetchPlaceName(newLatitude, newLongitude);
          setPlaceName(name);

          Toast.show({
            type: 'success',
            text1: 'Location Updated',
            text2: `Latitude: ${newLatitude}, Longitude: ${newLongitude}`,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 50,
          });

          console.log('Bus updated with new location:', newLatitude, newLongitude);
        } else {
          console.error('Invalid latitude/longitude received:', remoteMessage.data);
        }
      } else {
        console.log('Message ignored: Not for this bus ID');
      }
    });

    return unsubscribe;
  }, [id]);

  const handleNotificationSubscription = async () => {
    if (!fcmToken) {
      console.error('FCM token not available');
      return;
    }

    try {
      const messaging = getMessaging(getApp());
      if (isSubscribed) {
        await unsubscribeFromTopic(messaging, `bus-${id}-notifications`);
        await AsyncStorage.setItem(`bus-${id}-notifications-subscribed`, 'false');
        setIsSubscribed(false);
        console.log('Unsubscribed from bus notifications');
      } else {
        await subscribeToTopic(messaging, `bus-${id}-notifications`);
        await AsyncStorage.setItem(`bus-${id}-notifications-subscribed`, 'true');
        setIsSubscribed(true);
        console.log('Subscribed to bus notifications');
      }
    } catch (error) {
      console.error('Error handling notification subscription:', error);
    }
  };

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Live Bus Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          #map { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${position[0]}, ${position[1]}], 24);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          var marker = L.marker([${position[0]}, ${position[1]}]).addTo(map);
          window.map = map;
          window.marker = marker;
        </script>
      </body>
    </html>
  `;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <BusFront size={24} color="#000" />
          <Text style={styles.headerText}>বাসের সময়সূচি</Text>
        </View>
        <Text style={styles.subHeader}>বাস রুটের বিস্তারিত</Text>

        <Card style={styles.card}>
          <Card.Title title={`${bus.busNum}: ${bus.startPoint} → ${bus.endPoint}`} />
          <Card.Content>
            <Text style={styles.locationText}>Current Location: {placeName}</Text>

            <View style={styles.mapContainer}>
              <WebView
                ref={webViewRef}
                source={{ html: leafletHTML }}
                style={styles.map}
                scalesPageToFit={true}
                onLoad={() => {
                  webViewRef.current.injectJavaScript(`
                    window.marker.setLatLng([${position[0]}, ${position[1]}]);
                    window.map.panTo([${position[0]}, ${position[1]}]);
                  `);
                }}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleNotificationSubscription}
              style={[
                styles.subscribeButton,
                isSubscribed ? styles.unsubscribeButton : styles.subscribeButton,
              ]}>
              {isSubscribed ? 'Unsubscribe from Notifications' : 'Subscribe to Notifications'}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Bus Information" />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Start Point:</Text>
              <Text style={styles.infoValue}>{bus.startPoint}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>End Point:</Text>
              <Text style={styles.infoValue}>{bus.endPoint}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Schedule:</Text>
              <Text style={styles.infoValue}>{bus.schedule}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 16,
  },
  mapContainer: {
    height: 400,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
  },
  unsubscribeButton: {
    backgroundColor: '#F44336',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontWeight: 'bold',
  },
});
