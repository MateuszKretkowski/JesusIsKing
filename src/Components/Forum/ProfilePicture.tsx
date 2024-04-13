import React, { useEffect, useState } from "react";
import "./ProfilePicture.css";
import { motion, useAnimation } from "framer-motion";
import { getStorage, ref } from "firebase/storage";
import { auth, db, upload } from "../config/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

function ProfilePicture({
  email,
  isAbleToChange,
}: {
  email: string;
  isAbleToChange: boolean;
}) {
  const { currentUser } = auth?.currentUser;
  const storage = getStorage();
  const storageRef = ref(storage);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  function handleChange(e: any) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      console.log("Photo selected.", e.target.files[0]);
      setIsUploadVisible(true);
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
    controls.start("uploaded");
    upload(photo, email)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading photo:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    const setPhoto = async () => {
      console.log("Email is:", email);
      if (!email) {
        return console.error("No email provided.");
      }
      try {
        const userDocRef = doc(db, "Users", email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const avaratURL = docSnap.data().avatar || currentUser?.photoURL;
          setPhotoURL(avaratURL);
          console.log("photoURL is:", photoURL);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
    setPhoto();
  }, [handleClick]);

  const controls = useAnimation();
  const uploadVariants = {
    hidden: {
      opacity: 0,
      y: -100
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    uploaded: {
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.5,
        type: "spring"
      },
    }
  }
  useEffect(() => {
    isUploadVisible ? controls.start("visible") : controls.start("hidden");
  }, [isUploadVisible])

  return (
    <motion.div className="ProfilePicture-wrapper">
        {isAbleToChange && (
            <motion.input
              type="file"
              onChange={handleChange}
              className="avatar_input"
            />
        )}
          <img src={photoURL} alt="Avatar" className="avatar" />
        {isAbleToChange && (
            <motion.h2
              className="avatar_edit"
            >EDIT</motion.h2>
        )}
      {isAbleToChange && (
        <motion.div className="avatar_upload-wrapper">
          <motion.button
            disabled={!photo}
            onClick={handleClick}
            className="avatar_upload"
            variants={uploadVariants}
            initial={controls}
            animate={controls}
          >
            UPLOAD
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ProfilePicture;
