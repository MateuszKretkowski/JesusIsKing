import React from 'react'
import "LoadingScreen.css";
import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <motion.div className='LoadingScreen'>
      <motion.span className="loader" />
    </motion.div>
  )
}

export default LoadingScreen
