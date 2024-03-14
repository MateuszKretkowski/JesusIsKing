import React, { useState, useEffect, useRef } from "react";
import "./footer.css";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
  useInView,
  useAnimate,
  delay,
} from "framer-motion";
import SideBar from "../SideBar/sidebar";
const jikFooter = require("../../Images/JIK-Logo-long 2.png");

const Footer = () => {
    
    const [isHovered, setHovered] = useState(false);
    
    return (
        <motion.div className="Footer">
            <motion.div className="footer_container">
                <motion.div className="footer-wrapper">
                {/* <motion.div className="footer_img-wrapper">
                    <motion.img src={jikFooter} className="footer_img" />
                </motion.div> */}
                <motion.div className="footer_text-wrapper">
                    <motion.a className="contactme" style={{ opacity: isHovered ? 1 : 0}}><motion.h1 className="footer_text">CONTACT ME BY CLICKING MY NAME</motion.h1></motion.a>
                    <motion.a className="contactme" style={{cursor: "default", opacity: isHovered ? 1 : 0}} transition={{delay: 1}} href="" ><motion.h1 className="footer_text">CONTACT ME BY WRITING TO ME DIRECTLY IN JIK</motion.h1></motion.a>
                    <motion.h1 className="footer_text">DESIGNED BY <motion.h1 className="footer_text">MATEUSZ KRETKOWSKI</motion.h1></motion.h1>
                    <motion.h1 className="footer_text">CREATED BY <motion.h1 className="footer_text">MATEUSZ KRETKOWSKI</motion.h1></motion.h1>
                    <motion.h1 className="footer_text">CODED BY <motion.a href="https://mateuszkretkowski-74dcb.web.app/" target="_blank"><motion.h1 className="footer_text me" onHoverEnd={() => {setHovered(false)}} onHoverStart={() => {setHovered(true)}}>MATEUSZ KRETKOWSKI</motion.h1></motion.a></motion.h1>
                    <motion.h1 className="footer_text">© {new Date().getFullYear()} JESUSISKING. ALL RIGHTS RESERVED.</motion.h1>
                </motion.div>
                    <motion.h1 className="footer_text motto">BE KIND. BE GREAT. BE WORTH</motion.h1>
                    
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Footer;