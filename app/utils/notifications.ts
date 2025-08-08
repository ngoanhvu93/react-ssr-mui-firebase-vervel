import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../../firebase/firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      
      // Store the token in your database or use it as needed
      console.log("Notification permission granted. Token:", token);
      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

export const setupNotificationListener = () => {
  const messaging = getMessaging(app);
  
  onMessage(messaging, (payload) => {
    // Handle foreground messages here
    console.log("Received foreground message:", payload);
    
    // You can show a custom notification here if needed
    if (payload.notification) {
      new Notification(payload.notification.title || "New Notification", {
        body: payload.notification.body,
        icon: "/favicon.ico",
      });
    }
  });
}; 