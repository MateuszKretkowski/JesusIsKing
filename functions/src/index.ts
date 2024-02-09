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

  // Użyj user.uid jako ID dokumentu
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

  // Pobierz dane przesłane z formularza
  const userId = context.auth.uid;
  const userData = data;
  console.log(userData, userId);
  // Aktualizacja danych użytkownika w Firestore
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
