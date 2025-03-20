import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars'; // For calendar
import { ThumbsUp, CalendarCheck, Trophy } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { url } from 'components/url/page';

const { width, height } = Dimensions.get('window');

export default function InfoScreen({ navigation }) {
  const route = useRoute();
  const { id } = route.params;

  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [disabledEvents, setDisabledEvents] = useState(new Set());

  // Fetch club data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/api/club/event/data/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setClubData(data[0]);
        } else {
          setClubData(null);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Check if an event is disabled (already assigned)
  const checkEventFlag = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${url}/api/assign/${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flag status');
      }

      const data = await response.json();
      return data?.flag === true;
    } catch (error) {
      console.error('Error fetching flag:', error);
      return false;
    }
  };

  // Fetch flags for all events
  useEffect(() => {
    const fetchFlags = async () => {
      if (clubData?.club?.events) {
        const disabled = new Set();
        for (const event of clubData.club.events) {
          const isDisabled = await checkEventFlag(event.id);
          if (isDisabled) {
            disabled.add(event.id);
          }
        }
        setDisabledEvents(disabled);
      }
    };

    fetchFlags();
  }, [clubData]);

  // Handle button click for "Interested" or "Going"
  const handleButtonClick = async (eventId, status) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${url}/api/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          status,
          eventId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign event');
      }

      Alert.alert('Success', 'Successfully assigned!');
      setDisabledEvents((prev) => new Set(prev.add(eventId)));
    } catch (error) {
      console.error('Error assigning event:', error);
      Alert.alert('Error', 'Failed to assign event');
    }
  };

  // Format date to display in the event card
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', day: 'numeric' });
  };

  // Marked dates for the calendar
  const markedDates = {};
  if (clubData?.club?.events) {
    clubData.club.events.forEach((event) => {
      markedDates[event.date] = {
        marked: true, // Add a dot marker
        dotColor: '#7848F4', // Purple dot color
        selected: event.date === selectedDate, // Highlight selected date
        selectedColor: '#7848F4', // Purple highlight color
      };
    });
  }

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

  // Display no data found state
  if (!clubData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No data found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Club Banner */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: clubData.club.club_url }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>{clubData.club.name}</Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates} // Pass marked dates with dots and selected date
            theme={{
              calendarBackground: '#fff',
              selectedDayBackgroundColor: '#7848F4', // Purple highlight for selected date
              todayTextColor: '#7848F4', // Purple color for today's date
              arrowColor: '#7848F4', // Purple color for navigation arrows
              dotColor: '#7848F4', // Purple color for event dots
            }}
          />
        </View>

        {/* Events List */}
        <View style={styles.eventsContainer}>
          {clubData.club.events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              {/* Event Image */}
              <Image source={{ uri: event.url }} style={styles.eventImage} />

              {/* Event Details */}
              <View style={styles.eventDetails}>
                <View style={styles.eventDate}>
                  <Text style={styles.eventMonth}>{formatDate(event.date).split(' ')[0]}</Text>
                  <Text style={styles.eventDay}>{formatDate(event.date).split(' ')[1]}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.eventButtons}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.interestedButton,
                    disabledEvents.has(event.id) && styles.disabledInterestedButton,
                  ]}
                  onPress={() => handleButtonClick(event.id, 'interested')}
                  disabled={disabledEvents.has(event.id)}>
                  <ThumbsUp size={16} color="#fff" />
                  <Text style={styles.buttonText}>Interested</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.goingButton,
                    disabledEvents.has(event.id) && styles.disabledGoingButton,
                  ]}
                  onPress={() => handleButtonClick(event.id, 'going')}
                  disabled={disabledEvents.has(event.id)}>
                  <CalendarCheck size={16} color="#fff" />
                  <Text style={styles.buttonText}>Going</Text>
                </TouchableOpacity>
              </View>
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
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  calendarContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  eventsContainer: {
    margin: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventDetails: {
    flexDirection: 'row',
    padding: 16,
  },
  eventDate: {
    alignItems: 'center',
    marginRight: 16,
  },
  eventMonth: {
    fontSize: 14,
    color: '#7848F4',
    fontWeight: 'bold',
  },
  eventDay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Existing styles
  eventButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    padding: 6,
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
  },
  // Button styles for 'Interested' and 'Going' states
  interestedButton: {
    backgroundColor: '#34D399', // Green color for 'Interested'
  },
  goingButton: {
    backgroundColor: '#60A5FA', // Blue color for 'Going'
  },
  // Disabled button styles
  disabledButton: {
    backgroundColor: '#D1D5DB', // Light gray color when disabled
    opacity: 0.6, // Make the button appear faded
  },
  // Disabled state for the 'Interested' button
  disabledInterestedButton: {
    backgroundColor: '#D1E7D3', // Light greenish gray for disabled 'Interested'
    opacity: 0.6,
  },
  // Disabled state for the 'Going' button
  disabledGoingButton: {
    backgroundColor: '#B3CDE0', // Light bluish gray for disabled 'Going'
    opacity: 0.6,
  },
});
