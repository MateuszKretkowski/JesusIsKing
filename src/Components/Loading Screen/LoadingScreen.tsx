import React from 'react'
import "./LoadingScreen.css";
import { motion } from 'framer-motion';

function LoadingScreen({isFullScreen}: {isFullScreen: boolean}) {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2 }}
    className={isFullScreen ? 'LoadingScreen' : 'LoadingScreen-small'}
    >
      <motion.span className={isFullScreen ? "loader" : "loader-small"} />
    </motion.div>
  )
}

export default LoadingScreen
