import React, {useEffect, useState} from "react";
import Navbar from './Components/navBar/navbar.tsx';
import Header from './Components/Header/header.tsx';
import SideBar from "./Components/SideBar/sidebar.tsx";
import Settings from "./Components/Settings/settings.tsx";
import BlogsWrapper from "./Components/Blogs/blogsWrapper.tsx";
import AdminPanel from "./Components/AdminPanel/adminPanel.tsx";
import BlogSite from "./Components/Blogs/blogSite.tsx";
import Forum from "./Components/Forum/Forum.tsx";
import Redirect from "./Components/Google Signin/redirect.tsx";
import Footer from "./Components/Footer/Footer.tsx";
import ErrorPanel from "./Components/ERROR PANEL/ErrorPanel.tsx";
import IsLoadingContext from "./Components/Contexts/isLoadingContext.tsx";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, animate, stagger } from "framer-motion";
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, isUserLoggedIn, signInWithGoogle } from "./Components/config/config.tsx";
import { doc } from "firebase/firestore";
import { setCookie } from "./utils/cookieUtils.ts";
import LoadingScreen from "./Components/Loading Screen/LoadingScreen.tsx";

function App() {

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setCookie("isMobile", "true", 1);
        } else {
            setCookie("isMobile", "false", 1);
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
});

  const [isLoading, setIsLoading]: any = useState(false);

  return (
      <BrowserRouter>
      <IsLoadingContext.Provider value={{ isLoading, setIsLoading }}>

       <div className="App">
         <SideBar />
         {isLoading && <LoadingScreen />}
         {!isLoading && (

           <Routes>
           <Route path="/" element={
             <>
              <Navbar />
              <Header />
              <BlogsWrapper />
              {(isUserLoggedIn() &&
              <Forum />
              )}
              {!isUserLoggedIn() && (
                  <div className="section-title" style={{ cursor: "pointer" }}>
              <motion.h5 className="small_text">
              LOG IN TO SEE MORE JESUSISKING.COM
            </motion.h5>
            </div>
              )}
              <Footer />
              </>
           } />
           <Route path="/user/:name" element={<Settings />} />
           <Route path="/redirect" element={<Redirect />} />
           <Route path="/adminpanel" element={<AdminPanel />} />
           <Route path="/blogs" element={<BlogSite />} />
           <Route path="/error" element={<ErrorPanel />} />
          </Routes>
      )}
        </div>
           </IsLoadingContext.Provider>
      </BrowserRouter>
  );
}

export default App;
