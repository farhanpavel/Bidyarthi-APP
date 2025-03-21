import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling
import { BusFront, Map, Users, DollarSign, Bus } from 'lucide-react-native';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { url } from 'components/url/page';

const { width } = Dimensions.get('window');

export default function BusDashboard() {
  const navigation = useNavigation();
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`${url}/api/bus`);
        if (!response.ok) {
          throw new Error('Failed to fetch buses');
        }
        const data = await response.json();
        setBuses(data);
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    fetchBuses();
  }, []);

  // Helper function to calculate time difference
  const getTimeDifferenceInMinutes = (departureTime) => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const [departureHours, departureMinutes] = departureTime.split(':').map(Number);

    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const departureTotalMinutes = departureHours * 60 + departureMinutes;

    return departureTotalMinutes - currentTotalMinutes;
  };

  // Filter buses
  const busesDepartingSoon = buses.filter((bus) => {
    const timeDifference = getTimeDifferenceInMinutes(bus.schedule);
    return timeDifference > 0 && timeDifference <= 30; // Departing within 30 minutes
  });

  const moreBuses = buses.filter((bus) => {
    const timeDifference = getTimeDifferenceInMinutes(bus.schedule);
    return timeDifference > 30; // Departing after 30 minutes
  });

  const busesDeparted = buses.filter((bus) => {
    const timeDifference = getTimeDifferenceInMinutes(bus.schedule);
    return timeDifference < 0; // Already departed
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Bus size={24} color="#E54981" />
          <Text style={styles.headerText}>বাসের সময়সূচি</Text>
        </View>
        <Text style={styles.subHeader}>বাস রুটের বিস্তারিত</Text>

        {/* Buses Departing Soon */}
        <Text style={styles.sectionTitle}>৩০ মিনিট পর প্রস্থান হবে</Text>
        {busesDepartingSoon.map((bus) => (
          <Card key={bus.id} style={styles.card}>
            <Image source={{ uri: bus.bus_url }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.routeName}>
                {bus.startPoint} → {bus.endPoint}
              </Text>
              <Text style={styles.busNum}>বাস নম্বর: {bus.busNum}</Text>
              <Text style={styles.schedule}>প্রস্থান সময়: {bus.schedule}</Text>
            </View>
          </Card>
        ))}

        {/* More Buses */}
        <Text style={styles.sectionTitle}>আরও বাস</Text>
        {moreBuses.map((bus) => (
          <Card key={bus.id} style={styles.card}>
            <Image source={{ uri: bus.bus_url }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.routeName}>
                {bus.startPoint} → {bus.endPoint}
              </Text>
              <Text style={styles.busNum}>বাস নম্বর: {bus.busNum}</Text>
              <Text style={styles.schedule}>প্রস্থান সময়: {bus.schedule}</Text>
            </View>
          </Card>
        ))}

        {/* Departed Buses */}
        <Text style={styles.sectionTitle}>প্রস্থান করা বাসসমূহ</Text>
        {busesDeparted.map((bus) => (
          <Card key={bus.id} style={styles.card}>
            <Image source={{ uri: bus.bus_url }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.routeName}>
                {bus.startPoint} → {bus.endPoint}
              </Text>
              <Text style={styles.busNum}>বাস নম্বর: {bus.busNum}</Text>
              <Text style={styles.schedule}>প্রস্থান সময়: {bus.schedule}</Text>
              <View style={styles.departedOverlay}>
                <Text style={styles.departedText}>প্রস্থান করেছে</Text>
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => navigation.navigate('ScheduleScreen', { id: bus.id })} // Navigate to TrackBus screen
                >
                  <Text style={styles.trackButtonText}>ট্র্যাক করুন</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}
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
    textAlign: 'center',
    color: '#E54981',
  },
  subHeader: {
    fontSize: 14,
    color: '#4a4a4a',
    borderBottomWidth: 2,
    borderBottomColor: '#E54981',
    paddingBottom: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#E54981',
    paddingBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  busNum: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  schedule: {
    fontSize: 14,
    color: '#6b7280',
  },
  departedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  departedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  trackButton: {
    backgroundColor: '#E54981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
