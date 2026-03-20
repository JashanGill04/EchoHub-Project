import React, { useEffect ,useRef } from 'react'
import { useChatStore } from '../../store/useChatStore.js'
import ChatHeader from'./ChatHeader.jsx'
import MessageInput from'./MessageInput.jsx' 
import { useAuthStore } from '../../store/useAuthStore.js'
import { formatMessageTime } from "../../lib/utils.js";

const ChatContainer = () => {
  const {messages,isMessagesLoading,selectedUser,getMessages,initChat}=useChatStore();
  const {authUser}= useAuthStore();
    const messageEndRef = useRef(null);
    
    
    useEffect(() => {
        if (!selectedUser) return;
      console.log("i am used");
      getMessages(selectedUser.id);
    }, [selectedUser]);
    
    useEffect(() => {
      initChat();
    }, []);
    
    
    useEffect(()=>{
      if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({behavior:"smooth"});
      }
    },[messages]);
    
    if (!selectedUser) return null;
 {isMessagesLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 backdrop-blur-sm z-10">
    <span className="loading loading-dots loading-md"></span>
  </div>
)}
 
  return (
    <div className='"flex-1 w-full overflow-auto  '>
<ChatHeader/>
<div className="flex-1 overflow-y-auto p-4 space-y-4 h-95">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${message.senderId === authUser.id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser.id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
<MessageInput/>


    </div>
  )
}

export default ChatContainer