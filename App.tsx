import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css';
import { Provider as PaperProvider } from 'react-native-paper';
import { Image, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
