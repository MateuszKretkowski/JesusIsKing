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

exports.createPost = functions.https.onCall((data, context) => {
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
  const userRef = admin.firestore()
    .collection("Users")
    .doc(userEmail);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}
    -${(currentDate.getMonth() + 1)
    .toString().padStart(2, "0")}-${currentDate.getDate()
  .toString().padStart(2, "0")} ${currentDate.getHours()
  .toString().padStart(2, "0")}:${currentDate.getMinutes()
  .toString().padStart(2, "0")}`;
  return userRef.get()
    .then((userDoc) => {
      if (!userDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "User data not found"
        );
      }
      const userData = userDoc.data();
      if (!userData) {
        throw new functions.https.HttpsError(
          "internal",
          "User data is undefined"
        );
      }
      const postData = {
        name: data.name,
        description: data.description,
        authorId: userEmail,
        authorEmail: userData.email,
        author: userData.name,
        date: formattedDate,
        numberOfLikes: 0,
        numberOfReplies: 0,
        numberOfReposts: 0,
      };
      const docRef = admin.firestore().collection("Posts").doc();
      const savePostPromise = docRef.set(postData);
      const userPostRef = userRef.collection("UserPosts").doc(docRef.id);
      const saveUserPostPromise = userPostRef.set({id: docRef.id});
      return Promise.all([savePostPromise, saveUserPostPromise])
        .then(() => {
          console.log("Post Created with id: ", docRef.id);
          return {result: "Post Created successfully!", id: docRef.id};
        })
        .catch((error) => {
          throw new functions.https.HttpsError(
            "internal",
            `Could not create post: ${error.message}`
          );
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

exports.addDailyVerse = functions.https.onCall(() => {
  const books = [
    {name: "genesis", chapters: 50},
    {name: "exodus", chapters: 40},
    {name: "leviticus", chapters: 27},
    {name: "numbers", chapters: 36},
    {name: "deuteronomy", chapters: 34},
    {name: "joshua", chapters: 24},
    {name: "judges", chapters: 21},
    {name: "ruth", chapters: 4},
    {name: "1-samuel", chapters: 31},
    {name: "2-samuel", chapters: 24},
    {name: "1-kings", chapters: 22},
    {name: "2-kings", chapters: 25},
    {name: "1-chronicles", chapters: 29},
    {name: "2-chronicles", chapters: 36},
    {name: "ezra", chapters: 10},
    {name: "nehemiah", chapters: 13},
    {name: "esther", chapters: 10},
    {name: "job", chapters: 42},
    {name: "psalms", chapters: 150},
    {name: "proverbs", chapters: 31},
    {name: "ecclesiastes", chapters: 12},
    {name: "song-of-solomon", chapters: 8},
    {name: "isaiah", chapters: 66},
    {name: "jeremiah", chapters: 52},
    {name: "lamentations", chapters: 5},
    {name: "ezekiel", chapters: 48},
    {name: "daniel", chapters: 12},
    {name: "hosea", chapters: 14},
    {name: "joel", chapters: 3},
    {name: "amos", chapters: 9},
    {name: "obadiah", chapters: 1},
    {name: "jonah", chapters: 4},
    {name: "micah", chapters: 7},
    {name: "nahum", chapters: 3},
    {name: "habakkuk", chapters: 3},
    {name: "zephaniah", chapters: 3},
    {name: "haggai", chapters: 2},
    {name: "zechariah", chapters: 14},
    {name: "malachi", chapters: 4},
    {name: "matthew", chapters: 28},
    {name: "mark", chapters: 16},
    {name: "luke", chapters: 24},
    {name: "john", chapters: 21},
    {name: "acts", chapters: 28},
    {name: "romans", chapters: 16},
    {name: "1-corinthians", chapters: 16},
    {name: "2-corinthians", chapters: 13},
    {name: "galatians", chapters: 6},
    {name: "ephesians", chapters: 6},
    {name: "philippians", chapters: 4},
    {name: "colossians", chapters: 4},
    {name: "1-thessalonians", chapters: 5},
    {name: "2-thessalonians", chapters: 3},
    {name: "1-timothy", chapters: 6},
    {name: "2-timothy", chapters: 4},
    {name: "titus", chapters: 3},
    {name: "philemon", chapters: 1},
    {name: "hebrews", chapters: 13},
    {name: "james", chapters: 5},
    {name: "1-peter", chapters: 5},
    {name: "2-peter", chapters: 3},
    {name: "1-john", chapters: 5},
    {name: "2-john", chapters: 1},
    {name: "3-john", chapters: 1},
    {name: "jude", chapters: 1},
    {name: "revelation", chapters: 22},
  ];
  const selectedBook = books[Math.floor(Math.random() * books.length)];
  const chapter = Math.ceil(Math.random() * selectedBook.chapters);
  const verse = Math.ceil(Math.random() * 30);

  const newVerse = {
    book: selectedBook.name,
    chapter: chapter,
    verse: verse,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const verseRef = admin.firestore().collection("BibleVerse");
  return verseRef.add(newVerse);
});

exports.addDailyVerseAtMidnight = functions.pubsub.schedule("0 0 * * *")
  .timeZone("Europe/Warsaw")
  .onRun(() => {
    const books = [
      {name: "genesis", chapters: 50},
      {name: "exodus", chapters: 40},
      {name: "leviticus", chapters: 27},
      {name: "numbers", chapters: 36},
      {name: "deuteronomy", chapters: 34},
      {name: "joshua", chapters: 24},
      {name: "judges", chapters: 21},
      {name: "ruth", chapters: 4},
      {name: "1-samuel", chapters: 31},
      {name: "2-samuel", chapters: 24},
      {name: "1-kings", chapters: 22},
      {name: "2-kings", chapters: 25},
      {name: "1-chronicles", chapters: 29},
      {name: "2-chronicles", chapters: 36},
      {name: "ezra", chapters: 10},
      {name: "nehemiah", chapters: 13},
      {name: "esther", chapters: 10},
      {name: "job", chapters: 42},
      {name: "psalms", chapters: 150},
      {name: "proverbs", chapters: 31},
      {name: "ecclesiastes", chapters: 12},
      {name: "song-of-solomon", chapters: 8},
      {name: "isaiah", chapters: 66},
      {name: "jeremiah", chapters: 52},
      {name: "lamentations", chapters: 5},
      {name: "ezekiel", chapters: 48},
      {name: "daniel", chapters: 12},
      {name: "hosea", chapters: 14},
      {name: "joel", chapters: 3},
      {name: "amos", chapters: 9},
      {name: "obadiah", chapters: 1},
      {name: "jonah", chapters: 4},
      {name: "micah", chapters: 7},
      {name: "nahum", chapters: 3},
      {name: "habakkuk", chapters: 3},
      {name: "zephaniah", chapters: 3},
      {name: "haggai", chapters: 2},
      {name: "zechariah", chapters: 14},
      {name: "malachi", chapters: 4},
      {name: "matthew", chapters: 28},
      {name: "mark", chapters: 16},
      {name: "luke", chapters: 24},
      {name: "john", chapters: 21},
      {name: "acts", chapters: 28},
      {name: "romans", chapters: 16},
      {name: "1-corinthians", chapters: 16},
      {name: "2-corinthians", chapters: 13},
      {name: "galatians", chapters: 6},
      {name: "ephesians", chapters: 6},
      {name: "philippians", chapters: 4},
      {name: "colossians", chapters: 4},
      {name: "1-thessalonians", chapters: 5},
      {name: "2-thessalonians", chapters: 3},
      {name: "1-timothy", chapters: 6},
      {name: "2-timothy", chapters: 4},
      {name: "titus", chapters: 3},
      {name: "philemon", chapters: 1},
      {name: "hebrews", chapters: 13},
      {name: "james", chapters: 5},
      {name: "1-peter", chapters: 5},
      {name: "2-peter", chapters: 3},
      {name: "1-john", chapters: 5},
      {name: "2-john", chapters: 1},
      {name: "3-john", chapters: 1},
      {name: "jude", chapters: 1},
      {name: "revelation", chapters: 22},
    ];
    const selectedBook = books[Math.floor(Math.random() * books.length)];
    const chapter = Math.ceil(Math.random() * selectedBook.chapters);
    const verse = Math.ceil(Math.random() * 30);

    const newVerse = {
      book: selectedBook.name,
      chapter: chapter,
      verse: verse,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const verseRef = admin.firestore().collection("BibleVerse");
    return verseRef
      .add(newVerse).then(() => console.log("Verse added successfully."))
      .catch((error) => console.error("Error adding verse: ", error));
  });
