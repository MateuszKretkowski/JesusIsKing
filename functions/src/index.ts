import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
  Change,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";


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

exports.readUser = onDocumentUpdated("users/{id}", (event) => {
  const userValues =  event.data.after.data();
});


export default function updateUser (name: string){

  return( onDocumentUpdated("users/{id}", (event) => {
      const data = event.data.after.data();
      const previousData = event.data.before.data();

      if (data == previousData) {
        return null;
      }

      return data.after.ref.set({
        
      })
    })
  )
}