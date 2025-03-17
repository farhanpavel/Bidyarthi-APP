import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css';
import { Provider as PaperProvider } from 'react-native-paper';
export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
