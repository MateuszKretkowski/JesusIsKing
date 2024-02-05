import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db, auth } from '../Google Signin/config.js';
import { useNavigate } from 'react-router-dom';
import "./Modal.css";

type ModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
};
const Modal = ({ showModal, setShowModal }: ModalProps) => {

    const navigate = useNavigate();

    const backdrop = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };
    const modal = {
        hidden: { y: "-100vh", opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                className='backdrop'
                variants={backdrop}
                initial="hidden"
                animate="visible"
                exit="hidden"
                >
                    <motion.div className='modal' variants={modal}>
                        <motion.div className='modal_container'>
                            <motion.div className='avatar-wrapper-settings'>
                                <motion.img />
                            </motion.div>
                            <motion.div className='text-wrapper'>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>NAME</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='name'
                                    className='settings-input'
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>DESCRIPTION</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='description'
                                    className='settings-input'
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>LINK</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='links'
                                    className='settings-input'
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>LOCATION</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='from'
                                    className='settings-input'
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div className='modal_action-wrapper'>
                                <motion.button>APPLY CHANGES</motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Modal
