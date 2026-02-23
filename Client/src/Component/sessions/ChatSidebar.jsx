import { useEffect, useRef, useState } from "react";
import { useLiveChatStore } from "../../store/useLiveChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useParams } from "react-router-dom";
import {  motion ,AnimatePresence } from "framer-motion"; // 👈 Import Framer Motion
// ... other imports

const ChatSidebar = () => {
  const { sessionId } = useParams();
  const { authUser } = useAuthStore();
  const { messages, initChat, sendMessage} = useLiveChatStore();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initChat(sessionId);
  }, [sessionId]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({ sessionId, text, user: authUser });
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}> {/* 👈 Wraps animated list */}
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === authUser?.id;
            return (
              <motion.div
                key={idx} // Ensure this is unique; if possible use msg.id or timestamp
                initial={{ opacity: 0, y: 10, scale: 0.95 }} // Start state
                animate={{ opacity: 1, y: 0, scale: 1 }}    // End state
                transition={{ duration: 0.2, ease: "easeOut" }} // Smoothness
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] opacity-50 mb-1 px-1">
                  {isMe ? "You" : msg.senderName}
                </span>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm
                    ${isMe 
                        ? "bg-primary text-primary-content rounded-tr-none" 
                        : "bg-base-200 text-base-content rounded-tl-none"
                    }`}
                >
                  <p className="leading-relaxed break-words">{msg.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-base-300 bg-base-100">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="input input-bordered flex-1 input-sm focus:outline-none focus:border-primary"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="btn btn-primary btn-sm px-4">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatSidebar;
