import messaging from "@react-native-firebase/messaging";
import { AppRegistry } from "react-native";
import * as Notifications from "expo-notifications";
import ReactApp from "App";

// Polyfill global URL and URLSearchParams
global.URL = URL;
global.URLSearchParams = URLSearchParams;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});


// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);

});


// Register the main application component
AppRegistry.registerComponent("main", () => ReactApp);