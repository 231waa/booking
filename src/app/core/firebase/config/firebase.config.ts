import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJ0HqeI56UdLDPzpcRXH37SjToSMo9Ngg",
  authDomain: "booking-d662a.firebaseapp.com",
  projectId: "booking-d662a",
  storageBucket: "booking-d662a.firebasestorage.app",
  messagingSenderId: "807562449425",
  appId: "1:807562449425:web:f90ced1669218f744d57b0",
  measurementId: "G-GS7MN3EBFV"
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
