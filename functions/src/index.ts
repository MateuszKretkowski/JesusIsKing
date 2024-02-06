import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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
