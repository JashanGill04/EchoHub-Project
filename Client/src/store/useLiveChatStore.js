import {create} from "zustand";
import {socket} from "../lib/socket";


export const useLiveChatStore = create((set)=>({
    messages:[],
    
    initChat: () =>{
        socket.off("chat:receive"); // 🔥 IMPORTANT
 
        socket.on("chat:receive",(message)=>{
            console.log("message received",message)
            set((state)=>({
                messages: [...state.messages,message],
            }));
        })
    },
    
    sendMessage: ({sessionId,text,user})=>{
       const message={
        text,
        sessionId:sessionId,
        senderId:user.id,
        senderName:user.name,
        createdAT:new Date().toISOString(),
       };

       socket.emit("chat:send",{sessionId,message});
        
       set((state)=>({
        messages:[...state.messages,message],
       }))

    },

    clearchat:()=>set({messages:[]}),

}));