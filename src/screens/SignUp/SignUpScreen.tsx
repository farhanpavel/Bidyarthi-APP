import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // You can add sign-up logic here (e.g., API call)

    // Navigate to the home screen after successful sign-up
    navigation.replace('AppTabs'); // This will navigate to the AppTabs after successful sign-up
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          width: 200,
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: 200,
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
        }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Go to Sign In" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
};

export default SignUpScreen;
