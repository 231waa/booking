// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ0HqeI56UdLDPzpcRXH37SjToSMo9Ngg",
  authDomain: "booking-d662a.firebaseapp.com",
  projectId: "booking-d662a",
  storageBucket: "booking-d662a.firebasestorage.app",
  messagingSenderId: "807562449425",
  appId: "1:807562449425:web:f90ced1669218f744d57b0",
  measurementId: "G-GS7MN3EBFV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);