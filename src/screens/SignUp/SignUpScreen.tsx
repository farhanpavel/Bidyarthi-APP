import React, { useState } from 'react';
import { Image, View, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing tokens
import '../../../global.css';
import { url } from 'components/url/page';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    setError('');
    setPasswordMismatch(false);

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      setError('পাসওয়ার্ড মেলেনি');
      return;
    }

    try {
      const response = await fetch(`${url}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'student', // Default role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }

      console.log('Registration successful:', data);

      // Show success message and navigate to sign-in page
      Alert.alert('সফল', 'রেজিস্ট্রেশন সফল হয়েছে', [
        {
          text: 'ঠিক আছে',
          onPress: () => navigation.replace('SignIn'), // Navigate to sign-in page
        },
      ]);
    } catch (err) {
      setError(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
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
          বিদ্যার্থী অ্যাপে আপনাকে স্বাগতম, দয়া করে সাইন আপ করুন।
        </Text>
      </View>

      {/* Sign Up Form */}
      <View className="w-full rounded-lg bg-white">
        <View className="flex flex-col gap-y-4">
          <View>
            <TextInput
              label="নাম"
              value={name}
              onChangeText={setName}
              mode="outlined"
              className="mb-4"
              activeOutlineColor="#E54981"
              outlineColor="#E54981"
              outlineStyle={{ borderWidth: 2 }}
            />
          </View>
          <View>
            <TextInput
              label="ইমেইল"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              className="mb-4"
              activeOutlineColor="#E54981"
              outlineColor="#E54981"
              outlineStyle={{ borderWidth: 2 }}
            />
          </View>
          <View>
            <TextInput
              label="পাসওয়ার্ড"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              className="mb-4"
              activeOutlineColor="#E54981"
              outlineColor="#E54981"
              outlineStyle={{ borderWidth: 2 }}
            />
          </View>
          <View>
            <TextInput
              label="কনফার্ম পাসওয়ার্ড"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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

        {/* Create Button */}
        <View className="mt-10 flex flex-col justify-center gap-x-3">
          <View>
            <Button
              mode="contained"
              onPress={handleSignUp}
              className="mb-4"
              style={{ backgroundColor: '#E54981', borderRadius: 4 }}>
              তৈরি করুন
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;
