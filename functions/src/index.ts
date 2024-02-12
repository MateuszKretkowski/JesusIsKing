import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import {
//   onDocumentUpdated,
// } from "firebase-functions/v2/firestore";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
exports.createUserDocument = functions.auth.user().onCreate((user) => {
  const db = admin.firestore();

  return db.collection("Users").doc(user.uid).set({
    id: user.uid,
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
      HttpsError("failed-precondition", "while authenticated.");
  }

  try {
    const blogName = data.name; // Przekazana wartość name z danych wejściowych
    const blogsRef = admin.firestore().collection('Blogs');
    const snapshot = await blogsRef.where('name', '==', blogName).get();
    if (snapshot.empty) {
      return { result: "No matching documents found to delete." };
    }

    // Usunięcie wszystkich pasujących dokumentów
    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Blog with ID ${snapshot} deleted`);
    return {result: "Blog deleted successfully"};
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new functions.
        https.
        HttpsError("internal", "cannot delete blog: " + error.message);
    } else {
      throw new functions.
        https.
        HttpsError("internal", "Could not delete blog & not instanceofblog");
    }
  }
});
