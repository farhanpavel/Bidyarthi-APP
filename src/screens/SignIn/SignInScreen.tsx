import React, { useState } from 'react';
import { Image, View, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';

const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    navigation.replace('AppTabs');
  };

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Image
        source={require('../../assets/favicon.png')} // Correct way to load image from assets
        className="mb-8 h-40 w-40"
      />

      <Card className="w-full rounded-lg p-6">
        <Title className="mb-4 text-center text-xl font-semibold">Sign In</Title>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          className="mb-4"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          className="mb-4"
        />

        <Button mode="contained" onPress={handleSignIn} className="mb-4">
          Sign In
        </Button>

        <Button mode="text" onPress={() => navigation.navigate('SignUp')} className="self-center">
          Go to Sign Up
        </Button>
      </Card>
    </View>
  );
};

export default SignInScreen;
