import React, { useState } from 'react';
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
import { Calendar } from 'react-native-calendars'; // For calendar
import { ThumbsUp, CalendarCheck } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function InfoScreen() {
  // Dummy data
  const [clubData, setClubData] = useState({
    club: {
      name: 'Programming Club',
      club_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYw_6XHK9xPkx-xoUunFjugcMbwVCYTVRHcg&s', // Replace with your image URL
      events: [
        {
          id: '1',
          name: 'Workshop on React Native',
          description: 'Learn React Native from scratch',
          date: '2023-10-15',
          url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYw_6XHK9xPkx-xoUunFjugcMbwVCYTVRHcg&s', // Replace with your image URL
        },
        {
          id: '2',
          name: 'Coding Competition',
          description: 'Participate and win exciting prizes',
          date: '2023-10-20',
          url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYw_6XHK9xPkx-xoUunFjugcMbwVCYTVRHcg&s', // Replace with your image URL
        },
        // Add more events as needed
      ],
    },
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [disabledEvents, setDisabledEvents] = useState(new Set()); // Track disabled events

  // Handle button click for "Interested" or "Going"
  const handleButtonClick = (eventId, status) => {
    console.log(`Event ID: ${eventId}, Status: ${status}`);
    setDisabledEvents((prev) => new Set(prev.add(eventId))); // Disable the button
  };

  // Format date to display in the event card
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', day: 'numeric' });
  };

  // Marked dates for the calendar
  const markedDates = {};
  clubData.club.events.forEach((event) => {
    markedDates[event.date] = { marked: true, dotColor: '#7848F4' };
  });

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
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, selectedColor: '#7848F4' },
            }}
            theme={{
              calendarBackground: '#fff',
              selectedDayBackgroundColor: '#7848F4',
              todayTextColor: '#7848F4',
              arrowColor: '#7848F4',
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
                  style={[styles.button, styles.interestedButton]}
                  onPress={() => handleButtonClick(event.id, 'interested')}
                  disabled={disabledEvents.has(event.id)}>
                  <ThumbsUp size={16} color="#fff" />
                  <Text style={styles.buttonText}>Interested</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.goingButton]}
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
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    elevation: 2,
  },
  eventsContainer: {
    padding: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  eventDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  eventButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  interestedButton: {
    backgroundColor: '#10B981',
  },
  goingButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
});
