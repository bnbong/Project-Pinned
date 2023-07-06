import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging();
// Add the public key generated from the console here.
export default getFCM = getToken(messaging, { vapidKey: process.env.vapidKey });
