// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, updateProfile, signInWithPopup, } from "firebase/auth"
import { getFirestore, Firestore, collection, doc, setDoc, addDoc, getDocs } from 'firebase/firestore';
import { useEffect } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKSENADRJbScBhkqtj0lafN6nVx5bXfVI",
  authDomain: "jesusisking-fb576.firebaseapp.com",
  databaseURL: "https://jesusisking-fb576-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jesusisking-fb576",
  storageBucket: "jesusisking-fb576.appspot.com",
  messagingSenderId: "402878700894",
  appId: "1:402878700894:web:dd7941f0b1b151a281c3cf",
  measurementId: "G-E027LNF97N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// AUTHENTICATION
const auth = getAuth(app);

export function signInWithGoogle() {
  return signInWithRedirect(auth, new GoogleAuthProvider()) + window.location.reload;
}

export function isUserLoggedIn() {
  const isLoggedIn = auth.currentUser !== null; // Jeśli currentUser istnieje, isLoggedIn = true
  console.log(isLoggedIn);
  return isLoggedIn;
}


export function signOutUser() {
  console.log(auth.currentUser)
  return auth.signOut() + window.location.reload();
}

// CLOUD FIRESTORE
const db = getFirestore(app);
const firestore = new Firestore();

export function readUsers() {
  const querySnapshot = getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

// FIREBASE FUNCTIONS

