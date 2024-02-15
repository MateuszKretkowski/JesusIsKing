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
import { doc, onSnapshot, getFirestore, Timestamp, getDoc, collection, query, where, getDocs, orderBy, } from "firebase/firestore";
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
export const auth = getAuth(app);

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  
  signInWithPopup(auth, provider).then((result) => {
    // Token ID można uzyskać z obiektu result.user
    result.user.getIdToken().then((idToken) => {
      // Tutaj wysyłasz token ID do backendu
      fetch('/sessionLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
        credentials: 'include', // potrzebne do wysyłania cookies
      }).then(response => {
        // Możesz tutaj obsłużyć odpowiedź od serwera
        console.log('Session login response', response);
      }).catch(error => {
        // Obsługa błędów po stronie sieci
        console.error('Session login error', error);
      });
    }).catch(error => {
      // Obsługa błędów getIdToken
      console.error('Get ID Token error', error);
    });
  }).catch((error) => {
    // Obsługa błędów signInWithPopup
    console.error('Sign in with Google error', error);
  });
}

interface User {
  id: string;
  name: string;
  description: string;
  link: string;
  from: string;
}

export async function isUserLoggedIn(req:any, res:any, next:any) {
  const sessionCookie = req.cookies.session || '';
  
  try {
    // Weryfikacja tokena sesji
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    // Jeśli weryfikacja nie powiedzie się, możesz wylogować użytkownika,
    // przekierować na stronę logowania, lub zwrócić błąd
    res.status(401).send('You are not authorized');
  }
};

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


export async function readBlogs() {
  try {
    const blogsCollectionRef = collection(db, 'Blogs');
    // Utwórz zapytanie z sortowaniem po polu 'date' w porządku malejącym
    const q = query(blogsCollectionRef, orderBy('date', 'desc'));

    const querySnapshot = await getDocs(q);
    const blogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("returned blogs: ", blogs);
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs: ", error);
    return [];
  }
};

// READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG
