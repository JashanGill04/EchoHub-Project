import React, { useEffect } from "react";
import { useChatStore } from '../store/useChatStore'
import Sidebar from "../Component/Sidebar.jsx";
import NoChatSelected from "../Component/NoChatSelected.jsx";
import ChatContainer from "../Component/ChatContainer.jsx";
import { AnimatePresence, motion } from "framer-motion";

const Chatting=()=>{
  const {selectedUser}=useChatStore();
  useEffect(()=>{
    console.log("no contact selected");      
  },[selectedUser]);

    return (
        <div className="h-screen w-screen bg-base-200">
     <div className='flex items-center justify-center pt-20 px-4'>
      <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-screen h-[calc(100vh-8rem)]'>
        <div className='flex h-full rounded-lg overflow-hidden'>
         <Sidebar />
<AnimatePresence mode="wait">
  {!selectedUser ? (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <NoChatSelected />
    </motion.div>
  ) : (
    <motion.div
      key={selectedUser.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1"
    >
      <ChatContainer key={selectedUser.id} />
    </motion.div>
  )}
</AnimatePresence>        </div>

      </div>
     </div>
     </div>
    )
}

export default Chatting;