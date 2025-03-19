import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling

const PaymentScreen = ({ route }) => {
  const { url } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: url }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes('http://192.168.0.104:4000/api/ssl/success')) {
            // Payment success, navigate to RequestScreen (ReqScreen)
            navigation.replace('ReqScreen');
          } else if (navState.url.includes('http://192.168.0.104:4000/api/ssl/failure')) {
            // Payment failure, navigate back to FoodScreen or show an error
            navigation.goBack(); // Go back to the previous screen
          }
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
});
export default PaymentScreen;
