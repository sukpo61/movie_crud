import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAv6jmIIhNnk7bMQNNj_GbLe0-mCdWp5kw",
  authDomain: "rn-movie-11f0e.firebaseapp.com",
  projectId: "rn-movie-11f0e",
  storageBucket: "rn-movie-11f0e.appspot.com",
  messagingSenderId: "163435972212",
  appId: "1:163435972212:web:340e590ea01616f1b2b321",
};

const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
