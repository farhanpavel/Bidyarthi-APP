import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling
import { Calendar } from 'react-native-calendars'; // For calendar
import { Plus, Trash2, BookOpenText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker'; // For image upload
import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage
import { url } from 'components/url/page'; // Your API URL

const { width, height } = Dimensions.get('window');

export default function FacultyScreen() {
  const [schedule, setSchedule] = useState({}); // Initialize as empty object
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [classOnDate, setClassOnDate] = useState('No class scheduled for this date.');
  const [todolist, setTodolist] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false); // For loading state

  useEffect(() => {
    // Request media library and camera permissions
    const requestPermissions = async () => {
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

      if (mediaLibraryStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'You need to grant permission to access media and camera.'
        );
      }
    };

    requestPermissions();
  }, []);

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date.dateString);
    const day = new Date(date.dateString)
      .toLocaleString('en-US', { weekday: 'long' })
      .toUpperCase();
    setClassOnDate(schedule[day] || 'No class scheduled for this date.');
  };

  // Handle adding a new to-do
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodolist([...todolist, { id: Date.now().toString(), task: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  // Handle toggling a to-do
  const handleToggleTodo = (id) => {
    setTodolist(
      todolist.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  // Handle deleting a to-do
  const handleDeleteTodo = (id) => {
    setTodolist(todolist.filter((todo) => todo.id !== id));
  };

  // Handle image upload
  const handleFileUpload = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibraryAsync(options).then(async (response) => {
      if (response.cancelled) {
        Alert.alert('Cancelled', 'Image selection was cancelled.');
      } else if (response.error) {
        Alert.alert('Error', 'Failed to select image.');
      } else {
        const imageUri = response.assets[0].uri;
        setLoading(true);

        try {
          // Upload the image to the backend
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }

          const formData = new FormData();
          formData.append('routineImage', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'routine.jpg',
          });

          const uploadResponse = await fetch(`${url}/api/routine/extract-routine`, {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image');
          }

          const data = await uploadResponse.json();

          // Save the extracted schedule
          const saveResponse = await fetch(`${url}/api/routine/save`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              userId: 'currentUserId', // Replace with actual user ID
              schedule: data.schedule,
            }),
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save schedule');
          }

          // Update the schedule state
          setSchedule(data.schedule);
          Alert.alert('Success', 'Routine uploaded and processed successfully!');
        } catch (error) {
          console.error('Error uploading routine:', error);
          Alert.alert('Error', 'Failed to upload routine. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Marked dates for the calendar (entire year)
  const markedDates = {};
  if (Object.keys(schedule).length > 0) {
    const currentYear = new Date().getFullYear(); // Get the current year
    const startDate = new Date(currentYear, 0, 1); // Start from January 1st of the current year
    const endDate = new Date(currentYear, 11, 31); // End at December 31st of the current year

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const day = date.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
      if (schedule[day] && schedule[day] !== 'No class') {
        markedDates[date.toISOString().split('T')[0]] = {
          marked: true,
          dotColor: '#E54981', // Purple dot for days with classes
        };
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <BookOpenText size={24} color="#E54981" />
          <Text style={styles.headerText}>ফ্যাকালটি</Text>
        </View>
        <Text style={styles.subHeader}>শিক্ষামূলক কার্যক্রমের তথ্য</Text>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload} disabled={loading}>
          <Text style={styles.uploadButtonText}>
            {loading ? 'Processing...' : 'রুটিন আপলোড করুন'}
          </Text>
        </TouchableOpacity>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={handleDateClick}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, selectedColor: '#E54981' },
            }}
            theme={{
              calendarBackground: '#fff',
              selectedDayBackgroundColor: '#E54981',
              todayTextColor: '#E54981',
              arrowColor: '#E54981',
            }}
          />
        </View>

        {/* Class Details */}
        <View style={styles.classDetails}>
          <Text style={styles.classDate}>{new Date(selectedDate).toDateString()}</Text>
          <Text style={styles.classInfo}>{classOnDate}</Text>
        </View>

        {/* To-Do List */}
        <View style={styles.todoContainer}>
          <Text style={styles.todoHeader}>আপনার কাজগুলোর পরিকল্পনা করুন</Text>
          <View style={styles.todoInputContainer}>
            <TextInput
              style={styles.todoInput}
              placeholder="নতুন কাজ যোগ করুন"
              value={newTodo}
              onChangeText={setNewTodo}
              onSubmitEditing={handleAddTodo}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* To-Do Items */}
          {todolist.map((todo) => (
            <View key={todo.id} style={styles.todoItem}>
              <TouchableOpacity onPress={() => handleToggleTodo(todo.id)}>
                <Text style={[styles.todoText, todo.completed && styles.completedTodo]}>
                  {todo.task}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)}>
                <Trash2 size={20} color="#E54981" />
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
  uploadButton: {
    backgroundColor: '#E54981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  classDetails: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  classDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E54981',
    marginBottom: 8,
  },
  classInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  todoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  todoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E54981',
    marginBottom: 16,
  },
  todoInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  todoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E54981',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#E54981',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  todoText: {
    fontSize: 16,
    color: '#000',
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
});
