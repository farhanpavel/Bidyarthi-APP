import React, { useState } from 'react';
import { Image, View, Text } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import '../../../global.css';
const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    navigation.replace('AppTabs');
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
        <Text className=" *: text-center text-lg font-semibold">
          বিদ্যার্থী অ্যাপে আপনাকে স্বাগতম, দয়া করে সাইন ইন করুন।
        </Text>
      </View>

      {/* Sign In Form */}
      <View className="w-full rounded-lg bg-white ">
        <View className="flex flex-col gap-y-4">
          <View>
            <TextInput
              label="ইমেইল"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              className="mb-4 "
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

        <View className="mt-10 flex flex-row justify-center gap-x-3">
          <View>
            <Button
              mode="contained"
              onPress={handleSignIn}
              className="mb-4 w-[150px]"
              style={{ backgroundColor: '#E54981' }} // Use the style prop to apply background color
            >
              সাইন ইন
            </Button>
          </View>
          <View>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('SignUp')} // Navigate to SignUp page
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
