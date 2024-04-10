import React from 'react'
import "./LoadingScreen.css";
import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2 }}
    className='LoadingScreen'
    >
      <motion.span className="loader" />
    </motion.div>
  )
}

export default LoadingScreen
