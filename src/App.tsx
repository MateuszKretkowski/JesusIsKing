import React, {useEffect} from "react";
import Navbar from './Components/navBar/navbar.tsx';
import Header from './Components/Header/header.tsx';
import SideBar from "./Components/SideBar/sidebar.tsx";
import Settings from "./Components/Settings/settings.tsx";
import BlogsWrapper from "./Components/Blogs/blogsWrapper.tsx";
import AdminPanel from "./Components/AdminPanel/adminPanel.tsx";
import BlogSite from "./Components/Blogs/blogSite.tsx";
import Forum from "./Components/Forum/Forum.tsx";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, animate, stagger } from "framer-motion";
import './App.css';

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
              </>
           } />
           <Route path="/settings" element={<Settings />} />
           <Route path="/adminpanel" element={<AdminPanel />} />
           <Route path="/blogs" element={<BlogSite />} />

          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
