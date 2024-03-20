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
  getRedirectResult,
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
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { setCookie } from "../../utils/cookieUtils";
import { firestore } from "firebase-admin";
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
  const auth = getAuth();
  signInWithRedirect(auth, new GoogleAuthProvider());
}

export function saveUserTokenToFirestore(userToken: any) {
  if (!auth.currentUser) return;
  const userRef = doc(db, "Users", )
}

interface User {
  id: string;
  name: string;
  description: string;
  link: string;
  from: string;
  uniqueId: string;
}

export function isUserLoggedIn() {
  const isLoggedIn = auth.currentUser !== null; // Jeśli currentUser istnieje, isLoggedIn = true
  return isLoggedIn;
}

export async function checkIfUserExistsById(userId: string): Promise<boolean> {
  const userRef = doc(db, "Users", userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists(); // This will return true if the document exists, false otherwise
}

export async function readUserByUsername(uniqueId: string, setUserData: (userData: User) => void) {
  // Decode the uniqueId from URL
  const formattedUniqueId = decodeURIComponent(uniqueId).replace(/\+/g, ' ').trim();

  // Create a query to the 'Users' collection where the 'uniqueId' field matches 'formattedUniqueId'
  const usersRef = collection(db, "Users");
  const q = query(usersRef, where("uniqueId", "==", formattedUniqueId));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length != 0) {
      // We assume that 'uniqueId' is unique
      const userDoc = querySnapshot.docs[0];
      const userData: User = {
        id: userDoc.id,
        name: userDoc.data().name,
        description: userDoc.data().description,
        from: userDoc.data().from,
        link: userDoc.data().link,
        uniqueId: userDoc.data().uniqueId, // Add this line to include the uniqueId in the user data
      };
      setUserData(userData);
    } else {
      const userData: User = {
        id: "-1",
        name: "-1",
        description: "-1",
        from: "-1",
        link: "-1",
        uniqueId: "-1", // Add this line to include the uniqueId in the user data
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
}

export function signOutUser() {
  return auth.signOut();
}

// CLOUD FIRESTORE
export const db = getFirestore(app);

// READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER READ USER
export function readUser(setUserData: (userData: User) => void) {
  const userId = auth.currentUser ? auth.currentUser.email : "-1";
  if (auth.currentUser) {

    const unsub = onSnapshot(
      doc(db, "Users", auth.currentUser.email ? auth.currentUser.email : "none"),
      (doc) => {
        const data = doc.data();
        if (data) {
          const user: User = {
            id: userId,
            email: data.email || "",
            name: data.name || "",
            uniqueId: data.uniqueId || "",
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
      id: doc.id,
      ...doc.data(),
    }));
    return posts;
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
}

export async function likeAPost(postId: string) {
  const postRef = doc(db, "Posts", postId);
  const postDoc = await getDoc(postRef);
  const userEmail = auth.currentUser?.email || "none";
  const userRef = doc(db, "Users", userEmail);
  
  if (postDoc.exists()) {
    const postData = postDoc.data();
    const authorRef = doc(db, "Users", postData.authorEmail || "none");
    const authorDoc = await getDoc(authorRef);
    const authorData = authorDoc.data();
    
    // Sprawdź, czy użytkownik już polubił post
    if (authorData?.notifications?.likes?.[userEmail]) {
      // Użytkownik już polubił ten post, nie rób nic
      return;
    }

    // Użytkownik nie polubił tego posta, zwiększ liczbę polubień i zaktualizuj powiadomienia
    const likes = postData?.numberOfLikes || 0;
    await setDoc(postRef, { numberOfLikes: likes + 1 }, { merge: true });
    const notificationsUpdate = {
      [`notifications.likes.${userEmail}`]: postId
    };
    if (authorData?.notifications?.likes) {
    await updateDoc(authorRef, notificationsUpdate);
    } else {
      await setDoc(authorRef, { notifications: { likes: { [userEmail]: postId } } }, { merge: true });
    }
  }
}

export async function unlikeAPost(postId: string) {
  const postRef = doc(db, "Posts", postId);
  const postDoc = await getDoc(postRef);
  const userEmail = auth.currentUser?.email || "none";
  const userRef = doc(db, "Users", userEmail);

  if (postDoc.exists()) {
    const postData = postDoc.data();
    const authorRef = doc(db, "Users", postData.authorEmail || "none");
    const authorDoc = await getDoc(authorRef);
    const authorData = authorDoc.data();
    // Sprawdź, czy użytkownik faktycznie polubił post
      console.log("User has liked this post", postId, authorData?.notifications?.likes?.[userEmail])
      // Użytkownik polubił ten post, zmniejsz liczbę polubień i usuń z powiadomień
      const likes = postData?.numberOfLikes || 0;
      await setDoc(postRef, { numberOfLikes: likes - 1 }, { merge: true });
      await updateDoc(authorRef, {
        [`notifications.likes.${userEmail}`]: deleteField()
      });
    // W przeciwnym razie, jeśli użytkownik nie polubił posta, nie rób nic
  }
}

export const findUserByEmail = async (authorEmail: string) => {
  try {
    const docRef = doc(db, "Users", authorEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log("Document data:", userData);
      return {
        id: userData.id || "",
        email: userData.email || "",
        name: userData.name || "",
        uniqueId: userData.uniqueId || "",
        description: userData.description || "",
        from: userData.from || "",
        link: userData.link || "",
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
};
