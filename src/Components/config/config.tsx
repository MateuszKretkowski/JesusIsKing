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
import {
  doc,
  onSnapshot,
  getFirestore,
  Timestamp,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
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

export async function readUserByUsername(username: string, setUserData: (userData: User) => void) {
  // Odkoduj nazwę użytkownika z URL
  const formattedUsername = decodeURIComponent(username).replace(/\+/g, ' ').trim();

  // Stwórz zapytanie do kolekcji 'Users', gdzie pole 'name' jest równe 'formattedUsername'
  const usersRef = collection(db, "Users");
  const q = query(usersRef, where("name", "==", formattedUsername));

  try {
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    if (querySnapshot.docs.length != 0) {
      // Zakładamy, że 'name' jest unikalne
      const userDoc = querySnapshot.docs[0];
      const userData: User = {
        id: userDoc.id,
        name: userDoc.data().name,
        description: userDoc.data().description,
        from: userDoc.data().from,
        link: userDoc.data().link,
      };
      console.log(`user found with the name: ${formattedUsername}`);
      setUserData(userData);
    } else {
      console.log(`No user found with the name: ${formattedUsername}`);
      const userData: User = {
        id: "-1",
        name: "-1",
        description: "-1",
        from: "-1",
        link: "-1",
      };
      setUserData(userData);
    }

  } catch (error) {
    console.error("Error fetching user data:", error);

  }
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
export const db = getFirestore(app);

// READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER
export function readUser(setUserData: (userData: User) => void) {
  const userId = auth.currentUser ? auth.currentUser.uid : "-1";

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
    const blogsCollectionRef = collection(db, "Blogs");
    // Utwórz zapytanie z sortowaniem po polu 'date' w porządku malejącym
    const q = query(blogsCollectionRef, orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);
    const blogs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("returned blogs: ", blogs);
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs: ", error);
    return [];
  }
}

export async function readPosts() {
  try {
    const postsCollectionRef = collection(db, "Posts");
    // Utwórz zapytanie z sortowaniem po polu 'date' w porządku malejącym
    const q = query(postsCollectionRef, orderBy("date"));

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),
    }));
    console.log("returned posts: ", posts);
    return posts;
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
}
// READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG READ BLOG
