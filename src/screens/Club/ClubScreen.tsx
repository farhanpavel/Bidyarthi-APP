import React from 'react';
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
import { Trophy } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ClubScreen() {
  const navigation = useNavigation(); // Use the useNavigation hook

  const clubs = [
    {
      id: '1',
      name: 'Programming Club',
      description: 'Learn and grow together',
      club_url:
        'https://media.istockphoto.com/id/1480105317/photo/close-up-image-of-basketball-ball-over-floor-in-the-gym-orange-basketball-ball-on-wooden.jpg?s=612x612&w=0&k=20&c=KYFwwRySq_M3ej2KkHQuZcWvR6BaqwuOIkuZGadK-YM=', // Replace with your image URL
    },
    {
      id: '2',
      name: 'Sports Club',
      description: 'Stay fit and have fun',
      club_url:
        'https://cdn.britannica.com/55/235355-050-2CE9732E/Usain-Bolt-Jamaica-gold-medal-breaking-world-record-200m-Beijing-Summer-Olympics-August-20-2008.jpg', // Replace with your image URL
    },
    {
      id: '3',
      name: 'Music Club',
      description: 'Explore the world of music',
      club_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5JDVeSMirXBLqzarX09Lf34j3FrXJX8EG4w&s', // Replace with your image URL
    },
    // Add more dummy data as needed
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}

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
                onPress={() => navigation.navigate('ClubInfo')}>
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
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%', // Two cards per row with some spacing
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
