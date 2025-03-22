import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Bell, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationModalStore } from '~/utils/Notifications/store';

export default function SettingScreen() {
  const { openNotificationModal, hasNewNotification, setHasNewNotification } =
    useNotificationModalStore();
  const navigation = useNavigation();

  // Handle logout action
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      console.log('User logged out');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Handle notification action
  const handleNotifications = async () => {
    console.log('Notifications clicked');
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setHasNewNotification(false);
      openNotificationModal();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Bell size={24} color="#E54981" />
        <Text style={styles.headerText}>সেটিংস</Text>
      </View>
      <Text style={styles.subHeader}>আপনার সেটিংস এখানে পরিচালনা করুন</Text>

      <ScrollView style={styles.scrollContainer}>
        {/* Notification Button */}
        <TouchableOpacity onPress={handleNotifications} style={styles.button}>
          <View style={styles.buttonContent}>
            <Bell size={24} style={styles.icon} />
            <Text style={styles.buttonText}>নোটিফিকেশন</Text>
            {hasNewNotification && <View style={styles.notificationMarker} />}
          </View>
          <IconButton icon="chevron-right" size={24} iconColor="#fff" />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <View style={styles.buttonContent}>
            <LogOut size={24} style={styles.icon} />
            <Text style={styles.buttonText}>লগআউট</Text>
          </View>
          <IconButton icon="chevron-right" size={24} iconColor="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
    color: '#E54981',
    marginLeft: 8,
  },
  subHeader: {
    fontSize: 14,
    color: '#', // Light gray for contrast
    borderBottomWidth: 2,
    borderBottomColor: '#E54981', // White underline
    paddingBottom: 8,
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff', // Dark gray button
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333', // Subtle gray border
    elevation: 4, // Shadow for depth
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
    color: 'black',
  },
  buttonText: {
    fontSize: 18,
    color: 'black', // White text
    fontWeight: '500',
  },
  notificationMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red', // White marker for notifications
    marginLeft: 8,
  },
});
