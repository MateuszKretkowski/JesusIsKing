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
    throw new functions
      .https
      .HttpsError("failed-precondition", "while authenticated.");
  }

  // Pobieranie UID z kontekstu autoryzacji
  const userId = context.auth.uid;

  return admin.auth().getUser(userId)
    .then((userRecord) => {
      const userEmail = userRecord.email;
      const userData = data;
      if (userEmail) {
        return admin.firestore().collection("Users")
          .doc(userEmail)
          .update(userData)
          .then(() => {
            console.log("User updated");
            return {result: "User updated successfully!"};
          });
      }
      return null;
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

    return {result: "Blogs deleted successfully"};
  } catch (error) {
    if (error instanceof Error) {
      throw new functions.https.HttpsError("internal", error.message);
    } else {
      throw new functions.https.HttpsError("internal", "An error occurred");
    }
  }
});

exports.createPost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  const userEmail = context.auth.token.email || null;
  if (!userEmail) {
    throw new functions.https.HttpsError("not-found", "Unable.");
  }
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${
    (currentDate.getMonth() + 1).toString().padStart(2, "0")
  }-${currentDate.getDate().toString().padStart(2, "0")} ${
    currentDate.getHours().toString().padStart(2, "0")
  }:${currentDate.getMinutes().toString().padStart(2, "0")}`;

  const postData = {
    id: data.id,
    name: data.name,
    description: data.description,
    authorId: userEmail,
    date: formattedDate,
    image: "",
    likes: [],
    numberOfLikes: 0,
    numberOfReplies: 0,
    numberOfReposts: 0,
  };

  try {
    await admin.firestore().collection("Posts").doc(postData.id).set(postData);
    console.log("Post Created");
    return {result: "Post Created successfully!"};
  } catch (error) {
    console.error("Error creating post:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error creating post."
    );
  }
});


exports.createReply = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  const currentUserEmail = context.auth?.token.email || null;
  if (!currentUserEmail) {
    throw new functions.https.HttpsError("not-found", "Unable.");
  }
  try {
    const postRef = admin.firestore().collection("Posts").doc(data.postId);
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate
      .getMonth() + 1)
      .toString().padStart(2, "0")}-${currentDate.getDate()
      .toString().padStart(2, "0")} ${currentDate.getHours()
      .toString().padStart(2, "0")}:${currentDate.getMinutes()
      .toString().padStart(2, "0")}`;

    const replyData = {
      name: data.name,
      authorEmail: data.authorEmail,
      date: formattedDate,
      postId: data.postId,
    };
    const replyRef = await admin.firestore()
      .collection("Replies").add(replyData);

    const postSnapshot = await postRef.get();
    const currentReplies = postSnapshot.data()?.Replies || [];
    const updatedReplies = [...currentReplies, replyRef.id];
    const postUpdate = {
      Replies: updatedReplies,
    };
    await postRef.update(postUpdate);

    const currentUserRef = admin.firestore()
      .collection("Users").doc(currentUserEmail);
    const currentUserDoc = await currentUserRef.get();
    if (!currentUserDoc.exists) {
      throw new functions.https.HttpsError("not-found", "un found");
    }
    const userRepliesRef = admin.firestore()
      .collection("Users")
      .doc(currentUserEmail).collection("UserReplies");
    await userRepliesRef.doc(replyRef.id);

    const userRef = admin.firestore().collection("Users").doc(data.authorEmail);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError("not-found", "un found");
    }
    const userUpdate = {
      notifications: {
        replies: admin.firestore.FieldValue.arrayUnion(replyRef.id),
      },
    };
    await userRef.set(userUpdate, {merge: true});

    console.log("Reply created and user notified");
    return {result: "Reply created and user notified", id: "replyRef.id"};
  } catch (error: any) {
    console.error("Error creating reply: ", error);
    throw new functions
      .https
      .HttpsError("internal", `Could not create reply: ${error.message}`);
  }
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
