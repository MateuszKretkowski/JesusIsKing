import React, {useEffect} from "react";
import Navbar from './Components/navBar/navbar.tsx';
import Header from './Components/Header/header.tsx';
import SideBar from "./Components/SideBar/sidebar.tsx";
import Settings from "./Components/Settings/settings.tsx";
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
              </>
           } />
           <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
