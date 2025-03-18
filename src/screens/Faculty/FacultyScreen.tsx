import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling
import { Calendar } from 'react-native-calendars'; // For calendar
import { Plus, Trash2, BookOpenText } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function FacultyScreen() {
  // Dummy data
  const [schedule, setSchedule] = useState({
    SUNDAY: 'No class',
    MONDAY: 'Class at 10 AM',
    TUESDAY: 'Class at 11 AM',
    WEDNESDAY: 'Class at 12 PM',
    THURSDAY: 'Class at 1 PM',
    FRIDAY: 'Class at 2 PM',
    SATURDAY: 'No class',
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [classOnDate, setClassOnDate] = useState(
    schedule[new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase()]
  );
  const [todolist, setTodolist] = useState([]);
  const [newTodo, setNewTodo] = useState('');

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

  // Handle file upload (dummy function)
  const handleFileUpload = () => {
    Alert.alert('Upload', 'Routine uploaded successfully!');
  };

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
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Text style={styles.uploadButtonText}>রুটিন আপলোড করুন</Text>
        </TouchableOpacity>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={handleDateClick}
            markedDates={{
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
