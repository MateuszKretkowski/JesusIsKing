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
import { arrayUnion } from "@firebase/firestore";
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
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);

// STORAGE

function encodeEmail(email: string): string {
  return email.replace(/\./g, "_dot_").replace(/@/g, "_at_");
}

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage);

export async function readImage(fileRef: any) {
  getDownloadURL(fileRef)
  .then((url) => {
    // Zwraca URL zdjęcia
    console.log("URL zdjęcia:", url);
    return url;
    // Tutaj możesz użyć URL do wyświetlenia zdjęcia w twojej aplikacji
  })
  .catch((error) => {
    // Obsługa błędu
    console.error("Błąd pobierania URL zdjęcia:", error);
  });
}

export async function upload(file: File, email: string, posts: boolean, postId: string) {
  if (!auth.currentUser || !auth.currentUser.email) {
    console.error("No authenticated user with an email address.");
    return;
  }
  if (posts) {
  const fileRef = ref(storage, `Avatars/${postId}.png`);
  try {
    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(snapshot.ref);

    const postRef = doc(db, "Posts", postId);
    console.log(postId)
    await setDoc(postRef, { image: photoURL }, { merge: true });
    alert("Photo uploaded successfully!");
  } catch (error) {
    console.error("Upload failed:", error);
  }
  }
  else {

    const encodedEmail = encodeEmail(email);
    const fileRef = ref(storage, `Avatars/${encodedEmail}.png`);
    try {
      const snapshot = await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      
      const userRef = doc(db, "Users", email);
      await setDoc(userRef, { avatar: photoURL }, { merge: true });
      alert("Photo uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }
}

// AUTHENTICATION
export const auth = getAuth(app);

export function signInWithGoogle() {
  const auth = getAuth();
  signInWithRedirect(auth, new GoogleAuthProvider());
}

export function saveUserTokenToFirestore(userToken: any) {
  if (!auth.currentUser) return;
  const userRef = doc(db, "Users");
}

interface User {
  id: string;
  name: string;
  description: string;
  link: string;
  from: string;
  email: string;
  notifications: {
    likes: {};
    replies: {};
  };
  uniqueId: string;
}

export let isLoggedIn = false;
export function isUserLoggedIn() {
  isLoggedIn = auth.currentUser;
}

export async function checkIfUserExistsById(userId: string): Promise<boolean> {
  const userRef = doc(db, "Users", userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists();
}

export async function readUserByUsername(
  uniqueId: string,
  setUserData: (userData: User) => void
) {
  // Decode the uniqueId from URL
  const formattedUniqueId = decodeURIComponent(uniqueId)
    .replace(/\+/g, " ")
    .trim();

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
        email: userDoc.data().email,
        link: userDoc.data().link,
        uniqueId: userDoc.data().uniqueId,
      };
      setUserData(userData);
    } else {
      const userData: User = {
        id: "-1",
        name: "-1",
        description: "-1",
        from: "-1",
        link: "-1",
        uniqueId: "-1",
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
      doc(
        db,
        "Users",
        auth.currentUser.email ? auth.currentUser.email : "none"
      ),
      (doc) => {
        const data = doc.data();
        if (data) {
          const user: User = {
            id: userId,
            name: data.name || "",
            uniqueId: data.uniqueId || "",
            email: data.email || "",
            description: data.description || "",
            notifications: data.notifications || {},
            from: data.from || "",
            link: data.link || "",
          };
          setUserData(user);
          return user;
        } else {
          return console.log("User has no Values");
        }
      }
    );
  }
}

export async function readBlogs() {
  if (auth.currentUser) {

    try {
      const blogsCollectionRef = collection(db, "Blogs");
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
}

export async function readPosts() {
  try {
    const postsCollectionRef = collection(db, "Posts");
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

export async function readUserPosts(authorEmail: string) {
  try {
    const userRef = doc(db, "Users", authorEmail);
    const docSnapshot = await getDoc(userRef);
    if (!docSnapshot.exists()) {
      console.log("No post found.");
      return [];
    }
    const userData = docSnapshot.data();
    const q = query(collection(userRef, "UserPosts"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length != 0) {
      const userDoc = querySnapshot.docs;
    }
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
}

export async function readReplies(postId: string) {
  try {
    const postRef = doc(db, "Posts", postId);
    console.log(`Fetching post document to read replies for post: ${postId}`);

    const docSnapshot = await getDoc(postRef);

    if (!docSnapshot.exists()) {
      console.log("No post found.");
      return [];
    }

    const postData = docSnapshot.data();

    const replies = await Promise.all(
      postData.Replies.map(async (replyId: string) => {
        const replyRef = doc(db, "Replies", replyId);
        const replyDoc = await getDoc(replyRef);
        if (replyDoc.exists()) {
          const replyData = replyDoc.data();
          return {
            id: replyDoc.id,
            ...replyData,
          };
        } else {
          return null;
        }
      })
    );

    const filteredReplies = replies.filter((reply: any) => reply !== null);

    return filteredReplies;
  } catch (error) {
    console.error("Error fetching replies:", error);
    return [];
  }
}

export async function likeAPost(postId: string) {
  const postRef = doc(db, "Posts", postId);
  const postDoc = await getDoc(postRef);

  if (postDoc.exists()) {
    const postData = postDoc.data();
    const authorRef = doc(db, "Users", postData.authorEmail);
    const authorDoc = await getDoc(authorRef);
    const authorData = authorDoc?.data();

    const likes = postData?.numberOfLikes || 0;
    if (!postData.likes.includes(auth.currentUser?.email || "")) {
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const likeData = {
        authorEmail: auth.currentUser?.email,
        date: `${day}/${month}/${year}`,
        postId: postId,
      };
      await setDoc(postRef, { numberOfLikes: likes + 1 }, { merge: true });
      const likeRef = await addDoc(collection(db, "Likes"), likeData);
      await setDoc(
        authorRef,
        { notifications: { likes: arrayUnion(likeRef.id) } },
        { merge: true }
      );
      const userLikesRef = doc(db, "Posts", postId);
      const userLikesDoc = await getDoc(userLikesRef);

      await addDoc(collection(db, "Likes"), likeData);

      if (userLikesDoc.exists()) {
        const userLikesData = userLikesDoc.data();
        const likesArray = userLikesData.likes || [];
        console.log("User likes doc", likesArray);
        likesArray.push(auth.currentUser?.email);
        await updateDoc(userLikesRef, { likes: likesArray });
      }
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
    console.log(
      "User has liked this post",
      postId,
      authorData?.notifications?.likes?.[userEmail]
    );
    const likes = postData?.numberOfLikes || 0;
    await setDoc(postRef, { numberOfLikes: likes - 1 }, { merge: true });
    await updateDoc(authorRef, {
      [`notifications.likes.${userEmail}`]: deleteField(),
    });
    const userLikesRef = doc(db, "Posts", postId);
    const userLikesDoc = await getDoc(userLikesRef);

    if (userLikesDoc.exists()) {
      const userLikesData = userLikesDoc.data();
      const likesArray = userLikesData.likes || [];
      const updatedLikesArray = likesArray.filter(
        (email: string) => email !== auth.currentUser?.email
      );
      await updateDoc(userLikesRef, { likes: updatedLikesArray });
    }
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
        avatar: userData.avatar || "",
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
