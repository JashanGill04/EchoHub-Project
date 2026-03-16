import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { socket } from "../lib/socket";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  allUsers:[],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  initChat: async (userId)=>{
     socket.off("newMessage"); // 🔥 IMPORTANT
 
        socket.on("newMessage",(message)=>{
            set((state)=>({
                messages: [...state.messages,message],
            }));
        })
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  
  getAllUsers: async () => {
  try {
    const res = await axiosInstance.get("/messages/allusers");
    set({ allUsers: res.data });
  } catch (error) {
    toast.error(error.response.data.message);
  }
},

  getMessages: async (userId) => {
    console.log("Fetching messages for userId:", userId);
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({
         messages: res.data ,
         isMessagesLoading: false
        });
    } catch (error) {
      toast.error(error.response.data.message);
      set({isMessagesLoading:false})
    } 
  },
  sendMessage: async (messageData) => {
    const { selectedUser} = get();
    const messages= get().messages;
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser.id}`, messageData);
      socket.emit("sendMessage",res.data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: async (selectedUser,userId) => {
    try{
         socket.emit("join-outside-chat",{userId});
         console.log("chat room created");
    }
    catch(err){
           toast.error("Cannot chat");
    }finally{
          set({ selectedUser });
    }
  },
   
  manageCloseRoom: async(selectedUser,userId)=>{
       try{
            socket.emit("leave-chat-room",{userId});
       }catch(err){
        toast.error("cannot close");
       }finally{
        set({selectedUser});
       }
  }


}));