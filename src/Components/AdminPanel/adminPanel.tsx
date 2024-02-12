import React, { useState } from 'react'
import "./adminPanel.css";
import AdminModal from "./adminModal.tsx";

function AdminPanel() {
  const [showModal, setShowModal] = useState(false);
  const [isCDE, setIsCDE] = useState(0); // Add this state
  const CAB = () => {
    setShowModal(!showModal);
    setIsCDE(1); // Set the state to 1 for creating a blog
  };

  const DAB = () => {
    setShowModal(!showModal);
    setIsCDE(2); // Set the state to 2 for deleting a blog
  };

  const EAB = () => {
    setShowModal(!showModal);
    setIsCDE(3); // Set the state to 3 for editing a blog
  };

  return (
    <div className='adminPanel'>
      <div className='adminPanel_container'>
        <div className='admin_title-wrapper'>
            <h1>ADMIN PANEL</h1>
        </div>
        <div className='admin_content_container'>
            <div className='panel-wrapper' style={{opacity: showModal ? 0 : 1}}>
                <h2>BLOGS</h2>
                <div className='panel_action-wrapper'>
                    <button className='action-wrapper' onClick={() => {CAB()}}><h2>CREATE A BLOG</h2></button>
                    <button className='action-wrapper' onClick={() => {DAB()}}><h2>DELETE A BLOG</h2></button>
                    <button className='action-wrapper' onClick={() => {EAB()}}><h2>MODIFY A BLOG</h2></button>
                </div>
            </div>
            <div className='panel-wrapper' style={{opacity: showModal ? 0 : 1}}>
                <h2>USERS</h2>
                <div className='panel_action-wrapper'>
                    <button className='action-wrapper'><h2>BAN A USER</h2></button>
                    <button className='action-wrapper'><h2>UPGRADE A USER TO PREMIUM</h2></button>
                </div>
            </div>
            <div className='panel-wrapper' style={{opacity: showModal ? 0 : 1}}>
                <h2>POSTS</h2>
                <div className='panel_action-wrapper'>
                    <button className='action-wrapper'><h2>DELETE A POST</h2></button>
                </div>
            </div>
        </div>
        <AdminModal showModal={showModal} setShowModal={setShowModal} isCDE={isCDE} setIsCDE={setIsCDE}  />
      </div>
    </div>
  )
}

export default AdminPanel;
