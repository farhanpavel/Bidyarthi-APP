import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps'; // For maps
import { BusFront } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling

const { width, height } = Dimensions.get('window');

export default function ScheduleScreen() {
  // Dummy data
  const [bus, setBus] = useState({
    busNum: '101',
    startPoint: 'Dhaka',
    endPoint: 'Chittagong',
    schedule: '14:30',
    currentLatitude: 23.8069,
    currentLongitude: 90.3687,
  });

  const [position, setPosition] = useState({
    latitude: bus.currentLatitude,
    longitude: bus.currentLongitude,
  });

  const [placeName, setPlaceName] = useState('Dhaka, Bangladesh');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Handle notification subscription
  const handleNotificationSubscription = () => {
    setIsSubscribed((prev) => !prev);
    console.log(isSubscribed ? 'Unsubscribed from notifications' : 'Subscribed to notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}

        {/* Bus Information Card */}
        <Card style={styles.card}>
          <Card.Title
            title={`${bus.busNum}: ${bus.startPoint} → ${bus.endPoint}`}
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            {/* Current Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Location</Text>
              <Text style={styles.placeName}>{placeName}</Text>
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: position.latitude,
                  longitude: position.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker
                  coordinate={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                  }}
                  pinColor="red"
                />
              </MapView>
            </View>

            {/* Notification Subscription Button */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleNotificationSubscription}
                style={[
                  styles.button,
                  isSubscribed ? styles.unsubscribeButton : styles.subscribeButton,
                ]}>
                <Text style={styles.buttonText}>
                  {isSubscribed ? 'Unsubscribe from Notifications' : 'Subscribe to Notifications'}
                </Text>
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Bus Details Card */}
        <Card style={styles.card}>
          <Card.Title title="Bus Information" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Start Point</Text>
              <Text style={styles.detailValue}>{bus.startPoint}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>End Point</Text>
              <Text style={styles.detailValue}>{bus.endPoint}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Schedule</Text>
              <Text style={styles.detailValue}>{bus.schedule}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
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
    color: '#4a4a4a',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 14,
    color: '#6b7280',
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
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    maxWidth: 400,
  },
  subscribeButton: {
    backgroundColor: '#10B981',
  },
  unsubscribeButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
