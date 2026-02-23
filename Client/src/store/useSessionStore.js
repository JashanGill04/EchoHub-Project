import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useSessionStore = create((set) => ({
  sessions: [],
  selectedSession: null,
  iscreatingSession: false,
  isSessionLoading: false,
  joinRequest:[],
  isJoinRequestLoading:false,

  getSessions: async () => {
    set({ isSessionLoading: true });
    try {
      const res = await axiosInstance.get("/session"); 
      set({ sessions: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch sessions");
    } finally {
      set({ isSessionLoading: false });
    }
  },

  getSessionById: async (id) => {
    set({ isSessionLoading: true });
    try {
      const res = await axiosInstance.get(`/session/${id}`); 
      console.log("Fetched session:", res.data);
      set({ selectedSession: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch session");
    } finally {
      set({ isSessionLoading: false });
    }
  },

  createSession: async (title,navigate) => {
    if (!title.trim()) {
      toast.error("Session title is required");
      return;
    }

    set({ iscreatingSession: true });
    try {
      const res = await axiosInstance.post("/session", { title }); 
      const sessionId = res.data.session.id;
      toast.success("Session created successfully");
      
      // optional: add to session list immediately
      set((state) => ({
        sessions: [res.data.session, ...state.sessions],
      }));
        navigate(`/sessions/${sessionId}`);


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create session");
    } finally {
      set({ iscreatingSession: false });
    }
  },

  requestToJoin: async (sessionId)=>{
    try{
      console.log("Requesting to join session:", sessionId);
      await axiosInstance.post(`/join-requests/request/${sessionId}`);
      toast.success("Join request sent");
    }catch(error){
      toast.error(error?.response?.data?.message || "Failed to send join request");
    }
  },


  getJoinRequests: async (sessionId)=>{
    set({ isJoinRequestLoading: true });
    try{
      const res=await axiosInstance.get(`/join-requests/requests/${sessionId}`);
      set({ joinRequest: res.data });
    }catch(error){
      toast.error(error?.response?.data?.message || "Failed to fetch join requests");
    }finally{
      set({ isJoinRequestLoading: false });
    }
  },

  acceptJoinRequest: async (requestId) => {
  await axiosInstance.post(`/join-requests/accept/${requestId}`);
  
  set((state) => ({
      joinRequest: state.joinRequest.filter(
        (req) => req.id !== requestId
      ),
    }));

 
  
    toast.success("User accepted");
},

rejectJoinRequest: async (requestId) => {
  await axiosInstance.post(`/join-requests/reject/${requestId}`);
    set((state) => ({
      joinRequest: state.joinRequest.filter(
        (req) => req.id !== requestId
      ),
    }));
  toast.success("Request rejected");
},

leaveSession: async (sessionId) => {
  try {
    console.log("Leaving session:", sessionId);
    const res = await axiosInstance.post(
      `/session/${sessionId}/leaveSession`
    );
    return res.data;
  } catch (err) {
    toast.error("Failed to leave session",err);
  }
},

}));
