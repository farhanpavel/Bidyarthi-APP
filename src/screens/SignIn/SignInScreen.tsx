import React, { useState } from 'react';
import { Image, View, Text, Alert } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing tokens
import '../../../global.css';
import { url } from 'components/url/page';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSignIn = async () => {
    setError(''); // Clear any previous errors

    try {
      const response = await fetch(`${url}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and role to AsyncStorage
      await AsyncStorage.setItem('token', data.token.accessToken);
      await AsyncStorage.setItem('role', data.role);

      console.log('Login successful:', data);

      // Navigate based on role
      if (data.role === 'student') {
        navigation.replace('AppTabs'); // Navigate to the Home page (FoodStack)
      } else {
        // Handle other roles if needed
        Alert.alert('Success', 'Login successful, but no specific role navigation defined.');
      }
    } catch (err) {
      setError(err.message || 'Wrong username or password');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      {/* Logo */}
      <View className="mb-8 flex items-center">
        <Image
          source={require('../../../assets/logo.jpg')}
          className="h-44 w-44"
          resizeMode="contain"
        />
        <Text className="text-center text-lg font-medium">
          বিদ্যার্থী অ্যাপে আপনাকে স্বাগতম, দয়া করে সাইন ইন করুন।
        </Text>
      </View>

      {/* Sign In Form */}
      <View className="w-full rounded-lg bg-white">
        <View className="flex flex-col gap-y-4">
          <View>
            <TextInput
              label="ইমেইল"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              className="mb-4"
              activeOutlineColor="#E54981"
              outlineColor="#E54981"
              outlineStyle={{ borderWidth: 2 }} // Increase border width to 2 (or your desired value)
            />
          </View>
          <View>
            <TextInput
              label="পাসওয়ার্ড"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              className="mb-6"
              activeOutlineColor="#E54981"
              outlineColor="#E54981"
              outlineStyle={{ borderWidth: 2 }}
            />
          </View>
        </View>

        {/* Error Message */}
        {error ? <Text className="mb-4 text-center text-red-500">{error}</Text> : null}

        <View className="mt-10 flex flex-col">
          <View>
            <Button
              mode="contained"
              onPress={handleSignIn}
              contentStyle={{ borderRadius: 0 }}
              style={{ backgroundColor: '#E54981', borderRadius: 4 }}>
              সাইন ইন
            </Button>
          </View>

          {/* Divider */}
          <View className="mx-auto mt-7 w-[87%]">
            <Divider style={{ backgroundColor: '#E54981', height: 2 }} />
          </View>

          {/* Register Prompt */}
          <View className="mt-2 flex-row items-center justify-center">
            <Text className="text-gray-600">নতুন অ্যাকাউন্ট তৈরি করতে চান?</Text>
            <Button mode="text" onPress={() => navigation.navigate('SignUp')} textColor="#E54981">
              রেজিস্টার
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;
