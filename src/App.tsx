import React, {useEffect} from "react";
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
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, animate, stagger } from "framer-motion";
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./Components/config/config.tsx";
import { doc } from "firebase/firestore";

function App() {

  return (
      <BrowserRouter>
       <div className="App">
         <SideBar />
         <Routes>
           <Route path="/" element={
             <>
              <Navbar />
              <Header />
              <BlogsWrapper />
              <Forum />
              <Footer />
              </>
           } />
           <Route path="/user/:name" element={<Settings />} />
           <Route path="/redirect" element={<Redirect />} />
           <Route path="/adminpanel" element={<AdminPanel />} />
           <Route path="/blogs" element={<BlogSite />} />

          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
