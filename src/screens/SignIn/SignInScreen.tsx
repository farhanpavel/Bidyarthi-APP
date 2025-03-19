import React, { useState } from 'react';
import { Image, View, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
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
        <Text className="text-center text-lg font-semibold">
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
            />
          </View>
        </View>

        {/* Error Message */}
        {error ? <Text className="mb-4 text-center text-red-500">{error}</Text> : null}

        <View className="mt-10 flex flex-row justify-center gap-x-3">
          <View>
            <Button
              mode="contained"
              onPress={handleSignIn}
              className="mb-4 w-[150px]"
              style={{ backgroundColor: '#E54981' }}>
              সাইন ইন
            </Button>
          </View>
          <View>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('SignUp')}
              className="mb-4 w-[150px]"
              textColor="#E54981"
              style={{
                borderColor: '#E54981',
                backgroundColor: 'white',
                borderWidth: 2,
              }}>
              সাইন আপ
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;
