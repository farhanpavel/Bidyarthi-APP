import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { Bell, LogOut } from 'lucide-react-native'; // Assuming you have lucide-react-native installed

export default function SettingScreen() {
  // Dummy profile picture URL
  const profilePicture =
    'https://www.shutterstock.com/image-photo/passport-photo-man-on-white-260nw-2538513719.jpg'; // Replace with your image URL

  // Handle logout action
  const handleLogout = () => {
    console.log('User logged out');
    // Add your logout logic here
  };

  // Handle notification action
  const handleNotifications = () => {
    console.log('Notifications clicked');
    // Add your notification logic here
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Profile Section */}
      <View className="mt-6 items-center">
        {/* Dummy Circle Profile Picture */}
        <Image
          source={{ uri: profilePicture }}
          className="h-48 w-48 rounded-full border-4 border-[#E54981]"
        />
        <Text className="mt-4 text-xl font-bold">John Doe</Text>
        <Text className="text-gray-600">john.doe@example.com</Text>
      </View>

      {/* Notification Button */}
      <TouchableOpacity
        onPress={handleNotifications}
        className="mt-8 flex-row items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <View className="flex-row items-center">
          <Bell className="mr-4 text-blue-600" />
          <Text className="text-lg">Notifications</Text>
        </View>
        <IconButton icon="chevron-right" size={20} />
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mt-4 flex-row items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <View className="flex-row items-center">
          <LogOut className="mr-4 text-red-600" />
          <Text className="text-lg">Logout</Text>
        </View>
        <IconButton icon="chevron-right" size={20} />
      </TouchableOpacity>
    </ScrollView>
  );
}
