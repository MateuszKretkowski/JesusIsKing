import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { getStorage, ref } from 'firebase/storage';
import { auth, db, upload } from '../config/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function ProfilePicture(email: string, isAbleToChange: boolean) {
    const { currentUser } = auth?.currentUser;
    const storage = getStorage();
    const storageRef = ref(storage);    
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    function handleChange(e) {
      if (e.target.files[0]) {
        setPhoto(e.target.files[0]);
      } else {
        console.error("No file selected.");
      }
    }
    
      function handleClick() {
        if (!photo) {
          console.error("No photo to upload.");
          return;
        }
        console.log("Uploading photo...");
      
        setLoading(true);
        upload(photo).then(() => {
          setLoading(false);
        }).then(() => {
          const userRef = doc(db, 'users', email);
          setDoc(userRef, { avatar: photoURL }, { merge: true })
            .then(() => {
              console.log("Avatar uploaded successfully.");
            })
            .catch((error) => {
              console.error("Error uploading avatar:", error);
            });
        }).catch(error => {
          console.error("Error uploading photo:", error);
          setLoading(false);
        });
      }
    
//       useEffect(() => {
//         const setPhoto = async () => {
//           if (!email) {
//             return console.error("No email provided.");
//           }
//             try {
//               console.log('DB instance:', db);
// console.log('Email:', email, 'Type of email:', typeof email);
//               const userRef = doc(db, 'Users', email);
//               console.log("aaa")
//                 const docSnap = await getDoc(userRef);
//                 if (docSnap.exists()) {
//                     console.log("Document data:", docSnap.data());
//                     const photoURL = docSnap.data().photoURL || currentUser.photoURL;
//                     console.log("Setting photo URL:", photoURL);
//                 } else {
//                     console.log("No such document!");
//                 }
//             } catch (error) {
//                 console.error("Error getting document:", error);
//             }
//         };
//         setPhoto();
//     }, []);

// TOMORROW
  

    return (
    <motion.div className='ProfilePicture-wrapper'>
      {isAbleToChange && (
        <div>
          <input type="file" onChange={handleChange} />
          <button disabled={!photo} onClick={handleClick}>Upload</button>
        </div>
      )}
      <img src={photoURL} alt="Avatar" className="avatar" />
    </motion.div>
  );
}

export default ProfilePicture;
