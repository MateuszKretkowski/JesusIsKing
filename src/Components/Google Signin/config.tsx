// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { doc, onSnapshot, getFirestore, Timestamp, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKSENADRJbScBhkqtj0lafN6nVx5bXfVI",
  authDomain: "jesusisking-fb576.firebaseapp.com",
  databaseURL:
    "https://jesusisking-fb576-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jesusisking-fb576",
  storageBucket: "jesusisking-fb576.appspot.com",
  messagingSenderId: "402878700894",
  appId: "1:402878700894:web:dd7941f0b1b151a281c3cf",
  measurementId: "G-E027LNF97N",
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);

// AUTHENTICATION
const auth = getAuth(app);

export function signInWithGoogle() {
  return signInWithRedirect(auth, new GoogleAuthProvider());
}

interface User {
  id: string;
  name: string;
  description: string;
  link: string;
  from: string;
}

export function isUserLoggedIn() {
  const isLoggedIn = auth.currentUser !== null; // Jeśli currentUser istnieje, isLoggedIn = true
  console.log(isLoggedIn);
  return isLoggedIn;
}

export async function isUserAnAdmin() {
  const q = query(collection(db, "Users"), where("admin", "==", true));
  const querySnapshot = await getDocs(q);
  const adminUsers: string[] = [];

  querySnapshot.forEach((doc) => {
    adminUsers.push(doc.data().id);
  });
  return console.log(adminUsers);
}

export function signOutUser() {
  console.log(auth.currentUser);
  return auth.signOut();
}

// CLOUD FIRESTORE
const db = getFirestore(app);


// READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER
export function readUser(setUserData: (userData: User) => void) {
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const unsub = onSnapshot(
    doc(db, "Users", auth.currentUser ? auth.currentUser.uid : "none"),
    (doc) => {
      const data = doc.data();
      if (data) {
        const user: User = {
          id: userId,
          name: data.name || "",
          description: data.description || "",
          from: data.from || "",
          link: data.link || "",
        };
        setUserData(user);
        return user;
      } else {
        return console.log("User has no Values");
      };
    }
  );
}

// READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG
