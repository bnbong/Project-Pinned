import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCB9vHgpbHx5Uu9oYbeY7N-86BQOTmS8X0",
  authDomain: "project-pinned-84244.firebaseapp.com",
  projectId: "project-pinned-84244",
  storageBucket: "project-pinned-84244.appspot.com",
  messagingSenderId: "317205028283",
  appId: "1:317205028283:web:6b37c867037830ce58f89e",
  measurementId: "G-G1E1JBX2WR",
};

export const app = initializeApp(firebaseConfig);
export const messaging =
  typeof window !== "undefined" && typeof window.navigator !== "undefined"
    ? getMessaging(app)
    : null;
