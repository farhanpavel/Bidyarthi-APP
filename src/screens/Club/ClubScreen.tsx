import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling
import { BookOpenText, Trophy, University } from 'lucide-react-native'; // Updated icon
import { useNavigation } from '@react-navigation/native';
import { url } from 'components/url/page';

const { width } = Dimensions.get('window');

export default function ClubScreen() {
  const navigation = useNavigation(); // Use the useNavigation hook
  const [clubs, setClubs] = useState([]); // State to store clubs
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch clubs from the backend
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${url}/api/club`);
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const data = await response.json();
        setClubs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Display loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Display error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  // Display no clubs found state
  if (clubs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No clubs found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <University size={24} color="#E54981" />
          <Text style={styles.headerText}>ক্লাব</Text>
        </View>
        <Text style={styles.subHeader}>সৃজনশীল ও সহশিক্ষা কার্যক্রমের তথ্য</Text>

        {/* Club Cards */}
        <View style={styles.grid}>
          {clubs.map((club) => (
            <View key={club.id} style={styles.card}>
              {/* Club Image */}
              <Image source={{ uri: club.club_url }} style={styles.cardImage} />

              {/* Club Name and Description */}
              <View style={styles.cardContent}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubDescription}>{club.description}</Text>
              </View>

              {/* Details Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ClubInfo', { id: club.id })}>
                <Text style={styles.buttonText}>বিস্তারিত দেখুন</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%', // Full width for each card
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 12,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  clubDescription: {
    fontSize: 14,
    color: '#E54981',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#E54981',
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
