import React from 'react'
import './addnotation.css'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'

function Addnotation(name: string) {
    return (
        <motion.div className='addnotation'>
            <motion.div className='addnotation_container'> 
                <motion.div className='icon-wrapper'>
                    <FontAwesomeIcon icon={faBullhorn} />
                </motion.div>
                <motion.div className='name-wrapper'>
                    <h1 className='name'>{name}</h1>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default Addnotation
