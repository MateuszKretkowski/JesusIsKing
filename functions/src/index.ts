import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import {
//   onDocumentUpdated,
// } from "firebase-functions/v2/firestore";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
exports.authenticateUserDocument = functions.auth.user().onCreate((user) => {
  const db = admin.firestore();
  const userUidSliced = user.uid.slice(0, 15);
  const userEmail = user.email ? user.email : userUidSliced;
  return db.collection("Users").doc(userEmail).set({
    uniqueId: "DEFAULT",
    email: user.email,
    name: user.displayName || "DEFAULT",
    description: "DEAFULT_DESCRIPTION",
    link: "JESUSISKING.COM",
    from: "LOCATION",
  });
});

exports.updateUser = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.
      https.
      HttpsError("failed-precondition", "while authenticated.");
  }

  const userId = context.auth.uid;
  const userData = data;
  console.log(userData, userId);
  return admin.firestore().collection("Users").doc(userId).update(userData)
    .then(() => {
      console.log("user updated");
      return {result: "User updated successfully!"};
    })
    .catch((error) => {
      throw new functions.https.
        HttpsError("internal", "not update user:"+error.message);
    });
});

exports.createBlog = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.
      https.
      HttpsError("failed-precondition", "while authenticated.");
  }

  const userId = context.auth.uid;
  const userRef = admin.firestore().collection("Users").doc(userId);
  const userDoc = await userRef.get();
  const user = userDoc.data();

  const currentDate = new Date();
  const formattedDate = `${currentDate.
    getUTCFullYear()}-${currentDate.
    getUTCMonth() + 1}-${currentDate.getUTCDate()}`;
  const blogData = {
    ...data,
    name: data.name,
    description: data.description,
    authorId: userId,
    author: user ? user.name : "UNKNOWN",
    date: formattedDate,
  };
  console.log(blogData, userId);
  return admin.firestore().collection("Blogs").add(blogData)
    .then(() => {
      console.log("user updated");
      return {result: "User updated successfully!"};
    })
    .catch((error) => {
      throw new functions.https.
        HttpsError("internal", "not update user:"+error.message);
    });
});

exports.exitBlog = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.
      https.
      HttpsError("unauthenticated", "The function while auth.");
  }

  try {
    const blogName = data.name;
    const blogsRef = admin.firestore().collection("Blogs");
    const snapshot = await blogsRef.where("name", "==", blogName).get();

    if (snapshot.empty) {
      return {result: "No matching documents found to delete."};
    }

    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Blogs with name ${blogName} deleted`);
    return {result: "Blogs deleted successfully"};
  } catch (error) {
    if (error instanceof Error) {
      throw new functions.https.HttpsError("internal", error.message);
    } else {
      throw new functions.https.HttpsError("internal", "An error occurred");
    }
  }
});

exports.createPost = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.
      https.
      HttpsError("failed-precondition", "while authenticated.");
  }
  console.log(context.auth.uid);
  const userRef = admin.firestore().collection("Users").doc(context.auth.uid);
  const currentDate = new Date();
  const formattedDate = `${currentDate
    .getUTCFullYear()}-${(currentDate.getUTCMonth() + 1)
    .toString().padStart(2, "0")}-${currentDate.getUTCDate()
    .toString().padStart(2, "0")} ${currentDate.getUTCHours()
    .toString().padStart(2, "0")}:${currentDate.getUTCMinutes()
    .toString()
    .padStart(2, "0")}`;
  return userRef.get()
    .then((userDoc) => {
      if (!userDoc.exists) {
        throw new functions.
          https.
          HttpsError("not-found", "User data not found");
      }
      const userData = userDoc.data();
      if (!userData) {
        throw new functions.
          https.
          HttpsError("internal", "User data is undefined");
      }
      if (!context.auth) {
        throw new functions.
          https.
          HttpsError("failed-precondition", "while authenticated.");
      }
      const postData = {
        name: data.name,
        description: data.description,
        author: userData.name,
        authorDescription: userData.description,
        authorFrom: userData.from,
        authorLink: userData.link,
        authorId: context.auth.uid,
        date: formattedDate,
        numberOfLikes: 0,
        numberOfReplies: 0,
        numberOfReposts: 0,
      };
      const userRef = admin
        .firestore()
        .collection("Users")
        .doc(context.auth.uid);
      const userPostRef = userRef.collection("UserPosts").doc(postData.name);
      const docRef = admin.firestore().collection("Posts").doc(data.name);
      const savePostPromise = docRef.set(postData);
      const saveUserPostPromise = userPostRef.set({id: postData.name});
      return Promise.all([savePostPromise, saveUserPostPromise])
        .then(() => {
          console.log("Post Created with id: ", data.name);
          return {result: "Post Created successfully!"};
        })
        .catch((error) => {
          throw new functions.https.
            HttpsError("internal", "not create post:"+error.message);
        });
    });
});

exports.createUserAt = functions.https.onCall((data) => {
  const db = admin.firestore();
  const userId = data.userId;
  if (!userId || typeof userId !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "ntbvu");
  }
  return db.collection("Users").doc(userId).create({slem: "ss"})
    .then(() => {
      console.log(userId, "this is a new document");
      return {userId: userId};
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      throw new functions
        .https
        .HttpsError("unknown", "Failed to create user document", error);
    });
});
