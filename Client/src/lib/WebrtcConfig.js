export const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

//iceServers is an array of server addresses that help your browser figure out its public identity and how to navigate through firewalls to talk to another device.
//STUN stands for Session Traversal Utilities for NAT.
//A STUN server is like a "mirror."
//  Your computer sends a request to it, and the STUN server replies: "Hey, I see you're connecting from this Public IP address and this Port."
//  Google's Server: stun.l.google.com:19302 is a free, public STUN server provided by Google.

