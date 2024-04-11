import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { getStorage, ref } from 'firebase/storage';
import { auth, upload } from '../config/config';

function ProfilePicture() {
    const { currentUser } = auth?.currentUser;
    const storage = getStorage();
    const storageRef = ref(storage);    
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    function handleChange(e) {
        if (e.target.files[0]) {
          setPhoto(e.target.files[0])
        }
      }
    
      function handleClick() {
        upload(photo, currentUser, setLoading);
      }
    
      useEffect(() => {
        if (currentUser?.photoURL) {
          setPhotoURL(currentUser.photoURL);
        }
      }, [currentUser])
  

    return (
    <motion.div className='ProfilePicture-wrapper' onClick={() => {handleClick();}}>
      <input type="file" onChange={handleChange} />
      <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
      <img src={photoURL} alt="Avatar" className="avatar" />
    </motion.div>
  );
}

export default ProfilePicture;
