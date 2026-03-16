import { io } from "socket.io-client";


export const socket = io("http://localhost:2002", {
  withCredentials: true,
  autoConnect: true, // IMPORTANT
   // IMPORTANT
});

