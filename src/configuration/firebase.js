// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore"
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwf7-uRxg1ERhH6BWN43knWyPQGC2tavM",
  authDomain: "algorithmallies-react.firebaseapp.com",
  projectId: "algorithmallies-react",
  storageBucket: "algorithmallies-react.appspot.com",
  messagingSenderId: "1038160640620",
  appId: "1:1038160640620:web:3a1068fbcb87e9f5dbf649",
  measurementId: "G-125N9GKJKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);